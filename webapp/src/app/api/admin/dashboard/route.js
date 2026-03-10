import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";

/**
 * GET /api/admin/dashboard
 * Aggregated stats for admin dashboard.
 * Each section is independently error-handled — if a table doesn't exist,
 * that section returns defaults instead of crashing the whole API.
 */

/** Safe count query — returns 0 if table/column doesn't exist */
async function safeCount(client, table, filters = {}) {
  try {
    let q = client.from(table).select("*", { count: "exact", head: true });
    for (const [col, val] of Object.entries(filters)) {
      if (val === null) q = q.is(col, null);
      else q = q.eq(col, val);
    }
    const { count } = await q;
    return count || 0;
  } catch { return 0; }
}

/** Safe count with gte filter */
async function safeCountGte(client, table, col, val) {
  try {
    const { count } = await client.from(table).select("*", { count: "exact", head: true }).gte(col, val);
    return count || 0;
  } catch { return 0; }
}

/** Safe select query — returns [] on error */
async function safeSelect(client, table, columns, opts = {}) {
  try {
    let q = client.from(table).select(columns);
    if (opts.eq) for (const [col, val] of Object.entries(opts.eq)) q = q.eq(col, val);
    if (opts.is) for (const [col, val] of Object.entries(opts.is)) q = q.is(col, val);
    if (opts.in) for (const [col, val] of Object.entries(opts.in)) q = q.in(col, val);
    if (opts.order) q = q.order(opts.order.col, { ascending: opts.order.asc ?? false });
    if (opts.limit) q = q.limit(opts.limit);
    if (opts.gte) for (const [col, val] of Object.entries(opts.gte)) q = q.gte(col, val);
    if (opts.lt) for (const [col, val] of Object.entries(opts.lt)) q = q.lt(col, val);
    const { data } = await q;
    return data || [];
  } catch { return []; }
}

