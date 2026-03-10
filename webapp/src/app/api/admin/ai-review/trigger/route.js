import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getGeminiClient } from "@/lib/chatbot";

/**
 * POST /api/admin/ai-review/trigger
 * Manual AI review trigger — queues submissions then processes with Gemini.
 *
 * Flow:
 *   1. Find submissions with ai_review_status = 'pending'
 *   2. Queue them in ai_review_queue
 *   3. Process each: Gemini reads title + description → generates review
 *   4. Save review result to ai_review_queue + update submission status
 *
 * Body (optional): { submission_ids: string[] } — specific IDs to review
 */

const REVIEW_SYSTEM_PROMPT = `당신은 "제8회 교육 공공데이터 AI활용대회"의 AI 예비 심사관입니다.

심사 기준:
- 창의성 (30점): 아이디어의 참신함과 독창성
- 기술성 (30점): AI 기술 활용도 및 구현 완성도
- 활용성 (30점): 실생활 적용 가능성 및 교육적 효과
- 완성도 (10점): 프로젝트 완성도 및 발표 자료

작품 제목과 설명을 읽고 다음 JSON 형식으로 예비 심사 결과를 작성하세요:
{
  "creativity_score": 0-30,
  "technical_score": 0-30,
  "utility_score": 0-30,
  "completeness_score": 0-10,
  "total_score": 0-100,
  "summary": "한 줄 총평",
  "strengths": ["강점1", "강점2"],
  "improvements": ["개선사항1", "개선사항2"],
  "recommendation": "pass" 또는 "review_needed" 또는 "reject"
}

반드시 유효한 JSON만 출력하세요. 다른 텍스트를 포함하지 마세요.`;

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

    // 1. Find pending submissions
    let query = adminClient
      .from("submissions")
      .select("id, submission_no, title, category, description, submission_files(file_path, file_name)")
      .eq("ai_review_status", "pending");

    if (submission_ids && Array.isArray(submission_ids) && submission_ids.length > 0) {
      query = query.in("id", submission_ids);
    }

    const { data: submissions, error: fetchError } = await query;

    if (fetchError) {
      console.error("Fetch submissions error:", fetchError.message);
      return NextResponse.json({ error: "작품 목록 조회에 실패했습니다." }, { status: 500 });
    }

    if (!submissions || submissions.length === 0) {
      return NextResponse.json({ queued: 0, reviewed: 0, message: "대기 중인 작품이 없습니다." });
    }

    // 2. Filter out already queued
    const existingQuery = await adminClient
      .from("ai_review_queue")
      .select("submission_id")
      .in("submission_id", submissions.map((s) => s.id))
      .in("status", ["queued", "processing", "completed"]);

    const alreadyProcessed = new Set((existingQuery.data || []).map((r) => r.submission_id));
    const toProcess = submissions.filter((s) => !alreadyProcessed.has(s.id));

    if (toProcess.length === 0) {
      return NextResponse.json({ queued: 0, reviewed: 0, message: "모든 작품이 이미 처리되었습니다." });
    }

    // 3. Queue records
    const queueRecords = toProcess.map((s) => ({
      submission_id: s.id,
      file_url: s.submission_files?.[0]?.file_path || "",
      status: "processing",
      triggered_by: user.id,
    }));

    await adminClient.from("ai_review_queue").insert(queueRecords);
    await adminClient
      .from("submissions")
      .update({ ai_review_status: "queued" })
      .in("id", toProcess.map((s) => s.id));

    // 4. Process each submission with Gemini
    let reviewedCount = 0;
    let failedCount = 0;
    const ai = getGeminiClient();

    for (const sub of toProcess) {
      try {
        const prompt = `작품 제목: ${sub.title || "(제목 없음)"}
부문: ${sub.category || "미정"}
설명: ${sub.description || "(설명 없음)"}
첨부 파일: ${sub.submission_files?.map((f) => f.file_name).join(", ") || "없음"}`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          config: {
            temperature: 0.3,
            maxOutputTokens: 1000,
            systemInstruction: REVIEW_SYSTEM_PROMPT,
          },
          contents: prompt,
        });

        const resultText = response.text || "";

        // Parse JSON from response
        let reviewResult;
        try {
          // Extract JSON from response (handle markdown code blocks)
          const jsonMatch = resultText.match(/\{[\s\S]*\}/);
          reviewResult = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch {
          reviewResult = null;
        }

        // Update queue record with structured fields
        await adminClient
          .from("ai_review_queue")
          .update({
            status: "completed",
            ai_score: reviewResult?.total_score || null,
            ai_feedback: reviewResult || { raw: resultText },
            ai_provider: "google",
            ai_model: "gemini-3-flash-preview",
            completed_at: new Date().toISOString(),
          })
          .eq("submission_id", sub.id)
          .eq("status", "processing");

        // Update submission ai_review_status
        await adminClient
          .from("submissions")
          .update({ ai_review_status: "completed" })
          .eq("id", sub.id);

        reviewedCount++;
      } catch (err) {
        console.error(`AI review failed for ${sub.submission_no}:`, err.message);

        await adminClient
          .from("ai_review_queue")
          .update({
            status: "failed",
            error_message: err.message,
            retry_count: 1,
          })
          .eq("submission_id", sub.id)
          .eq("status", "processing");

        await adminClient
          .from("submissions")
          .update({ ai_review_status: "failed" })
          .eq("id", sub.id);

        failedCount++;
      }

      // Rate limit: 300ms delay between calls
      if (toProcess.indexOf(sub) < toProcess.length - 1) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    return NextResponse.json({
      queued: toProcess.length,
      reviewed: reviewedCount,
      failed: failedCount,
      message: `${reviewedCount}건 심사 완료${failedCount > 0 ? `, ${failedCount}건 실패` : ""}`,
    });
  } catch (err) {
    console.error("POST /api/admin/ai-review/trigger error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
