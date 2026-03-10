// Admin audit script - ASCII output to avoid encoding issues
const BASE = 'http://localhost:3000';

const endpoints = [
  // Admin API
  { path: '/api/admin/dashboard', method: 'GET', label: 'Dashboard API' },
  { path: '/api/admin/license', method: 'GET', label: 'License List API' },
  { path: '/api/admin/board', method: 'GET', label: 'Board List API' },
  { path: '/api/admin/submissions', method: 'GET', label: 'Submissions API' },
  { path: '/api/admin/chatbot/settings', method: 'GET', label: 'Chatbot Settings API' },
  { path: '/api/admin/chatbot/logs', method: 'GET', label: 'Chatbot Logs API' },
  { path: '/api/admin/chatbot/documents', method: 'GET', label: 'Chatbot Docs API' },
  { path: '/api/admin/ai-review/results', method: 'GET', label: 'AI Review Results API' },
  { path: '/api/admin/settings', method: 'GET', label: 'Admin Settings API' },
  { path: '/api/admin/site-settings', method: 'GET', label: 'Site Settings API' },
  { path: '/api/admin/pages', method: 'GET', label: 'Pages Admin API' },
  { path: '/api/admin/verifications', method: 'GET', label: 'Verifications API' },
  // Public API
  { path: '/api/auth/me', method: 'GET', label: 'Auth Me API' },
  { path: '/api/board?type=notice', method: 'GET', label: 'Notice Board API' },
  { path: '/api/board?type=qna', method: 'GET', label: 'QnA Board API' },
  { path: '/api/faq', method: 'GET', label: 'FAQ API' },
  { path: '/api/settings/auth-providers', method: 'GET', label: 'Auth Providers API' },
  { path: '/api/settings/chatbot-questions', method: 'GET', label: 'Chatbot Questions API' },
  { path: '/api/site-settings', method: 'GET', label: 'Public Site Settings API' },
  { path: '/api/pages?menu=true', method: 'GET', label: 'Public Pages API' },
  // Pages
  { path: '/', method: 'GET', label: 'Home Page', page: true },
  { path: '/admin', method: 'GET', label: 'Admin Dashboard Page', page: true },
  { path: '/admin/license', method: 'GET', label: 'Admin License Page', page: true },
  { path: '/admin/board', method: 'GET', label: 'Admin Board Page', page: true },
  { path: '/admin/submissions', method: 'GET', label: 'Admin Submissions Page', page: true },
  { path: '/admin/chatbot', method: 'GET', label: 'Admin Chatbot Page', page: true },
  { path: '/admin/chatbot/logs', method: 'GET', label: 'Admin Chat Logs Page', page: true },
  { path: '/admin/settings', method: 'GET', label: 'Admin Settings Page', page: true },
  { path: '/admin/pages', method: 'GET', label: 'Admin Pages Page', page: true },
  { path: '/admin/verifications', method: 'GET', label: 'Admin Verif Page', page: true },
  { path: '/admin/review-results', method: 'GET', label: 'Admin Review Page', page: true },
  { path: '/board', method: 'GET', label: 'Board Page', page: true },
  { path: '/contact', method: 'GET', label: 'Contact Page', page: true },
  { path: '/faq', method: 'GET', label: 'FAQ Page', page: true },
  { path: '/license-apply', method: 'GET', label: 'License Apply Page', page: true },
  { path: '/submit', method: 'GET', label: 'Submit Page', page: true },
  { path: '/contest-info', method: 'GET', label: 'Contest Info Page', page: true },
  { path: '/login', method: 'GET', label: 'Login Page', page: true },
  { path: '/admin/logout', method: 'GET', label: 'Logout Page', page: true },
];

(async () => {
  const results = [];
  
  for (const ep of endpoints) {
    try {
      const start = Date.now();
      const res = await fetch(`${BASE}${ep.path}`, { method: ep.method, redirect: 'manual' });
      const elapsed = Date.now() - start;
      
      let detail = '';
      if (!ep.page) {
        try {
          const text = await res.text();
          const json = JSON.parse(text);
          if (json.error) detail = 'ERR:' + json.error.substring(0, 50);
          else detail = 'keys:' + Object.keys(json).join(',');
        } catch { detail = 'non-json'; }
      } else {
        detail = 'html-len:' + (await res.text()).length;
      }
      
      results.push([res.status, elapsed, ep.label, detail, ep.path]);
    } catch (err) {
      results.push(['FAIL', 0, ep.label, err.message.substring(0, 50), ep.path]);
    }
  }
  
  // Print results
  console.log('STATUS | MS   | LABEL                        | DETAIL');
  console.log('-------|------|------------------------------|-------');
  results.forEach(([status, ms, label, detail, path]) => {
    console.log(`${String(status).padEnd(6)} | ${String(ms).padStart(4)} | ${label.padEnd(28)} | ${detail}`);
  });
  
  // Summary
  const ok = results.filter(r => r[0] >= 200 && r[0] < 400);
  const auth = results.filter(r => r[0] === 401);
  const forbidden = results.filter(r => r[0] === 403);
  const serverErr = results.filter(r => r[0] >= 500);
  const clientErr = results.filter(r => r[0] >= 400 && r[0] < 500 && r[0] !== 401 && r[0] !== 403);
  const fail = results.filter(r => r[0] === 'FAIL');
  
  console.log('\n=== SUMMARY ===');
  console.log(`OK(2xx/3xx): ${ok.length}`);
  console.log(`Auth needed(401): ${auth.length}`);
  console.log(`Forbidden(403): ${forbidden.length}`);
  console.log(`Server Error(5xx): ${serverErr.length}`);
  if (serverErr.length) serverErr.forEach(r => console.log(`  5xx: ${r[2]} ${r[4]} -> ${r[3]}`));
  console.log(`Client Error(4xx): ${clientErr.length}`);
  if (clientErr.length) clientErr.forEach(r => console.log(`  4xx: [${r[0]}] ${r[2]} ${r[4]} -> ${r[3]}`));
  console.log(`Connection Fail: ${fail.length}`);
  if (fail.length) fail.forEach(r => console.log(`  FAIL: ${r[2]} -> ${r[3]}`));
})();
