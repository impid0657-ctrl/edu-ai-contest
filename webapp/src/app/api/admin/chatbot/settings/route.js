import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { invalidateSettingsCache } from "@/lib/chatbot";
import fs from "fs";
import path from "path";

/**
 * GET /api/admin/chatbot/settings — get current chatbot settings
 * PATCH /api/admin/chatbot/settings — update chatbot settings
 * 
 * 저장 우선순위:
 * 1. chatbot_settings 테이블 (있으면)
 * 2. 로컬 JSON 파일 (테이블 없으면 fallback)
 */

const DEFAULTS = {
  provider: "google",
  model_name: "gemini-2.5-flash-lite",
  system_prompt: "당신은 제8회 교육 공공데이터 AI활용대회의 안내 도우미입니다. 대회 요강 범위 내에서만 답변하세요.",
  max_tokens: 1000,
  temperature: 0.7,
  allowed_topics: ["대회 일정", "신청 방법", "참가 자격", "제출 양식", "시상 내역", "AI 이용권", "심사 기준"],
  blocked_topics: ["정치", "성인 콘텐츠", "개인정보", "욕설"],
  is_active: true,
  daily_limit: 1000,
  auto_fallback: true,
  fallback_provider: "openrouter",
  fallback_model: "anthropic/claude-3.5-haiku",
  example_questions: [
    "참가 자격은 어떻게 되나요?",
    "AI 이용권은 어떻게 받나요?",
    "작품 접수 마감일은 언제인가요?",
    "팀으로 참가할 수 있나요?",
  ],
};

// 로컬 JSON 파일 경로
const CONFIG_DIR = path.join(process.cwd(), "data");
const CONFIG_FILE = path.join(CONFIG_DIR, "chatbot-settings.json");

function readLocalSettings() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, "utf8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to read local settings:", e.message);
  }
  return null;
}

function writeLocalSettings(data) {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("Failed to write local settings:", e.message);
    return false;
  }
}

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const ac = createAdminClient();
  const { data: userData } = await ac.from("users").select("role").eq("id", user.id).single();
  if (!userData || userData.role !== "admin") return null;
  return user;
}

async function loadSettings() {
  const adminClient = createAdminClient();

  let dbData = null;
  let localData = null;

  // 1차: DB chatbot_settings 테이블
  try {
    const { data, error } = await adminClient.from("chatbot_settings").select("*").limit(1).maybeSingle();
    if (!error && data) dbData = data;
  } catch { }

  // 2차: 로컬 JSON 파일
  localData = readLocalSettings();

  // 병합: DEFAULTS < 로컬 < DB (null 제외)
  const merged = { ...DEFAULTS };
  if (localData) {
    for (const [key, val] of Object.entries(localData)) {
      if (val != null) merged[key] = val;
    }
  }
  if (dbData) {
    for (const [key, val] of Object.entries(dbData)) {
      if (val != null) merged[key] = val;
    }
  }
  return merged;
}

export async function GET() {
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const settings = await loadSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    console.error("GET /api/admin/chatbot/settings error:", err);
    return NextResponse.json({ settings: DEFAULTS });
  }
}

export async function PATCH(request) {
  try {
    const user = await checkAdmin();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await request.json();
    const allowedFields = [
      "provider", "model_name", "system_prompt", "max_tokens",
      "temperature", "allowed_topics", "blocked_topics", "is_active", "daily_limit",
      "example_questions", "auto_fallback", "fallback_provider", "fallback_model",
    ];

    // 현재 설정 로드
    const current = await loadSettings();

    // 허용 필드만 병합
    const merged = {};
    for (const field of allowedFields) {
      merged[field] = body[field] !== undefined ? body[field] : current[field] || DEFAULTS[field];
    }

    // 1차 시도: DB chatbot_settings 테이블에 저장
    let savedToDB = false;
    try {
      const adminClient = createAdminClient();
      const { data: existing } = await adminClient.from("chatbot_settings").select("id").limit(1).maybeSingle();
      if (existing) {
        const { error } = await adminClient
          .from("chatbot_settings")
          .update({ ...merged, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
        if (!error) {
          savedToDB = true;
        } else {
          console.error("DB update error:", error.message, "- falling back to local file");
        }
      }
    } catch (dbErr) {
      console.error("DB save exception:", dbErr.message);
    }

    // 2차: 로컬 JSON 파일에 저장 (DB 실패 시)
    if (!savedToDB) {
      const ok = writeLocalSettings(merged);
      if (!ok) {
        return NextResponse.json({ error: "설정 저장에 실패했습니다." }, { status: 500 });
      }
    }

    // 캐시 무효화
    invalidateSettingsCache();

    return NextResponse.json({ settings: merged });
  } catch (err) {
    console.error("PATCH /api/admin/chatbot/settings error:", err);
    return NextResponse.json({ error: "Internal server error: " + err.message }, { status: 500 });
  }
}
