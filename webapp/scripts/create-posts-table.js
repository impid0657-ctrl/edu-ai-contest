/**
 * Supabase Management API를 통해 posts 테이블 생성 + FAQ 시드
 * node scripts/create-posts-table.js
 */
require("dotenv").config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "");

const CREATE_SQL = `
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  author_id UUID,
  author_name TEXT DEFAULT '익명',
  parent_id UUID,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_secret BOOLEAN DEFAULT FALSE,
  password_hash TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
`;

const RLS_SQL = `
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='posts' AND policyname='service_role_all') THEN
    EXECUTE 'CREATE POLICY service_role_all ON posts FOR ALL TO service_role USING (true) WITH CHECK (true)';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='posts' AND policyname='anon_read') THEN
    EXECUTE 'CREATE POLICY anon_read ON posts FOR SELECT TO anon USING (true)';
  END IF;
END $$;
`;

const INDEX_SQL = `
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_type_category ON posts(type, category);
CREATE INDEX IF NOT EXISTS idx_posts_parent_id ON posts(parent_id);
`;

async function runSQL(sql, label) {
  console.log(`[${label}] 실행 중...`);
  
  // Try Supabase Management API
  const mgmtRes = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  if (mgmtRes.ok) {
    const data = await mgmtRes.json();
    console.log(`  ✅ 성공`);
    return true;
  }

  // Try alternative: direct pg endpoint
  const pgRes = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });

  if (pgRes.ok) {
    console.log(`  ✅ 성공 (pg endpoint)`);
    return true;
  }

  const errText = await mgmtRes.text();
  console.log(`  ❌ 실패: ${errText.substring(0, 200)}`);
  return false;
}

