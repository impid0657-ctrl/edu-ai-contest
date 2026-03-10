/**
 * FAQ 시드 스크립트 — 기존 하드코딩된 25개 FAQ를 DB에 등록
 * 실행: node scripts/seed-faq.js
 */
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const FAQ_DATA = [
  // ── 카테고리 1: 참가 자격 및 요건 ──
  { category: "participation", title: "초등학생도 참가할 수 있나요?", content: "<p>네, 초등부(AI활용 소속학교 홍보영상 제작 부문)에 참가 가능합니다. 개인 또는 최대 4명까지 팀으로 참가할 수 있습니다.</p>" },
  { category: "participation", title: "중복 참가가 가능한가요?", content: "<p>불가능합니다. 모든 참가자는 1인당 1개 부문만 선택하여 참가할 수 있습니다.</p>" },
  { category: "participation", title: "팀원은 몇 명까지 구성할 수 있나요?", content: "<p>참가 부문별로 팀 구성 인원이 다릅니다.</p><ul><li>초등부: 개인 또는 팀(최대 4명)</li><li>중·고등부: 팀 필수(2~4명, 중·고 혼성 가능)</li><li>일반부: 개인 또는 팀(최대 5명)</li></ul>" },
  { category: "participation", title: "외국인도 참가할 수 있나요?", content: "<p>일반부에 한하여 참가 가능합니다. 단, 국내 거주자이거나 한국어로 기획서 등의 제출물 작성이 가능해야 합니다.</p>" },
  { category: "participation", title: "타 대회 수상작이나 기존에 만들었던 작품을 제출해도 되나요?", content: "<p>불가능합니다. 타 대회 수상작 또는 기존 발표 작품은 참가할 수 없으며, 표절 및 도용 등 AI 윤리 위반 사실이 발견될 경우 즉시 심사 대상에서 제외됩니다.</p>" },

  // ── 카테고리 2: 참가작 접수 및 서류 제출 ──
  { category: "submission", title: "비회원도 작품 접수가 가능한가요?", content: "<p>네, 가능합니다. 간편 인증을 하지 않더라도 접수 시 이메일 인증(OTP 6자리)을 거쳐 접수 비밀번호를 설정하시면 참여가 가능합니다.</p>" },
  { category: "submission", title: "접수를 완료했는데 제출 파일을 수정할 수 있나요?", content: "<p>접수 마감일(5월 31일 23:59) 전까지는 언제든 수정이 가능합니다. 회원은 마이페이지에서, 비회원은 발급받은 '접수번호와 비밀번호'를 입력해 기존 파일을 삭제하고 덮어쓰기 방식으로 재업로드하실 수 있습니다.</p>" },
  { category: "submission", title: "파일 형식과 용량에 제한이 있나요?", content: "<p>지원하는 파일 형식은 PDF, PPTX, DOCX, MP4, MOV, ZIP, CSV, Excel, Python(.py), R(.R), IPYNB 등입니다. 파일 용량은 개별 파일당 최대 100MB, 팀당 총합 500MB까지 업로드 가능합니다.</p>" },
  { category: "submission", title: "초등부 참가 시 영상 제출은 필수인가요?", content: "<p>네, 초등부는 '소속학교 홍보영상 제작' 부문이므로 MP4 또는 MOV 형식의 영상(3~5분 분량)과 사용한 AI 도구를 설명하는 1페이지 분량의 기획서(PDF) 제출이 필수입니다.</p>" },
  { category: "submission", title: "접수 완료 여부는 어떻게 확인하나요?", content: "<p>정상적으로 접수되면 접수번호(예: SUB-2026-00001)가 자동 발급되며 등록하신 이메일로 접수 확인 메일이 발송됩니다. 또한, 홈페이지의 '마이페이지 > 내 작품 관리'에서도 상태(접수 완료, 검토 중 등)를 조회할 수 있습니다.</p>" },

  // ── 카테고리 3: AI 이용권 (에듀핏) 혜택 ──
  { category: "ai_license", title: "AI 이용권은 무엇인가요?", content: "<p>에듀핏이 무상으로 제공하는 생성형 AI 서비스 이용권입니다. ChatGPT, DALL-E 등의 프리미엄 AI 도구를 대회 기간 중 횟수 제한 없이 무료로 사용할 수 있습니다.</p>" },
  { category: "ai_license", title: "AI 이용권 신청은 어떻게 하나요?", content: "<p>홈페이지 상단의 'AI이용권 신청' 메뉴에서 본인 인증 후 신청할 수 있습니다. 카카오/네이버 간편 인증, 학교 이메일 인증, 학생증 업로드 중 택 1로 인증하시면 됩니다.</p>" },
  { category: "ai_license", title: "AI 이용권 사용 기간은 어떻게 되나요?", content: "<p>이용권은 승인 즉시 활성화되며, 대회 종료일(2026년 8월 31일)까지 사용 가능합니다. 이후 자동으로 만료됩니다.</p>" },
  { category: "ai_license", title: "AI 이용권 없이도 참가 가능한가요?", content: "<p>네, AI 이용권 신청은 선택 사항입니다. 본인이 보유한 AI 도구를 활용하거나, 공개된 무료 AI 서비스를 이용해도 참가에는 제한이 없습니다.</p>" },
  { category: "ai_license", title: "AI 이용권은 팀원 전체가 사용할 수 있나요?", content: "<p>아니요, AI 이용권은 신청자 본인에게만 발급됩니다. 팀원 각각이 개별적으로 신청해야 합니다.</p>" },

  // ── 카테고리 4: 심사 기준 및 절차 ──
  { category: "judging", title: "심사는 어떤 기준으로 진행되나요?", content: "<p>심사 기준은 부문에 따라 다르지만 공통적으로 ①창의성·독창성 ②AI 활용 적절성 ③교육적 가치(공익성) ④완성도를 평가합니다. 세부 배점 비율은 '대회 안내 > 심사 기준' 페이지에서 확인하실 수 있습니다.</p>" },
  { category: "judging", title: "심사 결과는 언제 발표되나요?", content: "<p>1차 온라인 심사 결과는 6월 중순, 2차 본선(발표) 심사 결과는 7월 중에 발표 예정입니다. 정확한 일정은 공지사항을 통해 안내됩니다.</p>" },
  { category: "judging", title: "본선 발표 심사는 어떻게 진행되나요?", content: "<p>1차 심사 통과팀은 2차 본선에 진출하여 발표 및 질의응답 심사를 받습니다. 발표는 팀당 10분 이내이며, 질의응답은 5분 내외로 진행됩니다. 온라인 또는 오프라인 여부는 추후 공지됩니다.</p>" },
  { category: "judging", title: "심사위원은 누구인가요?", content: "<p>AI·교육·데이터 분야 전문가 및 교수진으로 구성됩니다. 구체적인 심사위원 명단은 심사 직전에 홈페이지를 통해 공개됩니다.</p>" },
  { category: "judging", title: "심사에 이의를 제기할 수 있나요?", content: "<p>결과 발표 후 7일 이내에 공식 이메일(contest@example.com)로 이의 신청을 할 수 있습니다. 다만, 심사위원의 정성 평가 영역에 대해서는 이의 제기가 제한될 수 있습니다.</p>" },

  // ── 카테고리 5: 시상 내역 및 시스템 이용 ──
  { category: "awards", title: "시상 내역은 어떻게 되나요?", content: "<p>대상(교육부장관상) 1팀, 최우수상 2팀, 우수상 3팀, 장려상은 부문별로 수여합니다. 총 상금 규모는 5,000만원이며, 수상자에게는 상장과 상금이 지급됩니다.</p>" },
  { category: "awards", title: "시상식은 언제, 어디서 진행되나요?", content: "<p>시상식은 2026년 8월 중 서울 코엑스에서 오프라인으로 개최될 예정입니다. 수상자에게는 개별 안내가 발송됩니다.</p>" },
  { category: "awards", title: "수상작은 공개되나요?", content: "<p>네, 수상팀의 작품은 대회 홈페이지와 교육부 공공데이터 포털을 통해 공개될 예정입니다. 참가 신청 시 이에 동의한 것으로 간주됩니다.</p>" },
  { category: "awards", title: "홈페이지 회원 가입은 어떻게 하나요?", content: "<p>카카오 또는 네이버 간편 로그인으로 가입할 수 있습니다. 별도의 회원 가입 양식은 없으며, 소셜 로그인 시 자동으로 계정이 생성됩니다.</p>" },
  { category: "awards", title: "비밀번호를 잊어버렸어요. 어떻게 하나요?", content: "<p>소셜 로그인(카카오/네이버) 사용자는 해당 소셜 플랫폼에서 비밀번호를 재설정하시면 됩니다. 비회원으로 접수한 경우, 접수번호와 이메일로 본인 확인 후 새 비밀번호를 설정할 수 있습니다.</p>" },
];

async function seed() {
  console.log(`FAQ ${FAQ_DATA.length}개 등록 시작...`);

  let success = 0;
  let fail = 0;

  for (const faq of FAQ_DATA) {
    const { error } = await sb.from("posts").insert({
      type: "faq",
      title: faq.title,
      content: faq.content,
      category: faq.category,
      author_name: "관리자",
    });

    if (error) {
      console.error(`❌ 실패: ${faq.title} — ${error.message}`);
      fail++;
    } else {
      success++;
    }
  }

  console.log(`\n완료: ${success}건 성공, ${fail}건 실패`);
}

seed();
