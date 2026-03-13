import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/license/csv
 * Export license applications as CSV.
 * Query params:
 *   ids — comma-separated list of IDs (optional, exports selected)
 *   status — filter by status (optional, default: all)
 */
export async function GET(request) {
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
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids");
    const status = searchParams.get("status");

    // Build query — select * (no JOIN to avoid errors with null user_id)
    let query = ac
      .from("license_applications")
      .select("*")
      .is("deleted_at", null);

    // Filter by IDs if provided
    if (ids) {
      const idList = ids.split(",").filter(Boolean);
      if (idList.length > 0) {
        query = query.in("id", idList);
      }
    }

    // Filter by status if provided
    if (status) {
      query = query.eq("status", status);
    }

    query = query.order("created_at", { ascending: false });

    const { data: applications, error: queryError } = await query;

    if (queryError) {
      console.error("CSV export query error:", queryError.message);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    // OAuth 사용자의 이름/이메일 보충 (users 테이블에서 별도 조회)
    if (applications && applications.length > 0) {
      const userIds = applications.filter(a => a.user_id).map(a => a.user_id);
      if (userIds.length > 0) {
        const { data: userProfiles } = await ac
          .from("users")
          .select("id, name, email")
          .in("id", userIds);

        const profileMap = {};
        if (userProfiles) {
          for (const p of userProfiles) profileMap[p.id] = p;
        }

        for (const app of applications) {
          if (app.user_id && profileMap[app.user_id]) {
            const u = profileMap[app.user_id];
            if (!app.applicant_name) app.applicant_name = u.name || "";
            if (!app.applicant_email) app.applicant_email = u.email || "";
          }
        }
      }
    }

    // Build CSV with all fields
    const BOM = "\uFEFF"; // UTF-8 BOM for Korean Excel compatibility
    const headers = [
      "이름", "이메일", "인증방법", "부문", "출생연도", "대표자명",
      "팀명", "팀원수", "팀원1", "팀원2",
      "학교명", "학년", "연락처",
      "지도교사", "지도교사이메일", "지도교사연락처",
      "작품명", "지역", "작품요약",
      "개인정보동의", "제3자동의",
      "상태", "신청일", "승인일", "발급일"
    ];
    const headerRow = headers.join(",");

    const CATEGORY_LABELS = {
      elementary: "초등(홍보영상)",
      secondary: "중고등(기획)",
      general: "일반(기획)",
    };
    const STATUS_LABELS = {
      pending: "대기",
      approved: "승인",
      rejected: "반려",
    };
    const AUTH_LABELS = {
      kakao: "카카오",
      naver: "네이버",
      school_email: "학교이메일",
      student_direct: "학생증",
    };

    const rows = (applications || []).map((app) => {
      const values = [
        escapeCsvValue(app.applicant_name || ""),
        escapeCsvValue(app.applicant_email || ""),
        escapeCsvValue(AUTH_LABELS[app.auth_method] || app.auth_method || ""),
        escapeCsvValue(CATEGORY_LABELS[app.category] || app.category || ""),
        escapeCsvValue(app.birth_year || ""),
        escapeCsvValue(app.representative_name || ""),
        escapeCsvValue(app.team_name || ""),
        escapeCsvValue(app.member_count || ""),
        escapeCsvValue(app.member1_name || ""),
        escapeCsvValue(app.member2_name || ""),
        escapeCsvValue(app.school_name || ""),
        escapeCsvValue(app.grade || ""),
        escapeCsvValue(app.phone || ""),
        escapeCsvValue(app.teacher_name || ""),
        escapeCsvValue(app.teacher_email || ""),
        escapeCsvValue(app.teacher_phone || ""),
        escapeCsvValue(app.topic || ""),
        escapeCsvValue(app.region || ""),
        escapeCsvValue(app.motivation || ""),
        escapeCsvValue(app.privacy_agreed_at ? "동의" : ""),
        escapeCsvValue(app.third_party_agreed_at ? "동의" : ""),
        escapeCsvValue(STATUS_LABELS[app.status] || app.status || ""),
        escapeCsvValue(app.created_at ? formatDate(app.created_at) : ""),
        escapeCsvValue(app.reviewed_at ? formatDate(app.reviewed_at) : ""),
        escapeCsvValue(app.license_issued_at ? formatDate(app.license_issued_at) : ""),
      ];
      return values.join(",");
    });

    const csvContent = BOM + [headerRow, ...rows].join("\n");
    const filename = `license_applications_${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=${filename}`,
      },
    });
  } catch (err) {
    console.error("GET /api/admin/license/csv error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function escapeCsvValue(value) {
  const str = String(value);
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatDate(isoStr) {
  try {
    const d = new Date(isoStr);
    const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    return kst.toISOString().replace("T", " ").slice(0, 19);
  } catch {
    return isoStr;
  }
}