async function main() {
  console.log("Project:", PROJECT_REF);
  console.log("=".repeat(50));

  // Step 1: Create table
  const created = await runSQL(CREATE_SQL, "테이블 생성");
  if (!created) {
    console.log("\n⚠️  자동 SQL 실행이 불가합니다.");
    console.log("Supabase Dashboard SQL Editor에서 아래 SQL을 직접 실행해주세요:\n");
    console.log(CREATE_SQL);
    console.log(RLS_SQL);
    console.log(INDEX_SQL);
    process.exit(1);
  }

  // Step 2: RLS & Indexes
  await runSQL(RLS_SQL, "RLS 정책");
  await runSQL(INDEX_SQL, "인덱스 생성");

  // Step 3: Seed FAQ
  console.log("\n[FAQ 시드] 25개 등록 중...");
  const { createClient } = require("@supabase/supabase-js");
  const sb = createClient(SUPABASE_URL, SERVICE_KEY);

  const FAQ = [
    { category: "participation", title: "초등학생도 참가할 수 있나요?", content: "<p>네, 초등부(AI활용 소속학교 홍보영상 제작 부문)에 참가 가능합니다. 개인 또는 최대 4명까지 팀으로 참가할 수 있습니다.</p>" },
    { category: "participation", title: "중복 참가가 가능한가요?", content: "<p>불가능합니다. 모든 참가자는 1인당 1개 부문만 선택하여 참가할 수 있습니다.</p>" },
    { category: "participation", title: "팀원은 몇 명까지 구성할 수 있나요?", content: "<p>참가 부문별로 팀 구성 인원이 다릅니다.</p><ul><li>초등부: 개인 또는 팀(최대 4명)</li><li>중·고등부: 팀 필수(2~4명)</li><li>일반부: 개인 또는 팀(최대 5명)</li></ul>" },
    { category: "participation", title: "외국인도 참가할 수 있나요?", content: "<p>일반부에 한하여 참가 가능합니다. 단, 국내 거주자이거나 한국어로 기획서 등의 제출물 작성이 가능해야 합니다.</p>" },
    { category: "participation", title: "타 대회 수상작이나 기존에 만들었던 작품을 제출해도 되나요?", content: "<p>불가능합니다. 타 대회 수상작 또는 기존 발표 작품은 참가할 수 없습니다.</p>" },
    { category: "submission", title: "비회원도 작품 접수가 가능한가요?", content: "<p>네, 이메일 인증(OTP 6자리)을 거쳐 접수 비밀번호를 설정하시면 참여가 가능합니다.</p>" },
    { category: "submission", title: "접수를 완료했는데 제출 파일을 수정할 수 있나요?", content: "<p>접수 마감일(5월 31일 23:59) 전까지는 언제든 수정이 가능합니다.</p>" },
    { category: "submission", title: "파일 형식과 용량에 제한이 있나요?", content: "<p>PDF, PPTX, DOCX, MP4, MOV, ZIP, CSV, Excel 등. 파일당 최대 100MB, 팀당 총합 500MB까지.</p>" },
    { category: "submission", title: "초등부 참가 시 영상 제출은 필수인가요?", content: "<p>네, MP4/MOV 형식의 영상(3~5분)과 기획서(PDF) 제출이 필수입니다.</p>" },
    { category: "submission", title: "접수 완료 여부는 어떻게 확인하나요?", content: "<p>접수번호(예: SUB-2026-00001)가 발급되며 이메일로 접수 확인 메일이 발송됩니다.</p>" },
    { category: "ai_license", title: "AI 이용권은 무엇인가요?", content: "<p>에듀핏이 무상 제공하는 생성형 AI 서비스 이용권입니다. ChatGPT, DALL-E 등 무료 사용 가능.</p>" },
    { category: "ai_license", title: "AI 이용권 신청은 어떻게 하나요?", content: "<p>'AI이용권 신청' 메뉴에서 본인 인증 후 신청 가능합니다.</p>" },
    { category: "ai_license", title: "AI 이용권 사용 기간은 어떻게 되나요?", content: "<p>승인 즉시 활성화, 대회 종료일(2026년 8월 31일)까지 사용 가능.</p>" },
    { category: "ai_license", title: "AI 이용권 없이도 참가 가능한가요?", content: "<p>네, 선택 사항입니다. 본인 보유 AI 도구 활용 가능.</p>" },
    { category: "ai_license", title: "AI 이용권은 팀원 전체가 사용할 수 있나요?", content: "<p>아니요, 신청자 본인에게만 발급, 팀원 각각 개별 신청 필요.</p>" },
    { category: "judging", title: "심사는 어떤 기준으로 진행되나요?", content: "<p>①창의성·독창성 ②AI 활용 적절성 ③교육적 가치(공익성) ④완성도를 평가합니다.</p>" },
    { category: "judging", title: "심사 결과는 언제 발표되나요?", content: "<p>1차 6월 중순, 2차 본선 7월 중 발표 예정.</p>" },
    { category: "judging", title: "본선 발표 심사는 어떻게 진행되나요?", content: "<p>발표 10분 이내, 질의응답 5분 내외.</p>" },
    { category: "judging", title: "심사위원은 누구인가요?", content: "<p>AI·교육·데이터 분야 전문가 및 교수진으로 구성.</p>" },
    { category: "judging", title: "심사에 이의를 제기할 수 있나요?", content: "<p>결과 발표 후 7일 이내 공식 이메일로 이의 신청 가능.</p>" },
    { category: "awards", title: "시상 내역은 어떻게 되나요?", content: "<p>대상(교육부장관상) 1팀, 최우수상 2팀, 우수상 3팀, 장려상 부문별. 총 상금 5,000만원.</p>" },
    { category: "awards", title: "시상식은 언제, 어디서 진행되나요?", content: "<p>2026년 8월 중 서울 코엑스에서 오프라인 개최 예정.</p>" },
    { category: "awards", title: "수상작은 공개되나요?", content: "<p>네, 대회 홈페이지와 교육부 공공데이터 포털에 공개.</p>" },
    { category: "awards", title: "홈페이지 회원 가입은 어떻게 하나요?", content: "<p>카카오/네이버 간편 로그인으로 자동 가입.</p>" },
    { category: "awards", title: "비밀번호를 잊어버렸어요. 어떻게 하나요?", content: "<p>카카오/네이버에서 비밀번호 재설정하시면 됩니다.</p>" },
  ];

  const rows = FAQ.map(f => ({ type: "faq", title: f.title, content: f.content, category: f.category, author_name: "관리자" }));
  const { data, error } = await sb.from("posts").insert(rows).select("id");
  
  if (error) {
    console.log("  ❌ FAQ 시드 실패:", error.message);
  } else {
    console.log(`  ✅ FAQ ${data.length}개 등록 완료!`);
  }
}

main().catch(console.error);
