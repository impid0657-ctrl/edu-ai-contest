import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import fs from "fs";
import path from "path";

/**
 * GET /api/settings/chatbot-questions — 공개 API
 * 챗봇 자주 묻는 질문 목록 반환 (인증 불필요)
 * 우선순위: DB chatbot_settings.example_questions > 로컬 JSON > 기본값
 */

const DEFAULT_QUESTIONS = [
  "참가 자격은 어떻게 되나요?",
  "AI 이용권은 어떻게 받나요?",
  "작품 접수 마감일은 언제인가요?",
  "팀으로 참가할 수 있나요?",
];

const CONFIG_FILE = path.join(process.cwd(), "data", "chatbot-settings.json");

export async function GET() {
  try {
    // 1차: DB
    try {
      const adminClient = createAdminClient();
      const { data } = await adminClient
        .from("chatbot_settings")
        .select("example_questions")
        .limit(1)
        .single();

      const questions = data?.example_questions;
      if (Array.isArray(questions) && questions.length > 0) {
        return NextResponse.json({ questions });
      }
    } catch {}

    // 2차: 로컬 JSON 파일
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const raw = fs.readFileSync(CONFIG_FILE, "utf8");
        const local = JSON.parse(raw);
        if (Array.isArray(local.example_questions) && local.example_questions.length > 0) {
          return NextResponse.json({ questions: local.example_questions });
        }
      }
    } catch {}

    // 3차: 기본값
    return NextResponse.json({ questions: DEFAULT_QUESTIONS });
  } catch (err) {
    console.error("GET /api/settings/chatbot-questions error:", err);
    return NextResponse.json({ questions: DEFAULT_QUESTIONS });
  }
}
