const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\min_0\\Desktop\\code_project\\references\\site_templates\\template_1\\main-files\\index.html','utf-8');
let b = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || '';

// --- 텍스트 교체 (메뉴는 안 건드림) ---

// 슬라이더(히어로) 영역
b = b.replace('Build Your Next <br> Startup With <span class="theme-color">Evalo</span>', '교육의 미래를 <br> AI와 함께 여는 <span class="theme-color">공모전</span>');
b = b.replace('Bole nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo<br>\n                                    conididunt ut labore et dolore magna aliqua ut enim ad minim veniam', '교육 공공데이터를 활용한 AI 솔루션을 개발하고 공유하세요<br>\n                                    제8회 교육 공공데이터 AI활용 경진대회에 여러분을 초대합니다');
b = b.replace(/>Get Started<\/a>/g, '>참가 신청</a>');
b = b.replace(/>Learn More<\/a>/, '>공모 요강</a>');

// 서비스 영역
b = b.replace('Our Services', '공정한 심사');
b = b.replace('Explore Our Core Features', '공정하고 투명한 심사 과정');
b = b.replace(/Bole nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo conididunt ut labore et dolore magna aliqua ut enim ad minim veniam/g, '교육 공공데이터를 활용하여 교육 현장의 문제를 해결하는 AI 솔루션을 개발하고 공유합니다');

b = b.replace('Easy Customize', 'AI 기술 심사');
b = b.replace('Well Documented', '교육 적합성 심사');
b = b.replace('24/7 Support', '대국민 투표');
b = b.replace(/Psum dolor sit amet, consectetur otore adipisicing elit, sed do eiusmod/g, '전문가 심사위원단이 공정하게 심사합니다');

// about 영역
b = b.replace('Why You Choose Us', '대회 소개');
b = b.replace('A better way to grow\n                                    your startup', '교육 공공데이터\n                                    AI활용 경진대회');
b = b.replace(/Ovitae purus soda duis eu ers auctor augue ultricie conse ctetur adipisicing nisi ut aliquip ex ea commodo quat Duis aute irure dolor in reprehenderit in volupta/g, '교육부와 한국교육학술정보원이 주최하는 제8회 교육 공공데이터 AI활용 경진대회입니다. 교육 현장의 문제를 해결하는 혁신적인 AI 솔루션을 발굴합니다');
b = b.replace('Faster Processing Speed', '일반부');
b = b.replace('Fastest Process for complete data', '대학(원)생 및 일반인 누구나 참가 가능');
b = b.replace('Premium Customer Supports', '학생부');
b = b.replace('Fastest customer supports for any query', '초·중·고등학생 대상 AI 활용 부문');
b = b.replace('Unlimited Features Added', '교원부');
b = b.replace('Fastest process to add more features', '현직 교원 대상 교육 AI 활용 부문');

// feature 영역
b = b.replace('Awesome Features', '주요 특징');
b = b.replace('Creative Features For Users', '대회 참가 혜택');
b = b.replace('Data Analysis', '교육부 장관상');
b = b.replace('Brainstorming', '상금 총 3,000만원');
b = b.replace('Business Report', '포트폴리오 인증');
b = b.replace('Bole nostrud exercitation ullamco laboris\n                                        nisi ut aliquip ex ea commodo', '대상, 최우수상, 우수상 등\n                                        다양한 시상 기회 제공');

// facts 영역
b = b.replace('Learn more about us', '역대 성과');
b = b.replace('Numbers Never Tell A Lie', '숫자로 보는 대회');
b = b.replace('>20<', '>8<'); // counter 20 → 8
b = b.replace('>Module<', '>역대 횟수<');
b = b.replace('>100<', '>3000<'); // 100K
b = b.replace('>Lines of Code<', '>누적 참가자<');
b = b.replace('>10<', '>500<');
b = b.replace('>Report Modeling<', '>출품 작품<');
b = b.replace('>50<', '>30<');
b = b.replace('>Color Scheme<', '>수상 작품<');
b = b.replace('>500<', '>1<');
b = b.replace('>Active user<', '>억원 상금<');

