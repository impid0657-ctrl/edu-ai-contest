"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChatbotWidget from "@/components/ChatbotWidget";
import "@/app/evalo-full.css";

/**
 * Public site layout — Evalo design system
 * Phase 2: Full Evalo redesign (header + footer)
 * Sticky header with scroll detection, mobile hamburger menu.
 */

const NAV_ITEMS = [
  { label: "홈", path: "/" },
  { label: "공모요강", path: "/contest-info" },
  { label: "AI 이용권 신청", path: "/license-apply" },
  { label: "작품 접수", path: "/submit" },
  { label: "게시판", path: "/board" },
];

const FOOTER_LINKS = [
  { label: "공모요강", path: "/contest-info" },
  { label: "AI 이용권 신청", path: "/license-apply" },
  { label: "작품 접수", path: "/submit" },
  { label: "접수 내역 조회", path: "/submit/lookup" },
];

const FOOTER_SUPPORT = [
  { label: "게시판", path: "/board" },
  { label: "문의 작성", path: "/board/write" },
  { label: "FAQ", path: "/board?type=faq" },
];

export default function PublicLayoutClient({ children }) {
  const pathname = usePathname();
  const [sticky, setSticky] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* ===== HEADER (원본 index.html 구조 1:1) ===== */}
      <header className="evalo-home">
        <div id="header-sticky" className={`transparent-header header-area ${sticky ? "sticky-menu" : ""}`}>
          <div className="header">
            <div className="container">
              <div className="row align-items-center justify-content-between position-relative">
                <div className="col-xl-2 col-lg-2 col-md-3 col-sm-5 col-6">
                  <div className="logo">
                    <Link href="/" className="d-block"><img src="/evalo-images/logo/logo.png" alt="교육 AI 대회" /></Link>
                  </div>
                </div>{/* /col */}
                <div className="col-xl-7 col-lg-7 col-md-1 col-sm-1 col-1 d-none d-lg-flex justify-content-end position-static">
                  <div className="main-menu">
                    <nav>
                      <ul className="d-block">
                        {NAV_ITEMS.map((item) => (
                          <li key={item.path}>
                            <Link href={item.path} className={isActive(item.path) ? "active" : ""}>
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>{/* /main-menu */}
                </div>{/* /col */}
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-4 pl-lg-0 pl-xl-3">
                  <div className="header-right d-flex align-items-center justify-content-lg-between justify-content-end">
                    <ul className="header-login d-none d-lg-block">
                      <li>
                        <Link className="black-color f-700" href="/submit/lookup">접수 조회</Link>
                      </li>
                    </ul>
                    <div className="my-btn ml-20 d-none d-sm-block">
                      <Link href="/submit" className="btn theme-bg text-capitalize">작품 접수</Link>
                    </div>
                    <div className="d-block d-lg-none pl-20">
                      <a className="mobile-menubar theme-color" href="#" onClick={(e) => { e.preventDefault(); setMobileOpen(!mobileOpen); }}>
                        <i className={mobileOpen ? "fa fa-times" : "far fa-bars"}></i>
                      </a>
                    </div>
                  </div>{/* /header-right */}
                </div>{/* /col */}
              </div>{/* /row */}
            </div>{/* /container */}
          </div>
        </div>{/* /header-bottom */}
      </header>

      {/* 모바일 사이드 메뉴 */}
      {mobileOpen && (
        <div className="evalo-home">
          <div className="side-mobile-menu white-bg pt-10 pb-30 pl-35 pr-30" style={{ position: "fixed", top: 0, right: 0, width: "300px", height: "100vh", zIndex: 1000, overflowY: "auto", boxShadow: "-5px 0 20px rgba(0,0,0,0.1)" }}>
            <div className="d-flex justify-content-end w-100">
              <div className="close-icon mt-15 mb-10">
                <a href="#" onClick={(e) => { e.preventDefault(); setMobileOpen(false); }}>
                  <span className="icon-clear theme-color"><i className="fa fa-times"></i></span>
                </a>
              </div>
            </div>
            <div className="mobile-menu mt-10 w-100">
              <ul>
                {NAV_ITEMS.map((item) => (
                  <li key={item.path} style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}>
                    <Link href={item.path} className={`black-color f-600 ${isActive(item.path) ? "theme-color" : ""}`} style={{ fontSize: "16px" }}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="my-btn mt-25">
              <Link href="/submit" className="btn theme-bg text-capitalize d-block text-center">작품 접수</Link>
            </div>
          </div>
          <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", zIndex: 999 }}></div>
        </div>
      )}


      {/* ===== MAIN CONTENT ===== */}
      <main className="public-main">
        {children}
      </main>

      {/* ===== CHATBOT WIDGET ===== */}
      <ChatbotWidget />

      {/* ===== FOOTER ===== */}
      <footer className="evalo-home">
        <div className="footer-area home3 primary-bg pt-90">
          {/* Footer Heading */}
          <div className="footer-heading">
            <div className="container">
              <div className="row align-md-items-center align-items-start">
                <div className="col-xl-3 col-lg-3 col-md-4 col-sm-7">
                  <div className="f-logo">
                    <span className="f-700" style={{ fontSize: 20, color: "#222" }}>교육 AI 대회</span>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-8">
                  <div className="f-heading-text">
                    <h4 className="f-700">교육의 미래를 AI와 함께</h4>
                    <p>제8회 교육 공공데이터 AI활용대회</p>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-12 d-block">
                  <div className="my-btn text-lg-right text-md-center">
                    <Link href="/submit" className="btn theme-bg text-capitalize f-18 f-700">작품 접수</Link>
                  </div>
                </div>
              </div>
              <div className="footer-border-bottom pt-65"></div>
            </div>
          </div>

          {/* Footer Top */}
          <div className="footer-top mt-85">
            <div className="container">
              <div className="row">
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-8 col-12">
                  <div className="footer-widget home3-f-about-info pb-30 ml-40 pr-20 mt-25">
                    <h6 className="text-capitalize f-700 mb-22">대회 안내</h6>
                    <ul className="footer-info">
                      <li><span className="position-relative d-inline-block mb-2">접수 기간: 2026.03.01 ~ 2026.05.31</span></li>
                      <li><span className="position-relative d-inline-block mb-2">심사 기간: 2026.06.01 ~ 2026.06.30</span></li>
                      <li><span className="position-relative d-inline-block mb-2">결과 발표: 2026.07.15</span></li>
                      <li><span className="position-relative d-inline-block mb-2">총 상금: 800만원</span></li>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-12">
                  <div className="footer-widget f-info pb-30 ml-40 pr-20 mt-25">
                    <h6 className="text-capitalize f-700 mb-22">바로가기</h6>
                    <ul className="footer-info">
                      {FOOTER_LINKS.map((item) => (
                        <li key={item.path}>
                          <Link href={item.path} className="position-relative d-inline-block mb-2">{item.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-12 pr-0">
                  <div className="footer-widget f-info pb-30 ml-40 pr-20 mt-25">
                    <h6 className="text-capitalize f-700 mb-22">지원</h6>
                    <ul className="footer-info">
                      {FOOTER_SUPPORT.map((item) => (
                        <li key={item.path}>
                          <Link href={item.path} className="position-relative d-inline-block mb-2">{item.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-xl-3 offset-lg-1 col-lg-3 col-md-12 col-sm-8 col-12">
                  <div className="footer-widget f-subscriber-area pb-30 mt-25">
                    <h6 className="text-capitalize f-700 mb-22">문의</h6>
                    <div className="footer-subscribe">
                      <p>📧 support@edu-ai-contest.kr</p>
                      <p>주최: 교육부</p>
                      <p>주관: 한국교육학술정보원</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer-border-bottom pt-70"></div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="container">
              <div className="copyright-area pb-60 pt-20">
                <div className="row align-items-center justify-content-between">
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mt-10">
                    <div className="copyright-text">
                      <p className="mb-0 secondary-color2">© 2026 제8회 교육 공공데이터 AI활용대회. All rights reserved.</p>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mt-10 d-flex align-items-center justify-content-md-end">
                    <p className="mb-0 secondary-color2">주최: 교육부 | 주관: 한국교육학술정보원</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
