/**
 * Application-wide constants.
 * All hardcoded values should be defined here.
 */

// Site metadata
export const SITE_NAME = "제8회 교육 공공데이터 AI활용대회";
export const SITE_DESCRIPTION =
  "교육의 미래를 AI와 함께 열어갑니다. 교육 공공데이터를 활용한 AI 솔루션을 개발하고 공유하세요.";

// Contest info
export const CONTEST_CATEGORIES = [
  {
    id: "elementary",
    name: "초등부",
    eligibility: "전국 초등학교 4~6학년 (개인/팀)",
    theme: "교육 데이터를 활용한 창의적 영상 제작",
  },
  {
    id: "secondary",
    name: "중·고등부",
    eligibility: "전국 중·고등학교 재학생 (개인/팀)",
    theme: "AI 기술을 활용한 교육 데이터 분석 프로젝트",
  },
  {
    id: "general",
    name: "일반부",
    eligibility: "성인 누구나 (개인/팀, 나이 제한 없음)",
    theme: "교육 공공데이터 기반 AI 서비스 개발",
  },
];

export const CONTEST_DATES = {
  applicationStart: "2026-03-01",
  applicationEnd: "2026-05-31",
  reviewStart: "2026-06-01",
  reviewEnd: "2026-06-30",
  resultAnnouncement: "2026-07-15",
  ceremony: "2026-08",
};

export const PRIZE_TOTAL = "800만원";

export const AI_LICENSE_LIMIT = 500;
export const AI_LICENSE_PERIOD = "2026-04-01 ~ 2026-05-31";

// Scoring weights
export const SCORING_CRITERIA = {
  creativity: 30,
  technical: 30,
  applicability: 30,
  completeness: 10,
};

// Nav items for public site header
export const PUBLIC_NAV_ITEMS = [
  { label: "홈", path: "/" },
  { label: "공모요강", path: "/contest-info" },
  { label: "AI 이용권 신청", path: "/license-apply" },
  { label: "작품 접수", path: "/submit" },
  { label: "게시판", path: "/board" },
];