// FAQ 영역
b = b.replace('What people want to know', '자주 묻는 질문');
b = b.replace('Frequently Asked Questions', 'FAQ');
b = b.replace('How can I install this application?', '팀으로 참가할 수 있나요?');
b = b.replace('How to update the features of Evalo?', '어떤 데이터를 사용할 수 있나요?');
b = b.replace('Why Evalo is a great startup template?', '접수 후 수정이 가능한가요?');

// FAQ 답변
const faqAnswers = [
  ['card-body">\n                                                    <p class="m-0">Ovitae purus soda duis eu ers auctor augue ultricie conse ctetur adipisicing nisi ut aliquip ex ea commodo quat Duis aute irure dolor in reprehenderit in volupta</p>',
   'card-body">\n                                                    <p class="m-0">네, 개인 또는 팀(최대 5인)으로 참가할 수 있습니다. 팀 참가 시 대표자가 접수하며, 팀원 정보는 작품 설명서에 기재해 주세요.</p>'],
];
for (const [from, to] of faqAnswers) {
  b = b.replace(from, to);
}
// 나머지 FAQ 답변 교체
b = b.replace(/Ovitae purus soda duis eu ers auctor augue ultricie conse ctetur adipisicing nisi ut aliquip ex ea commodo quat Duis aute irure dolor in reprehenderit in volupta\s*/g, 
  '교육부에서 공개한 교육 공공데이터를 필수로 활용해야 합니다. 추가적으로 다른 공공데이터와 결합하여 사용할 수 있습니다.');

// Work Process 영역
b = b.replace('How It Works', '참가 절차');
b = b.replace('Our Working Process', '이렇게 진행됩니다');
b = b.replace('Register Account', '참가 신청');
b = b.replace('Generate Report', '작품 개발');
b = b.replace('Purchase Plan', '작품 제출');
b = b.replace('Get The Results', '심사 및 시상');

// Work 설명
b = b.replace(/Bole nostrud exercitation ullamcolaboris nisi ut aliquip ex ea com\s*/g, '대회 홈페이지에서 참가 신청서를 작성하고 제출합니다.');

// Testimonial 영역
b = b.replace('What People Say', '참가자 후기');
b = b.replace('Our Customer Story', '역대 수상자들의 이야기');

// Banner CTA
b = b.replace('Ready to get started with Evalo?', '지금 바로 참여하세요!');
b = b.replace(/Bole nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo conididunt ut labore/g, '접수 마감: 2026년 5월 31일까지 온라인으로 접수 가능합니다');

// --- HTML → JSX 변환 ---
b = b.replace(/<script[\s\S]*?<\/script>/gi, '');
b = b.replace(/<div id="preloader">[\s\S]*?<\/div>\s*<!--\s*\/preloader\s*-->/i, '');
b = b.replace(/\bclass="/g, 'className="');
b = b.replace(/\bclass='/g, "className='");
b = b.replace(/\bfor="/g, 'htmlFor="');
b = b.replace(/<img\b([^>]*?)(?<!\/)>/gi, '<img$1 />');
b = b.replace(/<br\s*>/gi, '<br />');
b = b.replace(/<hr\s*>/gi, '<hr />');
b = b.replace(/<input\b([^>]*?)(?<!\/)>/gi, '<input$1 />');
b = b.replace(/src="images\//g, 'src="/original-template/images/');
b = b.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
b = b.replace(/\btabindex=/gi, 'tabIndex=');

const header = `"use client";
import { useEffect } from "react";

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
  return urls.reduce((promise, url) => {
    return promise.then(() => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = url;
        script.dataset.evaloOriginal = "true";
        script.onload = resolve;
        script.onerror = resolve;
        document.body.appendChild(script);
      });
    });
  }, Promise.resolve());
}

export default function HomePage() {
  useEffect(() => {
    const links = CSS_FILES.map((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
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
    loadScriptsSequentially(JS_FILES);
    return () => {
      links.forEach((l) => l.remove());
      document.querySelectorAll("[data-evalo-original]").forEach((el) => el.remove());
    };
  }, []);

  return (<>
`;

const footer = `
  </>);
}
`;

const out = header + b.trim() + footer;
fs.writeFileSync('C:\\Users\\min_0\\Desktop\\code_project\\webapp\\src\\app\\(public)\\page.jsx', out, 'utf-8');
console.log('Done! Output: (public)/page.jsx, Chars:', b.length);
