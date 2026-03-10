"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const CSS_FILES = [
  "/original-template/css/bootstrap.min.css",
  "/original-template/css/fontawesome-all.min.css",
  "/original-template/css/flaticon.css",
  "/original-template/css/aos.css",
  "/original-template/css/carousel.css",
  "/original-template/css/animate.css",
  "/original-template/css/slick.css",
  "/original-template/css/jquery.fancybox.min.css",
  "/original-template/css/meanmenu.css",
  "/original-template/css/all-animations.css",
  "/original-template/css/default.css",
  "/original-template/css/style.css",
  "/original-template/css/responsive.css",
];

const JS_FILES = [
  "/original-template/js/vendor/modernizr-3.5.0.min.js",
  "/original-template/js/vendor/jquery-1.12.4.min.js",
  "/original-template/js/popper.min.js",
  "/original-template/js/bootstrap.min.js",
  "/original-template/js/parallax.js",
  "/original-template/js/carousel.js",
  "/original-template/js/isotope.pkgd.min.js",
  "/original-template/js/image-loaded.min.js",
  "/original-template/js/jquery.fancybox.min.js",
  "/original-template/js/waypoint.js",
  "/original-template/js/counterup-min.js",
  "/original-template/js/slick.min.js",
  "/original-template/js/tilt.jquery.min.js",
  "/original-template/js/aos.js",
  "/original-template/js/plugins.js",
  "/original-template/js/jquery.meanmenu.min.js",
  "/original-template/js/main.js",
];

function loadScriptsSequentially(urls) {
  return urls.reduce((p, url) => p.then(() => new Promise((r) => {
    const s = document.createElement("script");
    s.src = url; s.dataset.evaloOriginal = "true";
    s.onload = r; s.onerror = r;
    document.body.appendChild(s);
  })), Promise.resolve());
}

// 하드코딩 fallback (API 실패 시)
const FALLBACK_MENU = [
  { path: "/", title: "홈" },
  { path: "/contest-info", title: "대회안내" },
  { path: "/guidelines", title: "공모요강" },
  { path: "/submit/lookup", title: "접수조회" },
  { path: "/board", title: "공지사항" },
  { path: "/contact", title: "문의하기" },
  { path: "/license-apply", title: "AI이용권 신청" },
];

// 서브메뉴 매핑 (contact 하위에 faq)
const SUB_MENU_MAP = {
  "/contact": [
    { path: "/contact", title: "문의하기" },
    { path: "/faq", title: "자주묻는 질문" },
  ],
};

// 서브메뉴에 포함된 경로 (메인 메뉴에서 제외)
const SUB_PATHS = new Set(
  Object.values(SUB_MENU_MAP).flatMap(subs => subs.map(s => s.path))
);

