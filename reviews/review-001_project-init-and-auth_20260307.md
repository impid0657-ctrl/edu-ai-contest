# Review Report 001 — Project Initialization, Layout & Authentication

## 1. Overview

| Field | Value |
|-------|-------|
| Review ID | REV-001 |
| Target Task | WO-001 (task-001_project-init-and-auth_v1.0.md) |
| Date | 2026-03-07 |
| Reviewer | Claude (PM/Architect — acting as QA) |

---

## 2. Evaluation

### 2.1 Score: 52/100

| Category | Weight | Score | Notes |
|----------|--------|-------|-------|
| Functionality | 30 | 18/30 | Auth flow works, but routing/layout broken for non-public pages |
| Code Quality | 25 | 10/25 | Massive inline style violations, no site template applied |
| Performance | 15 | 12/15 | Build succeeds, no obvious perf issues |
| Security | 15 | 7/15 | Admin role check missing in middleware, upsert overwrites role |
| Documentation | 15 | 5/15 | Migration OK, but no README update, no completion report |

### 2.2 Approval: ❌ Rejected

Reason: 3 Critical issues + 3 Major issues. Must fix before Sprint 2.

---

## 3. Issues Found

### 🔴 CRITICAL Issues

**BUG-001: Site template design completely ignored**
- Severity: Critical
- Location: `src/app/(public)/page.jsx`, `src/app/(public)/layout.jsx`, `src/app/(public)/login/page.jsx`
- Description: task-001 Section 4.6 explicitly states "Convert the site template's index.html design into a Next.js page" and "Adapt styling from the site template (references/site_templates/template_1/main-files/index.html)." Zero visual elements from the site template were used. Hero section uses a generic purple gradient (`#667eea → #764ba2`) with no connection to the Evalo template. Header/footer are plain Bootstrap navbar/footer with no template styling.
- Impact: The entire public-facing site looks like a generic Bootstrap page, not the premium template design the PM purchased.
- Spec reference: task-001 §4.6, §4.6 Layout, project-bible §12.1 (Template-First Principle)
- Fix: Extract CSS/layout patterns from `references/site_templates/template_1/main-files/` and rebuild (public) pages using those design tokens, color scheme, and component patterns.

**BUG-002: Inline styles used extensively — ai-agent-rules violation**
- Severity: Critical
- Location: Multiple files
- Description: `ai-agent-rules.md` Section 3 CSS rules explicitly state "인라인 스타일 금지 (style="..." 직접 사용 금지)". JSX `style={{}}` is the React equivalent of inline styles and is equally banned.
- Affected files and line counts:
  - `src/app/(public)/page.jsx` — 8 instances (`style={{ background: "linear-gradient..." }}`, `style={{ width: "300px"... }}`, `style={{ zIndex: 2... }}`, `style={{ letterSpacing... }}`, `style={{ backdropFilter... }}`, `style={{ maxWidth: "600px" }}`, `style={{ background: cat.id === ... }}`)
  - `src/app/(public)/login/page.jsx` — 5 instances (`style={{ minHeight... }}`, `style={{ minHeight: "60vh" }}`, `style={{ backgroundColor: "#FEE500"... }}`, `style={{ backgroundColor: "#03C75A"... }}`, `style={{ verticalAlign... }}`)
  - `src/app/(public)/layout.jsx` — 1 instance (`style={{ paddingTop: "80px" }}`)
  - `src/app/(public)/contest-info/page.jsx` — 1 instance (`style={{ maxWidth: "600px", height: "300px" }}`)
- Fix: Move ALL inline styles to CSS classes. Use CSS variables for colors, gradients, and spacing. Create a dedicated CSS file (e.g., `public-site.css`) with namespaced classes (`public-hero`, `public-hero__gradient`, etc.).

**BUG-003: Non-public page URLs show WowDash admin layout or broken 404**
- Severity: Critical
- Location: `src/app/not-found.jsx`, missing placeholder pages in `(public)/`
- Description: The hero CTA buttons link to `/license-apply` and `/submit`. The nav links to `/board`. None of these pages exist in the `(public)` route group. When a user clicks these links:
  - If a WowDash flat route matches (unlikely for these paths), the admin dashboard layout appears with sidebar.
  - If no route matches, `not-found.jsx` renders — which wraps content in `<MasterLayout>`, showing the WowDash admin sidebar + navbar to a public user.
- Impact: Regular users see the admin dashboard chrome when navigating to any unimplemented page. This is a UX disaster and a security concern (exposes admin UI structure).
- Fix: Create placeholder pages inside `(public)/` route group for ALL nav items: `license-apply/page.jsx`, `submit/page.jsx`, `board/page.jsx`, `mypage/page.jsx`. Also create a `(public)/not-found.jsx` or fix the root `not-found.jsx` to NOT use MasterLayout for public routes.

