import Link from "next/link";
import {
  SITE_NAME,
  CONTEST_CATEGORIES,
  CONTEST_DATES,
  PRIZE_TOTAL,
  SCORING_CRITERIA,
} from "@/lib/constants";

/**
 * Main Homepage — Hero Section + Contest Info + Key Dates + Categories
 * Copy from doc 11 (project-bible Section 11).
 */
export const metadata = {
  title: `${SITE_NAME} | 홈`,
  description:
    "교육의 미래를 AI와 함께 열어갑니다. 교육 공공데이터를 활용한 AI 솔루션을 개발하고 공유하세요.",
};

export default function HomePage() {
  return (
    <>
      {/* ===== Hero Section ===== */}
      <section
        className="public-hero position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "600px",
        }}
      >
        {/* Decorative shapes */}
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
          <div
            className="position-absolute rounded-circle bg-white"
            style={{ width: "300px", height: "300px", top: "-50px", right: "-50px" }}
          ></div>
          <div
            className="position-absolute rounded-circle bg-white"
            style={{ width: "200px", height: "200px", bottom: "50px", left: "-30px" }}
          ></div>
        </div>

        <div className="container position-relative" style={{ zIndex: 2, paddingTop: "100px", paddingBottom: "80px" }}>
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center text-white">
              <h1 className="display-3 fw-bold mb-4" style={{ letterSpacing: "-0.02em" }}>
                제8회 교육 공공데이터 AI활용대회
              </h1>
              <p className="lead fs-4 mb-5 opacity-90">
                교육의 미래를 AI와 함께 열어갑니다
              </p>

              {/* CTA Buttons */}
              <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
                <Link
                  href="/license-apply"
                  className="btn btn-light btn-lg px-5 py-3 fw-bold rounded-pill shadow"
                  id="hero-cta-license"
                >
                  AI 이용권 신청하기
                </Link>
                <Link
                  href="/submit"
                  className="btn btn-outline-light btn-lg px-5 py-3 fw-bold rounded-pill"
                  id="hero-cta-submit"
                >
                  작품 접수하기
                </Link>
              </div>

              {/* Info Bar */}
              <div
                className="d-inline-block bg-white bg-opacity-25 rounded-pill px-4 py-2"
                style={{ backdropFilter: "blur(10px)" }}
              >
                <span className="text-white fw-semibold">
                  📅 접수 기간: 2026년 3월 1일 ~ 5월 31일까지 | 🎯 총상금: {PRIZE_TOTAL}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Contest Info Section ===== */}
      <section className="public-contest-info py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3">
              대회 안내
            </span>
            <h2 className="fw-bold">대회 개요</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
              교육 공공데이터를 활용하여 AI 기반의 창의적인 솔루션을 개발하는 전국 규모 대회입니다.
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 text-center p-4">
                <div className="card-body">
                  <div className="display-4 mb-3">🏆</div>
                  <h5 className="fw-bold">총상금</h5>
                  <p className="text-primary fw-bold fs-3">{PRIZE_TOTAL}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 text-center p-4">
                <div className="card-body">
                  <div className="display-4 mb-3">🤖</div>
                  <h5 className="fw-bold">AI 이용권</h5>
                  <p className="text-muted">
                    선착순 500명 에듀핏(EduFit) 플랫폼 무료 이용권 제공
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 text-center p-4">
                <div className="card-body">
                  <div className="display-4 mb-3">👥</div>
                  <h5 className="fw-bold">참가 방식</h5>
                  <p className="text-muted">
                    개인 또는 팀(최대 4명) 참가 가능
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Key Dates Section ===== */}
      <section className="public-key-dates py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3">
              주요 일정
            </span>
            <h2 className="fw-bold">대회 일정</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { icon: "📝", label: "접수 기간", date: "2026.03.01 ~ 05.31" },
              { icon: "🔍", label: "심사 기간", date: "2026.06.01 ~ 06.30" },
              { icon: "📢", label: "결과 발표", date: "2026.07.15" },
              { icon: "🎉", label: "시상식", date: "2026년 8월 (서울)" },
            ].map((item, index) => (
              <div className="col-md-3 col-6" key={index}>
                <div className="card border-0 shadow-sm text-center p-4 h-100">
                  <div className="card-body">
                    <div className="display-5 mb-3">{item.icon}</div>
                    <h6 className="fw-bold text-muted mb-2">{item.label}</h6>
                    <p className="fw-semibold mb-0">{item.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Categories Section ===== */}
      <section className="public-categories py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3">
              참가 부문
            </span>
            <h2 className="fw-bold">부문별 안내</h2>
          </div>
          <div className="row g-4">
            {CONTEST_CATEGORIES.map((cat) => (
              <div className="col-md-4" key={cat.id}>
                <div className="card border-0 shadow-sm h-100">
                  <div
                    className="card-header border-0 text-white text-center py-4"
                    style={{
                      background:
                        cat.id === "elementary"
                          ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                          : cat.id === "secondary"
                          ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    <h4 className="fw-bold mb-1">{cat.name}</h4>
                    <small className="opacity-90">{cat.eligibility}</small>
                  </div>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-2">주제</h6>
                    <p className="text-muted">{cat.theme}</p>
                    <h6 className="fw-bold mb-2">심사 기준</h6>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-1">
                        <span className="text-muted">창의성</span>
                        <span className="float-end fw-semibold">{SCORING_CRITERIA.creativity}%</span>
                      </li>
                      <li className="mb-1">
                        <span className="text-muted">기술성</span>
                        <span className="float-end fw-semibold">{SCORING_CRITERIA.technical}%</span>
                      </li>
                      <li className="mb-1">
                        <span className="text-muted">활용성</span>
                        <span className="float-end fw-semibold">{SCORING_CRITERIA.applicability}%</span>
                      </li>
                      <li>
                        <span className="text-muted">완성도</span>
                        <span className="float-end fw-semibold">{SCORING_CRITERIA.completeness}%</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
