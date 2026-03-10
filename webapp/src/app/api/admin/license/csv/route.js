import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/license/csv
 * Export approved license applications as CSV.
 * Filter: status = 'approved' ONLY.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Auth + admin check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: profile } = await createAdminClient()
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ac = createAdminClient();
    // Fetch approved applications with user info
    const { data: applications, error: queryError } = await ac
      .from("license_applications")
      .select("*, users(name, email)")
      .eq("status", "approved")
      .order("reviewed_at", { ascending: false });

    if (queryError) {
      console.error("CSV export query error:", queryError.message);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    // Build CSV
    const BOM = "\uFEFF"; // UTF-8 BOM for Korean Excel compatibility
    const headers = ["name", "email", "school_name", "category", "team_name", "phone", "approved_at"];
    const headerRow = headers.join(",");

    const rows = (applications || []).map((app) => {
      const values = [
        escapeCsvValue(app.users?.name || ""),
        escapeCsvValue(app.users?.email || ""),
        escapeCsvValue(app.school_name || ""),
        escapeCsvValue(app.category || ""),
        escapeCsvValue(app.team_name || ""),
        escapeCsvValue(app.phone || ""),
        escapeCsvValue(app.reviewed_at || ""),
      ];
      return values.join(",");
    });

    const csvContent = BOM + [headerRow, ...rows].join("\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=approved_applications.csv",
      },
    });
  } catch (err) {
    console.error("GET /api/admin/license/csv error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Escape a value for CSV — wraps in quotes if it contains comma, newline, or quote.
 */
function escapeCsvValue(value) {
  const str = String(value);
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
