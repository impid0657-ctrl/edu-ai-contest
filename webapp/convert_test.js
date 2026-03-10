const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\min_0\\Desktop\\code_project\\references\\site_templates\\template_1\\main-files\\index.html','utf-8');
let b = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || '';
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
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.dataset.evaloOriginal = "true";
        script.onload = resolve;
        script.onerror = resolve; // continue even if one fails
        document.body.appendChild(script);
      });
    });
  }, Promise.resolve());
}

export default function TestTemplatePage() {
  useEffect(() => {
    // CSS link 태그 삽입
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

    // JS 순차 로드 (jQuery → Bootstrap → 나머지 순서 보장)
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
fs.writeFileSync('C:\\Users\\min_0\\Desktop\\code_project\\webapp\\src\\app\\test-template\\page.jsx', out, 'utf-8');
console.log('Done! Chars:', b.length);
