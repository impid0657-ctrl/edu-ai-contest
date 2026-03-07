import Link from "next/link";
import { PUBLIC_NAV_ITEMS, SITE_NAME } from "@/lib/constants";

/**
 * Public site layout — header + footer wrapper
 * Adapted from site template (Evalo) design patterns with Bootstrap 5.
 */
export const metadata = {
  title: "제8회 교육 공공데이터 AI활용대회",
  description:
    "교육의 미래를 AI와 함께 열어갑니다. 교육 공공데이터를 활용한 AI 솔루션을 개발하고 공유하세요.",
};

export default function PublicLayout({ children }) {
  return (
    <>
      {/* Header */}
      <header className="public-header">
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
          <div className="container">
            <Link href="/" className="navbar-brand fw-bold text-primary">
              {SITE_NAME}
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#publicNavbar"
              aria-controls="publicNavbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="publicNavbar">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                {PUBLIC_NAV_ITEMS.map((item) => (
                  <li className="nav-item" key={item.path}>
                    <Link href={item.path} className="nav-link fw-semibold">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="nav-item">
                  <Link href="/login" className="nav-link fw-semibold">
                    로그인
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Main content — offset for fixed header */}
      <main className="public-main" style={{ paddingTop: "80px" }}>
        {children}
      </main>

      {/* Footer */}
      <footer className="public-footer bg-dark text-white py-5 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4 mb-lg-0">
              <h5 className="fw-bold mb-3">{SITE_NAME}</h5>
              <p className="text-white-50 mb-0">
                교육의 미래를 AI와 함께 열어갑니다.
              </p>
            </div>
            <div className="col-lg-4 mb-4 mb-lg-0">
              <h6 className="fw-bold mb-3">바로가기</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link href="/contest-info" className="text-white-50 text-decoration-none">
                    공모요강
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/license-apply" className="text-white-50 text-decoration-none">
                    AI 이용권 신청
                  </Link>
                </li>
                <li className="mb-2">
                  <Link href="/submit" className="text-white-50 text-decoration-none">
                    작품 접수
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-4">
              <h6 className="fw-bold mb-3">문의</h6>
              <p className="text-white-50 mb-1">이메일: support@edu-ai-contest.kr</p>
              <p className="text-white-50 mb-0">
                © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
