import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/ai-review/results
 * 심사 결과 조회 — 대시보드 통계 + 작품별 결과
 *
 * Query params:
 *   ?stage=pre_screening|first_round|all (default: all)
 *   ?category=elementary|secondary|general (optional)
 *   ?sort=score_desc|score_asc|submission_no (default: score_desc)
 */
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data: userData } = await createAdminClient().from("users").select("role").eq("id", user.id).single();
    if (!userData || userData.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const stage = searchParams.get("stage") || "all";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "score_desc";

    const adminClient = createAdminClient();

    // 1. Get all submissions with review data
    let query = adminClient
      .from("submissions")
      .select("id, submission_no, title, category, team_name, contact_email, status, review_stage, pre_screening_result, first_round_result, first_round_score, ai_review_status, created_at");

    if (category) query = query.eq("category", category);

    if (stage === "pre_screening") {
      query = query.in("review_stage", ["pre_screening_pass", "pre_screening_fail"]);
    } else if (stage === "first_round") {
      query = query.in("review_stage", ["first_round", "first_round_done"]);
    }
    // else: all

    if (sort === "score_asc") {
      query = query.order("first_round_score", { ascending: true, nullsFirst: false });
    } else if (sort === "score_desc") {
      query = query.order("first_round_score", { ascending: false, nullsFirst: true });
    } else {
      query = query.order("submission_no", { ascending: true });
    }

    const { data: submissions, error } = await query;

    if (error) {
      console.error("Results fetch error:", error.message);
      return NextResponse.json({ error: "조회 실패" }, { status: 500 });
    }

    const all = submissions || [];

    // 2. Compute summary stats
    const totalSubmissions = all.length;
    const preScreeningDone = all.filter((s) => s.review_stage !== "none").length;
    const preScreeningPass = all.filter((s) =>
      ["pre_screening_pass", "first_round", "first_round_done"].includes(s.review_stage)
    ).length;
    const preScreeningFail = all.filter((s) => s.review_stage === "pre_screening_fail").length;
    const firstRoundDone = all.filter((s) => s.review_stage === "first_round_done").length;

    const scored = all.filter((s) => s.first_round_score != null);
    const avgScore = scored.length > 0
      ? Math.round(scored.reduce((s, r) => s + Number(r.first_round_score), 0) / scored.length * 10) / 10
      : 0;
    const maxScore = scored.length > 0 ? Math.max(...scored.map((s) => Number(s.first_round_score))) : 0;
    const minScore = scored.length > 0 ? Math.min(...scored.map((s) => Number(s.first_round_score))) : 0;

    // 3. Score distribution (0-10, 11-20, ..., 91-100)
    const scoreDistribution = Array.from({ length: 10 }, (_, i) => ({
      range: `${i * 10 + 1}-${(i + 1) * 10}`,
      count: 0,
    }));
    scoreDistribution[0].range = "0-10";

    scored.forEach((s) => {
      const score = Number(s.first_round_score);
      const bucket = Math.min(Math.floor(score / 10), 9);
      scoreDistribution[bucket].count++;
    });

    // 4. Category breakdown
    const categoryStats = {};
    for (const cat of ["elementary", "secondary", "general"]) {
      const catSubs = all.filter((s) => s.category === cat);
      const catScored = catSubs.filter((s) => s.first_round_score != null);
      categoryStats[cat] = {
        total: catSubs.length,
        pre_pass: catSubs.filter((s) => ["pre_screening_pass", "first_round", "first_round_done"].includes(s.review_stage)).length,
        first_done: catSubs.filter((s) => s.review_stage === "first_round_done").length,
        avg_score: catScored.length > 0
          ? Math.round(catScored.reduce((s, r) => s + Number(r.first_round_score), 0) / catScored.length * 10) / 10
          : 0,
      };
    }

    // 5. Recommendation breakdown
    const recommendations = { pass: 0, review_needed: 0, reject: 0 };
    scored.forEach((s) => {
      const rec = s.first_round_result?.recommendation;
      if (rec && recommendations[rec] !== undefined) recommendations[rec]++;
    });

    return NextResponse.json({
      summary: {
        total_submissions: totalSubmissions,
        pre_screening_done: preScreeningDone,
        pre_screening_pass: preScreeningPass,
        pre_screening_fail: preScreeningFail,
        first_round_done: firstRoundDone,
        avg_score: avgScore,
        max_score: maxScore,
        min_score: minScore,
      },
      score_distribution: scoreDistribution,
      category_stats: categoryStats,
      recommendations,
      submissions: all,
    });
  } catch (err) {
    console.error("GET results error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
