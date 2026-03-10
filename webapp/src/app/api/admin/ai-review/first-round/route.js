import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getGeminiClient } from "@/lib/chatbot";

/**
 * POST /api/admin/ai-review/first-round
 * 1차 AI 심사 — 사전규격 통과 작품 대상 Gemini 심사
 *
 * 관리자가 입력한 RAG 문서(대회 요강)를 기반으로 심사 기준에 따라 평가.
 * review_criteria 테이블의 first_round 기준 사용.
 *
 * Body: { submission_ids?: string[] }
 */

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: userData } = await createAdminClient().from("users").select("role").eq("id", user.id).single();
    if (!userData || userData.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { submission_ids } = body;
    const adminClient = createAdminClient();

    // 1. Load review criteria for 1st round
    const { data: criteria } = await adminClient
      .from("review_criteria")
      .select("*")
      .eq("stage", "first_round")
      .eq("is_active", true)
      .order("sort_order");

    // Build criteria prompt from DB (fallback to hardcoded)
    const criteriaList = (criteria?.length > 0) ? criteria : [
      { criteria_key: "creativity", criteria_label: "창의성", criteria_description: "아이디어의 참신함과 독창성", weight: 30 },
      { criteria_key: "technical", criteria_label: "기술성", criteria_description: "AI 기술 활용도 및 구현 완성도", weight: 30 },
      { criteria_key: "utility", criteria_label: "활용성", criteria_description: "실생활 적용 가능성 및 교육적 효과", weight: 30 },
      { criteria_key: "completeness", criteria_label: "완성도", criteria_description: "프로젝트 완성도 및 발표 자료", weight: 10 },
    ];

    const criteriaPrompt = criteriaList.map((c) =>
      `- ${c.criteria_label} (${c.weight}점): ${c.criteria_description || ""}`
    ).join("\n");

    const totalWeight = criteriaList.reduce((s, c) => s + (c.weight || 0), 0);

    // 2. Load RAG documents for context
    let ragContext = "";
    try {
      const { data: docs } = await adminClient
        .from("contest_documents")
        .select("title, content")
        .limit(10);
      if (docs?.length > 0) {
        ragContext = "\n\n--- 대회 요강 참고 자료 ---\n" +
          docs.map((d) => `[${d.title}]: ${d.content}`).join("\n\n") +
          "\n--- 참고 자료 끝 ---";
      }
    } catch { /* no RAG docs */ }

    const SYSTEM_PROMPT = `당신은 "제8회 교육 공공데이터 AI활용대회"의 1차 AI 심사관입니다.

아래 심사 기준에 따라 작품을 평가하세요:
${criteriaPrompt}

총점: ${totalWeight}점 만점
${ragContext}

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트를 포함하지 마세요:
{
  "scores": {
    ${criteriaList.map((c) => `"${c.criteria_key}": { "score": 0, "max": ${c.weight}, "comment": "평가 코멘트" }`).join(",\n    ")}
  },
  "total_score": 0,
  "summary": "한 줄 총평",
  "strengths": ["강점1", "강점2"],
  "improvements": ["개선사항1", "개선사항2"],
  "recommendation": "pass 또는 review_needed 또는 reject"
}`;

    // 3. Find pre-screening passed submissions
    let query = adminClient
      .from("submissions")
      .select("id, submission_no, title, category, description, team_name, submission_files(file_name, file_size)")
      .eq("review_stage", "pre_screening_pass");

    if (submission_ids?.length > 0) query = query.in("id", submission_ids);

    const { data: submissions, error: fetchError } = await query;

    if (fetchError) {
      console.error("First-round fetch error:", fetchError.message);
      return NextResponse.json({ error: "작품 조회 실패" }, { status: 500 });
    }

    if (!submissions?.length) {
      return NextResponse.json({ processed: 0, reviewed: 0, failed: 0, message: "1차 심사 대상이 없습니다. 사전규격 심사를 먼저 실행하세요." });
    }

    // 4. Mark as processing
    await adminClient
      .from("submissions")
      .update({ review_stage: "first_round" })
      .in("id", submissions.map((s) => s.id));

    // 5. Process each with Gemini
    const ai = getGeminiClient();
    let reviewed = 0, failedCount = 0;

    for (const sub of submissions) {
      try {
        const prompt = `작품 제목: ${sub.title || "(제목 없음)"}
부문: ${sub.category || "미정"}
팀명: ${sub.team_name || "개인"}
설명: ${sub.description || "(설명 없음)"}
첨부 파일: ${sub.submission_files?.map((f) => `${f.file_name} (${(f.file_size / 1024 / 1024).toFixed(1)}MB)`).join(", ") || "없음"}`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          config: {
            temperature: 0.3,
            maxOutputTokens: 1500,
            systemInstruction: SYSTEM_PROMPT,
          },
          contents: prompt,
        });

        const resultText = response.text || "";
        let reviewResult;
        try {
          const jsonMatch = resultText.match(/\{[\s\S]*\}/);
          reviewResult = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch { reviewResult = null; }

        await adminClient.from("submissions").update({
          review_stage: "first_round_done",
          first_round_result: reviewResult || { raw: resultText },
          first_round_score: reviewResult?.total_score || null,
          ai_review_status: "completed",
        }).eq("id", sub.id);

        // Also update ai_review_queue if exists
        await adminClient.from("ai_review_queue").upsert({
          submission_id: sub.id,
          status: "completed",
          ai_score: reviewResult?.total_score || null,
          ai_feedback: reviewResult || { raw: resultText },
          ai_provider: "google",
          ai_model: "gemini-3-flash-preview",
          completed_at: new Date().toISOString(),
        }, { onConflict: "submission_id" }).select();

        reviewed++;
      } catch (err) {
        console.error(`1st round review failed for ${sub.submission_no}:`, err.message);

        await adminClient.from("submissions").update({
          review_stage: "pre_screening_pass", // rollback to allow retry
          ai_review_status: "failed",
        }).eq("id", sub.id);

        failedCount++;
      }

      // Rate limit delay
      if (submissions.indexOf(sub) < submissions.length - 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    return NextResponse.json({
      processed: submissions.length, reviewed, failed: failedCount,
      message: `1차 심사 완료: ${reviewed}건 심사, ${failedCount}건 실패`,
    });
  } catch (err) {
    console.error("POST first-round error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