export async function GET() {
  try {
    const { admin, error } = await verifyAdmin();
    if (error) return error;

    // ── KST time calculations ──
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstNow = new Date(now.getTime() + kstOffset);
    const todayStart = new Date(kstNow.getFullYear(), kstNow.getMonth(), kstNow.getDate());
    const todayStartUTC = new Date(todayStart.getTime() - kstOffset).toISOString();
    const dayOfWeek = kstNow.getDay() === 0 ? 6 : kstNow.getDay() - 1;
    const weekStart = new Date(todayStart.getTime() - dayOfWeek * 86400000);
    const weekStartUTC = new Date(weekStart.getTime() - kstOffset).toISOString();

    // ── License stats (safe) ──
    const [licenseTotal, licensePending, licenseApproved, licenseRejected] = await Promise.all([
      safeCount(admin, "license_applications"),
      safeCount(admin, "license_applications", { status: "pending" }),
      safeCount(admin, "license_applications", { status: "approved" }),
      safeCount(admin, "license_applications", { status: "rejected" }),
    ]);

    // ── Submission stats (safe) ──
    const [subTotal, subSubmitted, subReview, subAccepted, subRejected] = await Promise.all([
      safeCount(admin, "submissions"),
      safeCount(admin, "submissions", { status: "submitted" }),
      safeCount(admin, "submissions", { status: "under_review" }),
      safeCount(admin, "submissions", { status: "accepted" }),
      safeCount(admin, "submissions", { status: "rejected" }),
    ]);

    const [catElementary, catSecondary, catGeneral] = await Promise.all([
      safeCount(admin, "submissions", { category: "elementary" }),
      safeCount(admin, "submissions", { category: "secondary" }),
      safeCount(admin, "submissions", { category: "general" }),
    ]);

    const [subToday, subWeek] = await Promise.all([
      safeCountGte(admin, "submissions", "created_at", todayStartUTC),
      safeCountGte(admin, "submissions", "created_at", weekStartUTC),
    ]);

    // ── Recent submissions (safe) ──
    const recentSubmissions = await safeSelect(admin, "submissions",
      "id, submission_no, title, category, status, contact_name, created_at",
      { order: { col: "created_at", asc: false }, limit: 5 });

    // ── Recent licenses (safe) ──
    const recentLicenses = await safeSelect(admin, "license_applications",
      "id, user_id, category, team_name, school_name, status, phone, created_at",
      { order: { col: "created_at", asc: false }, limit: 5 });

    const licenseWithNames = [];
    for (const app of recentLicenses) {
      let name = app.team_name || "-";
      if (app.user_id) {
        try {
          const { data: u } = await admin.from("users").select("name, email").eq("id", app.user_id).single();
          if (u) name = u.name || u.email || name;
        } catch { /* ignore */ }
      }
      licenseWithNames.push({ ...app, applicant_name: name });
    }

    // ── Board stats (safe) ──
    const totalPosts = await safeCount(admin, "posts", { parent_id: null });

    let unansweredQna = 0;
    let unansweredQnaList = [];
    try {
      const qnaPosts = await safeSelect(admin, "posts",
        "id, title, author_name, created_at",
        { eq: { type: "qna" }, is: { parent_id: null }, order: { col: "created_at", asc: false } });
      if (qnaPosts.length > 0) {
        const replies = await safeSelect(admin, "posts", "parent_id", { in: { parent_id: qnaPosts.map((p) => p.id) } });
        const repliedIds = new Set(replies.map((r) => r.parent_id));
        const unanswered = qnaPosts.filter((p) => !repliedIds.has(p.id));
        unansweredQna = unanswered.length;
        unansweredQnaList = unanswered.slice(0, 3);
      }
    } catch { /* table may not exist */ }

    // ── Student verification pending (safe) ──
    const studentVerifPending = await safeCount(admin, "student_verifications", { status: "pending" });

    // ── Chatbot stats (safe) ──
    const totalQueries = await safeCount(admin, "chatbot_logs");
    let totalTokens = 0;
    try {
      const tokenData = await safeSelect(admin, "chatbot_logs", "tokens_used");
      totalTokens = tokenData.reduce((sum, row) => sum + (row.tokens_used || 0), 0);
    } catch { /* ignore */ }

    // ── Daily submission trend (last 7 days, safe) ──
    const dailyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(todayStart.getTime() - i * 86400000);
      const dayEnd = new Date(dayStart.getTime() + 86400000);
      const dayStartUTC = new Date(dayStart.getTime() - kstOffset).toISOString();
      const dayEndUTC = new Date(dayEnd.getTime() - kstOffset).toISOString();

      let dayCount = 0;
      try {
        const { count } = await admin.from("submissions")
          .select("*", { count: "exact", head: true })
          .gte("created_at", dayStartUTC)
          .lt("created_at", dayEndUTC);
        dayCount = count || 0;
      } catch { /* ignore */ }

      const kstDay = new Date(dayStart.getTime());
      const label = `${(kstDay.getMonth() + 1).toString().padStart(2, "0")}/${kstDay.getDate().toString().padStart(2, "0")}`;
      dailyTrend.push({ date: label, count: dayCount });
    }

    return NextResponse.json({
      license: { total: licenseTotal, pending: licensePending, approved: licenseApproved, rejected: licenseRejected },
      submissions: { total: subTotal, submitted: subSubmitted, under_review: subReview, accepted: subAccepted, rejected: subRejected },
      submissions_by_category: { elementary: catElementary, secondary: catSecondary, general: catGeneral },
      submissions_today: subToday,
      submissions_this_week: subWeek,
      recent_submissions: recentSubmissions,
      recent_licenses: licenseWithNames,
      daily_trend: dailyTrend,
      board: { total_posts: totalPosts, unanswered_qna: unansweredQna, unanswered_qna_list: unansweredQnaList },
      student_verif_pending: studentVerifPending,
      chatbot: { total_queries: totalQueries, total_tokens: totalTokens },
    });
  } catch (err) {
    console.error("GET /api/admin/dashboard error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
