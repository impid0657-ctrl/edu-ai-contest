import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/chatbot/fallback-logs
 * Returns recent fallback events (max 50, newest first).
 */

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const ac = createAdminClient();
  const { data: userData } = await ac.from("users").select("role").eq("id", user.id).single();
  if (!userData || userData.role !== "admin") return null;
  return user;
}

export async function GET() {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("chatbot_fallback_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.warn("Fallback logs error:", error.message);
      return NextResponse.json({ logs: [] });
    }

    return NextResponse.json({ logs: data || [] });
  } catch (err) {
    console.error("GET fallback-logs error:", err);
    return NextResponse.json({ logs: [] });
  }
}
