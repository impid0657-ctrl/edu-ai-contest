import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/chatbot/logs
 * ?page=1&limit=50&blocked=false — paginated logs
 * ?stats=true — token cost aggregation (daily totals for last 30 days)
 */

async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const ac = createAdminClient();
  const { data } = await ac.from("users").select("id, role").eq("id", user.id).single();
  if (!data || data.role !== "admin") return null;
  return data;
}

export async function GET(request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const wantStats = searchParams.get("stats") === "true";
    const adminClient = createAdminClient();

    // Stats mode: daily token aggregation
    if (wantStats) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: logs, error } = await adminClient
        .from("chatbot_logs")
        .select("tokens_used, created_at")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      if (error) {
        console.warn("Token stats error (table may not exist):", error.message);
        return NextResponse.json({ daily: [], total_tokens: 0, total_queries: 0, estimated_cost_usd: 0 });
      }

      // Aggregate by date (KST)
      const dailyMap = {};
      let totalTokens = 0;
      let totalQueries = 0;

      (logs || []).forEach((log) => {
        const kstDate = new Date(new Date(log.created_at).getTime() + 9 * 60 * 60 * 1000);
        const dateKey = kstDate.toISOString().split("T")[0];
        if (!dailyMap[dateKey]) dailyMap[dateKey] = { tokens: 0, queries: 0 };
        dailyMap[dateKey].tokens += log.tokens_used || 0;
        dailyMap[dateKey].queries += 1;
        totalTokens += log.tokens_used || 0;
        totalQueries += 1;
      });

      const dailyStats = Object.entries(dailyMap).map(([date, v]) => ({
        date, tokens: v.tokens, queries: v.queries,
      }));

      // Rough cost estimate ($0.15 per 1M input tokens for gpt-4o-mini, very approximate)
      const estimatedCostUSD = (totalTokens / 1000000) * 0.15;

      return NextResponse.json({
        daily: dailyStats,
        total_tokens: totalTokens,
        total_queries: totalQueries,
        estimated_cost_usd: Math.round(estimatedCostUSD * 100) / 100,
      });
    }

    // Normal paginated logs mode
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const blockedOnly = searchParams.get("blocked") === "true";
    const offset = (page - 1) * limit;

    let query = adminClient
      .from("chatbot_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (blockedOnly) query = query.eq("is_blocked", true);

    const { data: logs, count, error } = await query;

    if (error) {
      console.warn("Chatbot logs error (table may not exist):", error.message);
      return NextResponse.json({ logs: [], total: 0 });
    }

    return NextResponse.json({ logs: logs || [], total: count || 0 });
  } catch (err) {
    console.warn("GET /api/admin/chatbot/logs error:", err.message);
    return NextResponse.json({ logs: [], total: 0 });
  }
}
