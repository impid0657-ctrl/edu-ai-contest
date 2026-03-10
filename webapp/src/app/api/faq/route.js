import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/faq
 * 공개 FAQ API — type="faq" 게시글을 category별로 그룹핑하여 반환
 */

const CATEGORY_ORDER = [
  { key: "participation", label: "참가 자격 및 요건" },
  { key: "submission", label: "참가작 접수 및 서류 제출" },
  { key: "ai_license", label: "AI 이용권 (에듀핏) 혜택" },
  { key: "judging", label: "심사 기준 및 절차" },
  { key: "awards", label: "시상 내역 및 시스템 이용" },
];

export async function GET() {
  try {
    const adminClient = createAdminClient();

    const { data: posts, error } = await adminClient
      .from("posts")
      .select("id, title, content, category, created_at")
      .eq("type", "faq")
      .is("parent_id", null)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[FAQ API] Query error:", error.code, error.message);
      return NextResponse.json({ categories: [] });
    }

    return NextResponse.json({ categories: groupByCategory(posts || []) });
  } catch (err) {
    console.error("[FAQ API] Unexpected error:", err?.message || err);
    return NextResponse.json({ categories: [] });
  }
}

function groupByCategory(posts) {
  const grouped = {};
  posts.forEach((post) => {
    const cat = post.category || "etc";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({
      id: post.id,
      question: post.title,
      answer: post.content,
    });
  });

  const categories = CATEGORY_ORDER.map((cat) => ({
    key: cat.key,
    label: cat.label,
    items: grouped[cat.key] || [],
  })).filter((cat) => cat.items.length > 0);

  const definedKeys = CATEGORY_ORDER.map((c) => c.key);
  const etcItems = Object.entries(grouped)
    .filter(([key]) => !definedKeys.includes(key))
    .flatMap(([, items]) => items);
  if (etcItems.length > 0) {
    categories.push({ key: "etc", label: "기타", items: etcItems });
  }

  return categories;
}
