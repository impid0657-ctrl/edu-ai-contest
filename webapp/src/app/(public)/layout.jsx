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

// 서브메뉴 매핑: API 메뉴 데이터를 기반으로 동적 생성 (아래 buildSubMenuMap 참조)
// /faq가 메뉴에 포함되어 있으면 /contact 하위 드롭다운으로 표시, 없으면 드롭다운 없이 단독 표시

export default function PublicLayout({ children }) {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [accessBlocked, setAccessBlocked] = useState(null); // { warning: string } or null
    const [isAdmin, setIsAdmin] = useState(false);
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

        // 메뉴 데이터는 별도 useEffect에서 pathname 변경마다 로드 (아래 참조)

        // AccessCheckedLink 컴포넌트에서 발행하는 커스텀 이벤트 수신
        const handleAccessBlocked = (e) => setAccessBlocked(e.detail);
        window.addEventListener("show-access-blocked", handleAccessBlocked);

        return () => {
            links.forEach((l) => l.remove());
            document.querySelectorAll("[data-evalo-original]").forEach((el) => el.remove());
            history.scrollRestoration = "auto";
            window.removeEventListener("show-access-blocked", handleAccessBlocked);
        };
    }, []);

    // 메뉴 데이터 로드 + 페이지 접근 권한 체크 (pathname 변경마다 갱신)
    // → 로그아웃 후 페이지 이동 시 자동으로 일반 사용자 메뉴로 전환
    useEffect(() => {
        // 메뉴 데이터 로드 (관리자/일반 독립 메뉴 반환)
        fetch("/api/pages?menu=true")
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.menu?.length > 0) setMenuItems(data.menu);
                setIsAdmin(!!data?.isAdmin);
            })
            .catch(() => { });

        // 접근 권한 체크
        setAccessBlocked(null);
        if (!pathname || pathname === "/") return;
        fetch(`/api/pages?path=${encodeURIComponent(pathname)}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.access === "private") {
                    setAccessBlocked({ warning: data.warning || "이 페이지는 현재 비공개 상태입니다." });
                }
            })
            .catch(() => { });
    }, [pathname]);

    const activeMenu = menuItems.length > 0 ? menuItems : FALLBACK_MENU;

    // 동적 서브메뉴 구성: /faq가 메뉴에 있으면 /contact 하위 드롭다운으로 구성
    const subMenuMap = {};
    const subPaths = new Set();
    const faqItem = activeMenu.find(m => m.path === "/faq");
    if (faqItem) {
        const contactItem = activeMenu.find(m => m.path === "/contact");
        subMenuMap["/contact"] = [
            { path: "/contact", title: contactItem?.title || "문의하기" },
            { path: "/faq", title: faqItem.title || "자주묻는 질문" },
        ];
        subPaths.add("/contact");
        subPaths.add("/faq");
    }

    // 비공개 메뉴 클릭 핸들러 — 페이지 이동 없이 모달 표시
    const handleMenuClick = (e, item) => {
        if (item.is_public === false) {
            e.preventDefault();
            setAccessBlocked({ warning: item.access_warning || "이 페이지는 현재 비공개 상태입니다." });
            setMobileMenuOpen(false);
        }
    };

    // 경로 기반 비공개 체크 (하드코딩된 버튼용)
    const handlePathClick = async (e, path) => {
        // 먼저 메뉴 데이터에서 확인
        const item = activeMenu.find(m => m.path === path);
        if (item && item.is_public === false) {
            e.preventDefault();
            setAccessBlocked({ warning: item.access_warning || "이 페이지는 현재 비공개 상태입니다." });
            setMobileMenuOpen(false);
            return;
        }
        // 메뉴에 없는 경로면 API로 확인
        if (!item) {
            e.preventDefault();
            try {
                const res = await fetch(`/api/pages?path=${encodeURIComponent(path)}`);
                const data = await res.ok ? await res.json() : null;
                if (data?.access === "private") {
                    setAccessBlocked({ warning: data.warning || "이 페이지는 현재 비공개 상태입니다." });
                    setMobileMenuOpen(false);
                    return;
                }
            } catch { /* 오류 시 그냥 이동 */ }
            window.location.href = path;
        }
    };

    // 메인 메뉴에서 서브메뉴 경로 제외 (단, 서브메뉴 부모는 포함)
    const mainMenuItems = activeMenu.filter(item => {
        if (subPaths.has(item.path) && !subMenuMap[item.path]) return false;
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
                        borderTop: "4px solid #2161a6", borderRadius: "50%",
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {/* 로고 */}
                            <div className="logo" style={{ flexShrink: 0 }}>
                                <a href="/" className="d-block"><img src="/original-template/images/logo/logo.png" alt="교육 공공데이터 AI활용 경진대회" /></a>
                            </div>
                            {/* 메뉴 — 중앙 */}
                            <div className="main-menu d-none d-lg-block" style={{ flex: 1 }}>
                                <nav id="mobile-menu">
                                    <ul className="d-flex justify-content-center" style={{ flexWrap: 'nowrap', gap: '0', margin: 0, padding: 0 }}>
                                        {mainMenuItems.map((item, idx) => (
                                            <li key={idx} style={{ whiteSpace: 'nowrap' }}>
                                                <a href={item.path} onClick={(e) => handleMenuClick(e, item)}>{item.title}</a>
                                                {subMenuMap[item.path] && (
                                                    <ul className="mega-menu mega-dropdown-menu white-bg ml-0">
                                                        {subMenuMap[item.path].map((sub, si) => (
                                                            <li key={si}><a href={sub.path}>{sub.title}</a></li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>{/* /main-menu */}
                            {/* 대회접수 버튼 — 오른쪽 고정 */}
                            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="my-btn d-none d-sm-block">
                                    <a href="/submit" className="btn theme-bg text-capitalize" style={{ whiteSpace: 'nowrap' }} onClick={(e) => handlePathClick(e, '/submit')}>대회접수</a>
                                </div>
                                <div className="d-block d-lg-none">
                                    <a className="mobile-menubar theme-color" href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(!mobileMenuOpen); }}><i className="far fa-bars"></i></a>
                                </div>
                            </div>
                        </div>{/* /flex row */}
                    </div>{/* /container */}
                </div>
            </div>{/* /header-bottom */}

        </header>
        {/* 모바일 사이드 메뉴 */}
        <div className="side-mobile-menu white-bg pt-10 pb-30 pl-35 pr-30 pb-100" style={{
            position: 'fixed', top: 0, right: mobileMenuOpen ? 0 : '-320px',
            width: '300px', height: '100vh', zIndex: 10000,
            transition: 'right 0.3s ease', overflowY: 'auto',
            boxShadow: mobileMenuOpen ? '-4px 0 20px rgba(0,0,0,0.15)' : 'none',
        }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px 0 10px' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); }}>
                    <span className="icon-clear theme-color" style={{ fontSize: '24px' }}><i className="fa fa-times"></i></span>
                </a>
            </div>
            <nav style={{ marginTop: '10px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {mainMenuItems.map((item, idx) => (
                        <li key={idx} style={{ borderBottom: '1px solid #eee' }}>
                            <a href={item.path} style={{
                                display: 'block', padding: '14px 0', fontSize: '16px',
                                color: '#333', textDecoration: 'none', fontWeight: 500,
                            }} onClick={(e) => handleMenuClick(e, item)}>{item.title}</a>
                            {subMenuMap[item.path] && (
                                <ul style={{ listStyle: 'none', padding: '0 0 10px 15px', margin: 0 }}>
                                    {subMenuMap[item.path].map((sub, si) => (
                                        <li key={si}>
                                            <a href={sub.path} style={{
                                                display: 'block', padding: '8px 0', fontSize: '14px',
                                                color: '#666', textDecoration: 'none',
                                            }} onClick={() => setMobileMenuOpen(false)}>{sub.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                    <li style={{ borderBottom: '1px solid #eee' }}>
                        <a href="/submit" style={{
                            display: 'block', padding: '14px 0', fontSize: '16px',
                            color: '#2161a6', textDecoration: 'none', fontWeight: 700,
                        }} onClick={(e) => handlePathClick(e, '/submit')}>대회접수</a>
                    </li>
                </ul>
            </nav>
            <div style={{ marginTop: '40px' }}>
                <h6 className="f-700 mb-0">문의처</h6>
                <p className="theme-color f-700 mb-0">gongmo@stunning.kr</p>
            </div>
        </div>{/* /side-mobile-menu */}
        {/* 배경 오버레이 */}
        {mobileMenuOpen && (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 9999,
            }} onClick={() => setMobileMenuOpen(false)}></div>
        )}
        {/* header extra info end  */}
        {/* 비공개 메뉴 경고 모달 */}
        {accessBlocked && (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 99998,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <div style={{
                    background: '#fff', borderRadius: '16px', padding: '48px 40px',
                    maxWidth: '480px', width: '90%', textAlign: 'center',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}>
                    <p style={{ fontSize: '18px', color: '#333', lineHeight: '1.7', marginBottom: '28px', fontWeight: 600 }}>
                        {accessBlocked.warning}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button type="button" className="btn theme-bg text-white f-16 f-700"
                           style={{ padding: '12px 48px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                           onClick={() => setAccessBlocked(null)}>
                            확인
                        </button>
                    </div>
                </div>
            </div>
        )}
        {children}
        <footer>
            <div className="footer-area primary-bg pt-200">
                <div className="footer-top pb-55">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-4  col-lg-4  col-md-4  col-sm-6 col-12">
                                <div className="footer-widget f-info pb-30 pr-20 mt-25">
                                    <h6 className="text-capitalize f-700 mb-22">바로가기</h6>
                                    <ul className="footer-info">
                                        <li>
                                            <a href="/" className="position-relative d-inline-block mb-2">홈</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>{/* /col */}
                            <div className="col-xl-4  col-lg-4  col-md-4  col-sm-6 col-12">
                                <div className="footer-widget f-info pb-30 pr-20 mt-25">
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

                                    </ul>
                                </div>
                            </div>{/* /col */}
                            <div className="col-xl-4  col-lg-4  col-md-4  col-sm-12 col-12">
                                <div className="footer-widget f-adress pb-40 mt-25">
                                    <h6 className="text-capitalize f-700 mb-22">문의처</h6>
                                    <ul className="footer-address">
                                        <li className="d-flex align-items-start">
                                            <span className="f-icon mr-20 mt-1"><i className="fas fa-map-marker-alt"></i></span>
                                            <div className="">
                                                대구광역시 동구 동내로 64 <br />한국교육학술정보원 <br />
                                            </div>
                                        </li>
                                        <li>
                                            <span className="f-icon mr-20 mt-1"><i className="far fa-envelope"></i></span>
                                            <a href="mailto:gongmo@stunning.kr" className="theme-color f-700">gongmo@stunning.kr</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>{/* /col */}
                        </div>{/* /row */}
                    </div>{/* /container */}
                </div>
                <div className="footer-bottom">
                    <div className="container">
                        <div className="copyright-area mt-20 pb-50">
                            <div className="row align-items-center justify-content-center">
                                <div className="col-12">
                                    <div className="copyright-text text-center mt-20 mb-20">
                                        <p className="mb-0 secondary-color2">© 2026 교육 공공데이터 AI활용 경진대회. All rights reserved.
                                            <a href="https://www.keris.or.kr" className="c-theme f-700 black-color">한국교육학술정보원</a>
                                        </p>
                                    </div>
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