---

### 🟠 MAJOR Issues

**BUG-004: Middleware admin role check not implemented**
- Severity: Major
- Location: `middleware.js` lines 25-30
- Description: The middleware has a comment block saying "The actual role check is done server-side; middleware ensures session exists" but there is NO server-side role check implemented anywhere. The `/admin/*` routes are only protected by session existence — any logged-in user can access admin pages. task-001 §6.3 Fail Condition #4: "middleware.js does not protect /admin/* routes."
- Current code:
  ```
  // Check admin role — fetch from public.users table
  // Since middleware cannot easily query DB, we check user metadata
  // For now, check app_metadata.role or user_metadata.role
  // The actual role check is done server-side; middleware ensures session exists
  ```
- Impact: Any authenticated user can access `/admin/*` routes.
- Fix: Query `public.users` table via the Supabase middleware client to check `role === 'admin'`. The middleware already has access to a Supabase client via `updateSession()` which returns `{ supabase, user, supabaseResponse }` — use that `supabase` client to query `users` table. If not admin, redirect to `/access-denied`.

**BUG-005: OAuth callback upsert overwrites admin role**
- Severity: Major
- Location: `src/app/(auth)/callback/route.js` lines 35-44
- Description: The upsert always sets `role: "user"`. If an admin user logs in again, their role gets overwritten to `user`. The `onConflict: "id"` + `ignoreDuplicates: false` means it WILL update existing rows.
- Code:
  ```js
  await supabase.from("users").upsert({
    id: user.id,
    ...
    role: "user",  // ← This overwrites admin role!
  }, { onConflict: "id", ignoreDuplicates: false });
  ```
- Fix: Remove `role` from the upsert payload entirely. Role should only be set manually by PM/admin via SQL. Or use a conditional: only set role on INSERT, not on UPDATE. Best approach: use separate INSERT (with ON CONFLICT DO UPDATE) that excludes role from the UPDATE SET clause.

**BUG-006: No placeholder pages for nav items in (public) route group**
- Severity: Major
- Location: Missing files
- Description: `PUBLIC_NAV_ITEMS` in constants.js defines paths `/license-apply`, `/submit`, `/board`. The public layout renders links to these. None exist inside `(public)/`. Only `contest-info/page.jsx` has a placeholder. This means clicking any nav link except "홈" and "공모요강" breaks the user experience.
- Fix: Create `(public)/license-apply/page.jsx`, `(public)/submit/page.jsx`, `(public)/board/page.jsx` with placeholder "Coming Soon" content (similar to contest-info).

---

### 🟡 MINOR Issues

**BUG-007: Footer uses `new Date().getFullYear()` without KST context**
- Severity: Minor
- Location: `src/app/(public)/layout.jsx` footer section
- Description: `new Date().getFullYear()` is used in the copyright line. While not a deadline comparison (so not a Fail Condition violation), it's inconsistent with the KST-only date policy in doc 12.7. On Vercel (UTC), this would show the wrong year for a few hours around midnight KST.
- Fix: Import `nowKST` from dateUtils and use `format(nowKST(), 'yyyy')` instead.

**BUG-008: `public-main` padding-top is inline style**
- Severity: Minor (subset of BUG-002 but architecturally important)
- Location: `src/app/(public)/layout.jsx` — `<main style={{ paddingTop: "80px" }}>`
- Description: The fixed navbar offset is hardcoded as inline style. If navbar height changes, this breaks.
- Fix: Use a CSS class with a CSS variable: `--header-height: 80px; padding-top: var(--header-height);`

**BUG-009: Missing completion report from developer**
- Severity: Minor
- Location: N/A
- Description: ai-agent-rules §5 requires a completion report in the format: `✅ 완료: ... / 수정 파일: ... / 확인 사항: ... / 잔존 이슈: ...`. No completion report was provided.
- Fix: Require Antigravity to provide completion report with every delivery.

---

### ℹ️ TRIVIAL Issues

**BUG-010: WowDash demo pages still accessible at flat routes**
- Severity: Trivial
- Location: `src/app/` — ~80+ WowDash demo page directories (wallet, marketplace, crypto, etc.)
- Description: All WowDash demo pages are still accessible (e.g., `/wallet`, `/marketplace`, `/invoice-list`). While not harmful since they'll be replaced in future sprints, it's messy.
- Fix: No action needed now. Will be cleaned up when admin routes are reorganized under `/admin/` in Sprint 2.

**BUG-011: `style copy.css` file with space in name**
- Severity: Trivial
- Location: `public/assets/css/style copy.css`
- Description: File name contains a space. Violates ai-agent-rules §3 file naming ("파일명은 영어, 소문자, 하이픈 구분"). Likely a leftover from template copy.
- Fix: Delete if unused, or rename to `style-copy.css`.