export default function PublicLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
    history.scrollRestoration = "manual";

    const links = CSS_FILES.map((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet"; link.href = href;
      link.dataset.evaloOriginal = "true";
      document.head.appendChild(link);
      return link;
    });
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap";
    fontLink.dataset.evaloOriginal = "true";
    document.head.appendChild(fontLink);
    links.push(fontLink);

    loadScriptsSequentially(JS_FILES).then(() => {
      setTimeout(() => { window.scrollTo(0, 0); setLoading(false); }, 300);
    });

    // 메뉴 데이터 API에서 로드
    fetch("/api/pages?menu=true")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.menu?.length > 0) setMenuItems(data.menu);
      })
      .catch(() => {});

    return () => {
      links.forEach((l) => l.remove());
      document.querySelectorAll("[data-evalo-original]").forEach((el) => el.remove());
      history.scrollRestoration = "auto";
    };
  }, []);

  // 페이지 접근 권한 체크
  useEffect(() => {
    if (!pathname || pathname === "/") return;
    fetch(`/api/pages?path=${encodeURIComponent(pathname)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.access === "private") {
          alert(data.warning || "이 페이지는 현재 비공개 상태입니다.");
          window.history.back();
        }
      })
      .catch(() => {});
  }, [pathname]);

  const activeMenu = menuItems.length > 0 ? menuItems : FALLBACK_MENU;

  // 메인 메뉴에서 서브메뉴 경로 제외 (단, 서브메뉴 부모는 포함)
  const mainMenuItems = activeMenu.filter(item => {
    // /faq는 contact 서브메뉴이므로 메인에서 제외
    if (SUB_PATHS.has(item.path) && !SUB_MENU_MAP[item.path]) return false;
    return true;
  });

  return (<>
    {loading && (
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "#fff", zIndex: 99999,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40, height: 40, border: "4px solid #e0e0e0",
            borderTop: "4px solid #6c63ff", borderRadius: "50%",
            animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )}
<header>
            <div id="header-sticky" className="transparent-header header-area">
                <div className="header">
                    <div className="container">
                        <div className="row align-items-center justify-content-between position-relative">
                            <div className="col-xl-2 col-lg-2 col-md-3 col-sm-5 col-6">
                                <div className="logo">
                                    <a href="/" className="d-block"><img src="/original-template/images/logo/logo.png" alt="교육 공공데이터 AI활용 경진대회" /></a>
                                </div>
                            </div>{/* /col */}
                            <div className="col-xl-8 col-lg-8 col-md-1 col-sm-1 col-1 d-none d-lg-flex justify-content-center position-static">
                                <div className="main-menu">
                                    <nav id="mobile-menu">
                                        <ul className="d-block">
                                            {mainMenuItems.map((item, idx) => (
                                              <li key={idx}>
                                                <a href={item.path}>{item.title}</a>
                                                {SUB_MENU_MAP[item.path] && (
                                                  <ul className="mega-menu mega-dropdown-menu white-bg ml-0">
                                                    {SUB_MENU_MAP[item.path].map((sub, si) => (
                                                      <li key={si}><a href={sub.path}>{sub.title}</a></li>
                                                    ))}
                                                  </ul>
                                                )}
                                              </li>
                                            ))}
                                         </ul>
                                    </nav>
                                </div>{/* /main-menu */}
                            </div>{/* /col */}
                            <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6 col-4 pl-lg-0 pl-xl-3">
                                <div className="header-right d-flex align-items-center justify-content-lg-between justify-content-end">
                                    <div className="my-btn ml-20 d-none d-sm-block">
                                        <a href="/submit" className="btn theme-bg text-capitalize" style={{whiteSpace: 'nowrap'}}>대회접수</a>
                                    </div>{/* /my-btn */}
                                    <div className="d-block d-lg-none pl-20">
                                        <a className="mobile-menubar theme-color" href="javascript:void(0);"><i className="far fa-bars"></i></a>
                                    </div>
                                    {/* <div className="mobile-menu"></div> */}
                                </div>{/* /header-right */}
                            </div>{/* /col */}
                        </div>{/* /row */}
                    </div>{/* /container */}
                </div>
            </div>{/* /header-bottom */}
        </header>
<div className="side-mobile-menu white-bg pt-10 pb-30 pl-35 pr-30 pb-100">
            <div className="d-fle justify-content-between w-100">
                <div className="close-icon d-inline-block float-right clear-both mt-15 mb-10">
                    <a href="javascript:void(0);"><span className="icon-clear theme-color"><i className="fa fa-times"></i></span></a>
                </div>
            </div>
            <div className="mobile-menu mt-10 w-100"></div>
            <ul className="social-link pt-50 clear-both">
                <li className="d-inline-block">
                    <a className="facebook-color text-center pr-15 d-inline-block transition-3" href="#"><i className="fab fa-facebook-f"></i></a>
                </li>
                <li className="d-inline-block">
                    <a className="twitter-color text-center pr-15 d-inline-block transition-3" href="#"><i className="fab fa-twitter"></i></a>
                </li>
                <li className="d-inline-block">
                    <a className="google-plus-color text-center pr-15 d-inline-block transition-3" href="#"><i className="fab fa-google-plus-g"></i></a>
                </li>
                <li className="d-inline-block">
                    <a className="linked-in-color text-center d-inline-block transition-3" href="#"><i className="fab fa-linkedin-in"></i></a>
                </li>
            </ul>{/* social-link */}

            {/* mobile phone area */}
            <div className="mobile-phone-contact phone-contact mt-150 mb-25">
                <h6 className="f-700 mb-0">문의처</h6>
                <p className="theme-color f-700 mb-0">edu-ai-contest@keris.or.kr</p>
            </div>{/* /mobile phone area */}

        </div>{/* /side-mobile-menu */}
        <div className="body-overlay"></div>
        {/* header extra info end  */}
    {children}
<footer> 
            <div className="footer-area primary-bg pt-200">
                <div className="footer-top pb-55">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-3  col-lg-4  col-md-12  col-sm-12 col-12">
                                <div className="footer-widget f-subscriber-area pb-30 mt-25">
                                    <h6 className="text-capitalize f-700 mb-22">소식받기</h6>
                                    <div className="footer-subscribe">
                                        <p>대회 관련 최신 소식을 이메일로 받아보세요</p>
                                        <form action="#">
                                            <div className="subscribe-info mt-22 position-relative">
                                                <input className="sub-name form-control border-0 pl-20 pt-15 pb-15 pr-10 white-bg secondary-color rounded-0" type="email" name="email" id="email" placeholder="이메일 주소 입력" />
                                                <span className="secondary-color d-inline-block position-absolute pointer"><i className="far fa-envelope"></i></span>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>{/* /col */}
                            <div className="col-xl-2 offset-xl-1  col-lg-2  col-md-3  col-sm-6 col-12">
                                <div className="footer-widget f-info pb-30 ml-40 pr-20 mt-25">
                                    <h6 className="text-capitalize f-700 mb-22">바로가기</h6>
                                    <ul className="footer-info">
                                        <li>
                                            <a href="/contest-info" className="position-relative d-inline-block mb-2">대회안내</a>
                                        </li>
                                        <li>
                                            <a href="/guidelines" className="position-relative d-inline-block mb-2">공모요강</a>
                                        </li>
                                        <li>
                                            <a href="/submit" className="position-relative d-inline-block mb-2">대회접수</a>
                                        </li>
                                        <li>
                                            <a href="/submit/lookup" className="position-relative d-inline-block mb-2">접수조회</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>{/* /col */}
                            <div className="col-xl-2  col-lg-2  col-md-3  col-sm-6 col-12">
                                <div className="footer-widget f-info pb-30 ml-40 pr-20 mt-25">
                                    <h6 className="text-capitalize f-700 mb-22">고객지원</h6>
                                    <ul className="footer-info">
                                        <li>
                                            <a href="/board" className="position-relative d-inline-block mb-2">공지사항</a>
                                        </li>
                                        <li>
                                            <a href="/contact" className="position-relative d-inline-block mb-2">문의하기</a>
                                        </li>
                                        <li>
                                            <a href="/faq" className="position-relative d-inline-block mb-2">자주묻는 질문</a>
                                        </li>
                                        <li>
                                            <a href="/license-apply" className="position-relative d-inline-block mb-2">AI이용권 신청</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>{/* /col */}
                            <div className="col-xl-3  col-lg-4  col-md-6  col-sm-12 col-12 pr-xl-0">
                                <div className="footer-widget f-adress pb-40 mt-25">
                                    <h6 className="text-capitalize f-700 mb-22">문의처</h6>
                                    <ul className="footer-address">
                                        <li className="d-flex align-items-start">
                                            <span className="f-icon mr-20 mt-1"><i className="fas fa-map-marker-alt"></i></span> 
                                            <div className="">
                                                대구광역시 동구 화랑로 64 <br />한국교육학술정보원 <br />
                                            </div>  
                                        </li>
                                        <li>
                                            <span className="f-icon mr-20 mt-1"><i className="far fa-envelope"></i></span>
                                            edu-ai-contest@keris.or.kr
                                        </li>
                                    </ul>
                                    <ul className="social-link mt-15">
                                        <li className="d-inline-block">
                                            <a className="facebook-color text-center pr-15 d-inline-block transition-3" href="#"><i className="fab fa-facebook-f"></i></a>
                                        </li>
                                        <li className="d-inline-block">
                                            <a className="twitter-color text-center pr-15 d-inline-block transition-3" href="#"><i className="fab fa-twitter"></i></a>
                                        </li>
                                        <li className="d-inline-block">
                                            <a className="youtube-color text-center pr-15 d-inline-block transition-3" href="#"><i className="fab fa-youtube"></i></a>
                                        </li>
                                        <li className="d-inline-block">
                                            <a className="instagram-color text-center d-inline-block transition-3" href="#"><i className="fab fa-instagram"></i></a>
                                        </li>
                                    </ul>{/* social-link */}
                                </div>
                            </div>{/* /col */}
                        </div>{/* /row */}
                    </div>{/* /container */}
                </div>
                <div className="footer-bottom">
                    <div className="container">
                        <div className="copyright-area mt-20 pb-50">
                            <div className="row align-items-center">
                                <div className="col-xl-6  col-lg-6  col-md-6  col-sm-12 col-12 mb-10">
                                    <div className="f-logo text-center text-md-left">
                                        <img src="/original-template/images/logo/logo.png" alt="image" />
                                    </div>{/* /f-logo */}
                                </div>{/* /col */}
                                <div className="col-xl-6  col-lg-6  col-md-6  col-sm-12 col-12 mb-10">
                                    <div className="phone-contact text-center text-md-right">
                                        <a className="theme-color f-700" href="mailto:edu-ai-contest@keris.or.kr"><span className="pr-1"><span className="d-inline-block"><i className="far fa-envelope"></i></span></span> edu-ai-contest@keris.or.kr</a>
                                    </div>
                                </div>{/* /col */}
                            </div>{/* /row */}
                            <div className="row align-items-center justify-content-between">
                                <div className="col-xl-6  col-lg-5  col-md-12  col-sm-12 col-12">
                                    <div className="copyright-text text-center text-lg-left mt-20 mb-20">
                                        <p className="mb-0 secondary-color2">© 2026 교육 공공데이터 AI활용 경진대회. All rights reserved. 
                                            <a href="https://www.keris.or.kr" className="c-theme f-700 black-color">한국교육학술정보원</a>
                                        </p>
                                    </div>
                                </div>{/* /col */}
                                <div className="col-xl-6  col-lg-7  col-md-12  col-sm-12 col-12">
                                    <ul className="useful-link text-center text-lg-right mt-20">
                                        <li className="d-inline-block mb-20">
                                            <a href="#" className="secondary-color d-inline-block">이용약관</a>
                                        </li>
                                        <li className="d-inline-block pl-45 mb-20">
                                            <a href="#" className="secondary-color d-inline-block">개인정보처리방침</a>
                                        </li>
                                        <li className="d-inline-block pl-45 mb-20">
                                            <a href="#" className="secondary-color d-inline-block">저작권 정책</a>
                                        </li>                                    
                                    </ul>{/* social */}
                                </div>{/* /col */}
                            </div>
                        </div>{/* /copyright-area */}
                    </div>{/* /container */}
                </div>
            </div>
        </footer>
<div id="scroll" className="scroll-up position-relative z-index11">
            <div className="top text-center"><span className="white-color theme-bg"><i className="fa fa-arrow-alt-up"></i></span></div>
        </div>
  </>);
}
