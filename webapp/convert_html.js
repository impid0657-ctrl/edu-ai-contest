/**
 * 원본 index.html body 전체(헤더/푸터 포함)를 JSX로 변환
 */
const fs = require('fs');

const html = fs.readFileSync(
  'C:\\Users\\min_0\\Desktop\\code_project\\references\\site_templates\\template_1\\main-files\\index.html',
  'utf-8'
);

// body 내용만 추출
let b = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || '';

// script 태그 제거
b = b.replace(/<script[\s\S]*?<\/script>/gi, '');

// preloader 제거 (React와 충돌)
b = b.replace(/<div id="preloader">[\s\S]*?<\/div>\s*<!--\s*\/preloader\s*-->/i, '');

// class → className
b = b.replace(/\bclass="/g, 'className="');
b = b.replace(/\bclass='/g, "className='");

// for → htmlFor
b = b.replace(/\bfor="/g, 'htmlFor="');

// self-closing tags
b = b.replace(/<img\b([^>]*?)(?<!\/)>/gi, '<img$1 />');
b = b.replace(/<br\s*>/gi, '<br />');
b = b.replace(/<hr\s*>/gi, '<hr />');
b = b.replace(/<input\b([^>]*?)(?<!\/)>/gi, '<input$1 />');

// images/ → /evalo-images/
b = b.replace(/src="images\//g, 'src="/evalo-images/');

// HTML comments → JSX comments
b = b.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

// tabindex → tabIndex
b = b.replace(/\btabindex=/gi, 'tabIndex=');

const out = `"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "@/app/evalo-full.css";

export default function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true, offset: 50 });
  }, []);

  return (
    <div className="evalo-home">
${b.trim()}
    </div>
  );
}
`;

fs.writeFileSync(
  'C:\\Users\\min_0\\Desktop\\code_project\\webapp\\src\\app\\(public)\\page.jsx',
  out,
  'utf-8'
);
console.log('Done! Chars:', b.length);
