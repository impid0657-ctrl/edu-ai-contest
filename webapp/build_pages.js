/**
 * build_pages.js — 공유 레이아웃 + 서브페이지 4개 자동 생성
 * 1. (public)/layout.jsx — CSS/JS/프리로더/헤더/푸터/모바일메뉴
 * 2. (public)/page.jsx — 홈 (한글 공모전 텍스트)
 * 3. (public)/contest-info/page.jsx — 공모요강 (about-us.html 본문)
 * 4. (public)/faq/page.jsx — FAQ (faq.html 본문)
 */
const fs = require('fs');
const path = require('path');

function htmlToJsx(b) {
  b = b.replace(/<script[\s\S]*?<\/script>/gi, '');
  b = b.replace(/\bclass="/g, 'className="');
  b = b.replace(/\bclass='/g, "className='");
  b = b.replace(/\bfor="/g, 'htmlFor="');
  b = b.replace(/<img\b([^>]*?)(?<!\/)>/gi, '<img$1 />');
  b = b.replace(/<br\s*>/gi, '<br />');
  b = b.replace(/<hr\s*>/gi, '<hr />');
  b = b.replace(/<input\b([^>]*?)(?<!\/)>/gi, '<input$1 />');
  b = b.replace(/<textarea\b([^>]*?)>\s*<\/textarea>/gi, '<textarea$1 />');
  b = b.replace(/src="images\//g, 'src="/original-template/images/');
  b = b.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
  b = b.replace(/\btabindex=/gi, 'tabIndex=');
  b = b.replace(/\bviewbox=/gi, 'viewBox=');
  return b;
}

function getBody(html) {
  return html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || '';
}

function extractBetween(html, startTag, endTag) {
  const si = html.indexOf(startTag);
  const ei = html.indexOf(endTag);
  if (si === -1 || ei === -1) return '';
  return html.substring(si, ei + endTag.length);
}

function extractMainContent(body) {
  // 헤더, 프리로더, side-mobile-menu, body-overlay, header-search, 푸터, scroll-up, script 제거
  let m = body;
  m = m.replace(/<div id="preloader">[\s\S]*?<\/div>\s*<!--\s*\/preloader\s*-->/i, '');
  const header = extractBetween(m, '<header>', '</header>');
  if (header) m = m.replace(header, '');
  // side-mobile-menu ~ header-search-details end
  const sideMenuMatch = m.match(/<div class="side-mobile-menu[\s\S]*?<!--\s*header extra info end\s*-->/i);
  if (sideMenuMatch) m = m.replace(sideMenuMatch[0], '');
  const footer = extractBetween(m, '<footer>', '</footer>');
  if (footer) m = m.replace(footer, '');
  const scrollUp = m.match(/<div id="scroll"[\s\S]*?<\/div>\s*<\/div>/i)?.[0];
  if (scrollUp) m = m.replace(scrollUp, '');
  return m;
}

const REF = 'C:\\Users\\min_0\\Desktop\\code_project\\references\\site_templates\\template_1\\main-files';
const OUT = 'C:\\Users\\min_0\\Desktop\\code_project\\webapp\\src\\app\\(public)';

// ==================== 원본 HTML 읽기 ====================
const indexHtml = fs.readFileSync(path.join(REF, 'index.html'), 'utf-8');
const aboutHtml = fs.readFileSync(path.join(REF, 'about-us.html'), 'utf-8');
const faqHtml = fs.readFileSync(path.join(REF, 'faq.html'), 'utf-8');

const indexBody = getBody(indexHtml);

// ==================== 레이아웃 구성 요소 추출 ====================
const headerHtml = extractBetween(indexBody, '<header>', '</header>');
const footerHtml = extractBetween(indexBody, '<footer>', '</footer>');
const scrollUpHtml = indexBody.match(/<div id="scroll"[\s\S]*?<\/div>\s*<\/div>/i)?.[0] || '';

// side-mobile-menu ~ header-search-details (모바일 메뉴 전체)
const sideMenuMatch = indexBody.match(/<div class="side-mobile-menu[\s\S]*?<!--\s*header extra info end\s*-->/i);
const sideMenuHtml = sideMenuMatch ? sideMenuMatch[0] : '';

// ==================== 홈 본문 + 텍스트 교체 ====================
let homeContent = extractMainContent(indexBody);

// 슬라이더
homeContent = homeContent.replace('Build Your Next <br> Startup With <span class="theme-color">Evalo</span>', '교육의 미래를 <br> AI와 함께 여는 <span class="theme-color">공모전</span>');
homeContent = homeContent.replace('Bole nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo<br>\n                                    conididunt ut labore et dolore magna aliqua ut enim ad minim veniam', '교육 공공데이터를 활용한 AI 솔루션을 개발하고 공유하세요<br>\n                                    제8회 교육 공공데이터 AI활용 경진대회에 여러분을 초대합니다');
homeContent = homeContent.replace(/>Get Started<\/a>/g, '>참가 신청</a>');
homeContent = homeContent.replace(/>Learn More<\/a>/, '>공모 요강</a>');

// 서비스
homeContent = homeContent.replace('Our Services', '공정한 심사');
homeContent = homeContent.replace('Explore Our Core Features', '공정하고 투명한 심사 과정');
homeContent = homeContent.replace(/Bole nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo conididunt ut labore et dolore magna aliqua ut enim ad minim veniam/g, '교육 공공데이터를 활용하여 교육 현장의 문제를 해결하는 AI 솔루션을 개발하고 공유합니다');
homeContent = homeContent.replace('Easy Customize', 'AI 기술 심사');
homeContent = homeContent.replace('Well Documented', '교육 적합성 심사');
homeContent = homeContent.replace('24/7 Support', '대국민 투표');
homeContent = homeContent.replace(/Psum dolor sit amet, consectetur otore adipisicing elit, sed do eiusmod/g, '전문가 심사위원단이 공정하게 심사합니다');

// about
homeContent = homeContent.replace('Why You Choose Us', '대회 소개');
homeContent = homeContent.replace('A better way to grow\n                                    your startup', '교육 공공데이터\n                                    AI활용 경진대회');
homeContent = homeContent.replace(/Ovitae purus soda duis eu ers auctor augue ultricie conse ctetur adipisicing nisi ut aliquip ex ea commodo quat Duis aute irure dolor in reprehenderit in volupta/g, '교육부와 한국교육학술정보원이 주최하는 제8회 교육 공공데이터 AI활용 경진대회입니다');
homeContent = homeContent.replace('Faster Processing Speed', '일반부');
homeContent = homeContent.replace('Fastest Process for complete data', '대학(원)생 및 일반인 누구나 참가 가능');
homeContent = homeContent.replace('Premium Customer Supports', '학생부');
homeContent = homeContent.replace('Fastest customer supports for any query', '초·중·고등학생 대상 AI 활용 부문');
homeContent = homeContent.replace('Unlimited Features Added', '교원부');
homeContent = homeContent.replace('Fastest process to add more features', '현직 교원 대상 교육 AI 활용 부문');

// feature
homeContent = homeContent.replace('Awesome Features', '주요 특징');
homeContent = homeContent.replace('Creative Features For Users', '대회 참가 혜택');
homeContent = homeContent.replace('Data Analysis', '교육부 장관상');
homeContent = homeContent.replace('Brainstorming', '상금 총 3,000만원');
homeContent = homeContent.replace('Business Report', '포트폴리오 인증');
homeContent = homeContent.replace('Bole nostrud exercitation ullamco laboris\n                                        nisi ut aliquip ex ea commodo', '대상, 최우수상, 우수상 등\n                                        다양한 시상 기회 제공');

// facts
homeContent = homeContent.replace('Learn more about us', '역대 성과');
homeContent = homeContent.replace('Numbers Never Tell A Lie', '숫자로 보는 대회');
homeContent = homeContent.replace('>20<', '>8<');
homeContent = homeContent.replace('>Module<', '>역대 횟수<');
homeContent = homeContent.replace('>100<', '>3000<');
homeContent = homeContent.replace('>Lines of Code<', '>누적 참가자<');
homeContent = homeContent.replace('>10<', '>500<');
homeContent = homeContent.replace('>Report Modeling<', '>출품 작품<');
homeContent = homeContent.replace('>50<', '>30<');
homeContent = homeContent.replace('>Color Scheme<', '>수상 작품<');
homeContent = homeContent.replace('>500<', '>1<');
homeContent = homeContent.replace('>Active user<', '>억원 상금<');

// FAQ
homeContent = homeContent.replace('What people want to know', '자주 묻는 질문');
homeContent = homeContent.replace('Frequently Asked Questions', 'FAQ');
homeContent = homeContent.replace('How can I install this application?', '팀으로 참가할 수 있나요?');
homeContent = homeContent.replace('How to update the features of Evalo?', '어떤 데이터를 사용할 수 있나요?');
homeContent = homeContent.replace('Why Evalo is a great startup template?', '접수 후 수정이 가능한가요?');

// Work Process
homeContent = homeContent.replace('How It Works', '참가 절차');
homeContent = homeContent.replace('Our Working Process', '이렇게 진행됩니다');
homeContent = homeContent.replace('Register Account', '참가 신청');
homeContent = homeContent.replace('Generate Report', '작품 개발');
homeContent = homeContent.replace('Purchase Plan', '작품 제출');
homeContent = homeContent.replace('Get The Results', '심사 및 시상');

// Testimonial
homeContent = homeContent.replace('What People Say', '참가자 후기');
homeContent = homeContent.replace('Our Customer Story', '역대 수상자들의 이야기');

// Banner CTA
homeContent = homeContent.replace('Ready to get started with Evalo?', '지금 바로 참여하세요!');
homeContent = homeContent.replace(/Bole nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo conididunt ut labore/g, '접수 마감: 2026년 5월 31일까지 온라인으로 접수 가능합니다');

// ==================== about-us 본문 추출 ====================
const aboutContent = extractMainContent(getBody(aboutHtml));

// ==================== faq 본문 추출 ====================
const faqContent = extractMainContent(getBody(faqHtml));

// ==================== 파일 생성 ====================

// 1. Layout
const layoutCode = `"use client";
import { useEffect, useState } from "react";

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

export default function PublicLayout({ children }) {
  const [loading, setLoading] = useState(true);

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

    return () => {
      links.forEach((l) => l.remove());
      document.querySelectorAll("[data-evalo-original]").forEach((el) => el.remove());
      history.scrollRestoration = "auto";
    };
  }, []);

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
          <style>{\`@keyframes spin { to { transform: rotate(360deg); } }\`}</style>
        </div>
      </div>
    )}
${htmlToJsx(headerHtml)}
${htmlToJsx(sideMenuHtml)}
    {children}
${htmlToJsx(footerHtml)}
${htmlToJsx(scrollUpHtml)}
  </>);
}
`;

// 2. Home page
const homeCode = `export default function HomePage() {
  return (<>
${htmlToJsx(homeContent).trim()}
  </>);
}
`;

// 3. Contest info page
const contestCode = `export default function ContestInfoPage() {
  return (<>
${htmlToJsx(aboutContent).trim()}
  </>);
}
`;

// 4. FAQ page
const faqCode = `export default function FaqPage() {
  return (<>
${htmlToJsx(faqContent).trim()}
  </>);
}
`;

// ==================== 파일 저장 ====================
fs.writeFileSync(path.join(OUT, 'layout.jsx'), layoutCode, 'utf-8');
console.log('layout.jsx:', layoutCode.length, 'chars');

fs.writeFileSync(path.join(OUT, 'page.jsx'), homeCode, 'utf-8');
console.log('page.jsx:', homeCode.length, 'chars');

fs.mkdirSync(path.join(OUT, 'contest-info'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'contest-info', 'page.jsx'), contestCode, 'utf-8');
console.log('contest-info/page.jsx:', contestCode.length, 'chars');

fs.mkdirSync(path.join(OUT, 'faq'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'faq', 'page.jsx'), faqCode, 'utf-8');
console.log('faq/page.jsx:', faqCode.length, 'chars');

console.log('\nDone! 4 files generated.');
