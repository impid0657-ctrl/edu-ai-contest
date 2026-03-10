# Review Report 004 — Contest Info + Submission Lookup/Edit

## 1. Overview

| Field | Value |
|-------|-------|
| Review ID | REV-004 |
| Target Task | WO-004 (task-004_contest-info-and-lookup_v1.0.md) |
| Reviewer | Claude (PM/Architect) |

---

## 2. Evaluation

### 2.1 Score: 85/100

| Category | Weight | Score | Notes |
|----------|--------|-------|-------|
| Functionality | 30 | 27/30 | All spec'd features work, but UX flow issue found (see below) |
| Code Quality | 25 | 23/25 | Zero inline styles, formatKST used, clean |
| Performance | 15 | 13/15 | No unnecessary API calls, static contest-info |
| Security | 15 | 12/15 | Guest token in URL query param is a concern |
| Documentation | 15 | 10/15 | Migration + seed data complete |

### 2.2 Approval: ⚠️ Conditional Approval

No Critical/Major issues from the SPEC. But reviewing as "does this site actually work for a real person", I found issues that weren't in the spec — because the spec itself missed them. These are not Antigravity's fault; they're PM/Architect (my) oversights from earlier sprints.

---

## 3. Issues Found

### 🟠 MAJOR (Missed by spec — my fault as architect)

**BUG-017: OAuth redirect goes to homepage, not back to the page user came from**
- Severity: Major (UX breakage)
- Location: `src/app/(public)/license-apply/page.jsx` → `/login` → OAuth → callback → `/`
- Description: A participant clicks "AI 이용권 신청하기" → sees "로그인이 필요합니다" → clicks "로그인하기" → completes Kakao OAuth → lands on homepage (/). They have to re-navigate to /license-apply. The callback handler (`src/app/(auth)/callback/route.js`) already supports `?next=` parameter, but the login page and the license-apply page don't pass it.
- Impact: Every license applicant loses their context after identity verification.
- Fix: When /license-apply redirects to /login, pass redirect URL: `/login?redirect=/license-apply`. Login page reads this param and passes it to OAuth: `redirectTo: ${SITE_URL}/callback?next=${redirect}`. Callback already handles `?next=`.

**BUG-018: "로그인" terminology throughout the site — wrong framing for a contest portal**
- Severity: Major (identity mismatch)
- Location: `/login/page.jsx`, `(public)/layout.jsx` nav, `/license-apply/page.jsx`
- Description: This site is a contest submission portal, not a member service. But the word "로그인" appears everywhere: nav header, login page title "로그인", "소셜 계정으로 간편하게 시작하세요", license page "로그인이 필요합니다". The PM explicitly said auth is "본인 확인" (identity verification), not "login". Using "로그인" creates a false expectation of account-based membership.
- Fix options (need PM decision):
  - A) Rename to "본인 인증" throughout — header nav "본인 인증", page title "본인 인증", button "카카오로 본인 인증하기"
  - B) Keep "로그인" on the page but change the nav link to "인증/신청" and adjust copy on the license-apply page
  - C) Remove /login from nav entirely — auth only triggered contextually from /license-apply and /submit pages
- My recommendation: Option C. There's no reason for a "login" page to exist in the nav. Auth should only happen when a user tries to do something that requires verification (applying for license, submitting as member).

### 🟡 MINOR

**BUG-019: Guest JWT token exposed in URL query parameter**
- Location: `/submit/edit/[id]?token=xxxx`
- Description: The edit page passes the guest JWT as a URL query param. This means the token is visible in browser history, URL bar, potentially in referrer headers if user clicks an external link, and in server access logs.
- Impact: Low for a contest portal (token expires in 2h), but not ideal.
- Fix: Store token in sessionStorage after lookup succeeds, read from sessionStorage on the edit page. Don't pass in URL.

**BUG-020: License status lookup shows "심사 중" for pending status**
- Location: `src/app/(public)/license-apply/status/page.jsx` — STATUS_LABELS
- Description: `pending` is labeled "심사 중" but the actual meaning is "관리자 승인 대기 중". "심사 중" implies the application is being actively reviewed, which is misleading. The license-apply page itself uses "대기 중" for pending.
- Fix: Change STATUS_LABELS.pending to "대기 중" (consistent with license-apply page).

---

## 4. Positive Aspects

1. **공모요강 page is excellent** — All doc 11 content present, well-structured with cards, responsive. CTA buttons correctly link to /license-apply and /submit.
2. **Submission lookup/edit flow works end-to-end** — Guest: submission_no + email + password → view → edit. Member: submission_no + email → view → edit.
3. **Deadline enforcement solid** — Edit API checks `isDeadlinePassed()`, edit page shows "마감" message.
4. **License status lookup correctly minimal** — Only returns status/category/date, no sensitive info.
5. **Cross-linking done** — Submit page has "접수 내역 조회/수정" link, license-apply has "신청 현황 조회" link, success screens have lookup links.
6. **Seed data matches doc 11.4 exactly** — 3 notices + 5 FAQ.
7. **formatKST used consistently** — No `toLocaleDateString()` anywhere new.

---

## 5. Self-Critique (Spec Issues — My Fault)

BUG-017 and BUG-018 are not Antigravity's mistakes. They were NOT in any task spec. They're architectural oversights from Sprint 1 that I should have caught:

- I wrote the login page in task-001 using "로그인" language without questioning whether that's the right framing for a contest portal.
- I never specified redirect-back behavior for OAuth flow.
- The PM had to correct me that this isn't a member service. I should have understood that from doc 07 from the start.

These need to be fixed in the next sprint.

---

## 6. Acceptance Criteria: All PASS (per spec)

| # | Criterion | Result |
|---|-----------|--------|
| F1-F12 | All functional criteria | ✅ PASS |
| CQ1-CQ5 | All code quality checks | ✅ PASS |
| FC1-FC6 | All fail conditions | ✅ PASS |

---

*Reviewer: Claude (PM/Architect)*