---

## 4. Positive Aspects

1. **Supabase client architecture is correct**: Three-client pattern (browser/server/middleware) follows Supabase SSR best practices exactly.
2. **dateUtils.js is well-implemented**: All 4 required functions present, `KST_TIMEZONE` constant correct, proper use of `date-fns-tz`.
3. **OAuth callback error handling is robust**: Try-catch wrapping, fallback to login with error param, non-blocking upsert failure.
4. **DB migration includes RLS + triggers**: Proper policies for read-own, update-own, admin-read-all, and service insert. `updated_at` trigger included.
5. **Constants file is well-structured**: All doc 11 copy centralized, no magic strings in components.
6. **Build succeeds**: `npm run build` passes (per handoff doc).

---

## 5. Acceptance Criteria Verification

### 5.1 Functional Criteria

| # | Criterion | Result | Notes |
|---|-----------|--------|-------|
| F1 | `npm run dev` starts without errors | ✅ PASS | Confirmed in handoff |
| F2 | Homepage renders with Hero section | ⚠️ PARTIAL | Renders but without site template design |
| F3 | Hero section displays exact Korean copy from doc 11 | ✅ PASS | All text matches |
| F4 | Kakao OAuth button redirects correctly | ✅ PASS | signInWithOAuth({ provider: 'kakao' }) |
| F5 | Naver OAuth button redirects correctly | ✅ PASS | signInWithOAuth({ provider: 'naver' }) |
| F6 | After OAuth callback, user row in public.users | ✅ PASS | Upsert in callback/route.js |
| F7 | `/api/auth/me` returns user data when auth'd | ✅ PASS | Correct implementation |
| F8 | `/api/auth/me` returns 401 when not auth'd | ✅ PASS | Correct implementation |
| F9 | `/admin` routes redirect to login when unauth'd | ⚠️ PARTIAL | Redirects on no session, but no role check |
| F10 | WowDash admin dashboard renders when auth'd as admin | ❌ FAIL | No role check, any user can access |

### 5.2 Code Quality Criteria

| # | Criterion | Result | Verification |
|---|-----------|--------|-------------|
| Q1 | No NEXT_PUBLIC_ prefix on service role key | ✅ PASS | Not found in code |
| Q2 | No raw new Date() for deadline comparison | ✅ PASS | Only in dateUtils.js and footer (non-deadline) |
| Q3 | .env.local in .gitignore | ✅ PASS | `.env*.local` pattern present |
| Q4 | date-fns-tz in dependencies | ✅ PASS | `"date-fns-tz": "^3.2.0"` |
| Q5 | @supabase/ssr in dependencies | ✅ PASS | `"@supabase/ssr": "^0.9.0"` |
| Q6 | KST_TIMEZONE = 'Asia/Seoul' | ✅ PASS | In dateUtils.js |
| Q7 | Middleware logs KST time | ✅ PASS | `formatKST` import + usage confirmed |
| Q8 | No WowDash template folders renamed | ✅ PASS | Original structure preserved |

### 5.3 Fail Condition Check

| # | Condition | Result |
|---|-----------|--------|
| FC1 | SERVICE_ROLE_KEY exposed with NEXT_PUBLIC_ | ✅ PASS — not found |
| FC2 | WowDash template folder structure altered | ✅ PASS — preserved |
| FC3 | date-fns-tz not installed or dateUtils.js missing | ✅ PASS — both present |
| FC4 | middleware.js does not protect /admin/* routes | ❌ FAIL — role check missing (BUG-004) |
| FC5 | Homepage copy does not match doc 11 | ✅ PASS — matches |
| FC6 | npm run build fails | ✅ PASS — succeeds |

**Fail Condition FC4 triggered → automatic FAIL.**

---

## 6. Issue Summary

| Severity | Count | IDs |
|----------|-------|-----|
| 🔴 Critical | 3 | BUG-001, BUG-002, BUG-003 |
| 🟠 Major | 3 | BUG-004, BUG-005, BUG-006 |
| 🟡 Minor | 3 | BUG-007, BUG-008, BUG-009 |
| ℹ️ Trivial | 2 | BUG-010, BUG-011 |

---

## 7. Next Steps

1. **PM (Claude)**: Write `fix-001_sprint1-review-fixes.md` addressing all Critical + Major issues (BUG-001 through BUG-006).
2. **Antigravity**: Execute fix spec.
3. **Re-review**: After fixes, verify all 6 Critical/Major bugs resolved.
4. Minor issues (BUG-007~009) can be bundled into fix spec or deferred to Sprint 2.
5. Trivial issues (BUG-010~011) can be addressed opportunistically.

---

*Reviewer: Claude (PM/Architect) | Date: 2026-03-07*
