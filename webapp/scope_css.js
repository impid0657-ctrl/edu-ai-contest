/**
 * PostCSS로 원본 CSS를 .evalo-home 스코프로 정확하게 변환
 */
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const prefixSelector = require('postcss-prefix-selector');

const SCOPE = '.evalo-home';
const BASE = 'C:\\Users\\min_0\\Desktop\\code_project\\references\\site_templates\\template_1\\main-files\\css';
const OUTPUT = 'C:\\Users\\min_0\\Desktop\\code_project\\webapp\\src\\app\\evalo-full.css';

const files = ['default.css', 'style.css', 'responsive.css'];

async function run() {
  let combined = '/* evalo-full.css — PostCSS로 .evalo-home 스코프 자동 변환 */\n';
  combined += '/* 이 파일은 자동 생성됨. 직접 수정 금지. */\n\n';

  for (const f of files) {
    const content = fs.readFileSync(path.join(BASE, f), 'utf-8');
    console.log(`Processing ${f}: ${content.length} chars`);

    const result = await postcss([
      prefixSelector({
        prefix: SCOPE,
        transform: function (prefix, selector, prefixedSelector, filePath, rule) {
          // body, html → .evalo-home
          if (selector === 'body' || selector === 'html') return prefix;
          if (selector.startsWith('body ')) return `${prefix} ${selector.slice(5)}`;
          if (selector.startsWith('html ')) return `${prefix} ${selector.slice(5)}`;
          // @keyframes 내부 선택자는 스코핑 안 함
          if (rule.parent && rule.parent.type === 'atrule' && rule.parent.name && rule.parent.name.includes('keyframes')) {
            return selector;
          }
          return prefixedSelector;
        }
      })
    ]).process(content, { from: path.join(BASE, f) });

    combined += `\n/* ===== ${f} ===== */\n`;
    combined += result.css;
    combined += '\n';
  }

  fs.writeFileSync(OUTPUT, combined, 'utf-8');
  console.log(`\nDone! Output: ${OUTPUT} (${combined.length} chars)`);
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
