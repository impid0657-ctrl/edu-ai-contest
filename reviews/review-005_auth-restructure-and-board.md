# Review Report 005 — Auth Restructure + Submit Simplify + Board

## 1. Overview

| Field | Value |
|-------|-------|
| Review ID | REV-005 |
| Target Task | WO-005 (task-005_auth-restructure-and-board_v1.0.md) |
| Reviewer | Claude (PM/Architect) |

---

## 2. Evaluation

### 2.1 Score: 87/100

| Category | Weight | Score | Notes |
|----------|--------|-------|-------|
| Functionality | 30 | 28/30 | All restructure done correctly, board works, minor leftovers |
| Code Quality | 25 | 22/25 | Zero inline styles, clean single-flow, minor dead code |
| Performance | 15 | 13/15 | No unnecessary API calls removed from submit page |
| Security | 15 | 14/15 | bcrypt 12 on all submissions, JWT for all uploads |
| Documentation | 15 | 10/15 | Migrations clean |

### 2.2 Approval: ⚠️ Conditional Approval

Functional restructure is correct. The site now actually matches its identity as a contest portal. But there are leftover artifacts from the old member-based architecture that need cleanup, and the Evalo design is still not applied (Antigravity noted this and PM is aware).

---

## 3. Issues Found — User/Admin Perspective Review

### 🟠 MAJOR

**BUG-021: /mypage placeholder page still exists — shouldn't exist at all**
- Location: `src/app/(public)/mypage/page.jsx`
- Description: This site has no "마이페이지" concept. PM explicitly said so. This page is a leftover from when we thought this was a member service. It's still accessible at `/mypage` and probably shows "준비 중" — which is confusing for a user who somehow navigates there.
- Fix: Delete `src/app/(public)/mypage/page.jsx` entirely.

**BUG-022: Evalo template design still not applied to any page**
- Description: Antigravity flagged this and PM is furious. All public pages (homepage, contest-info, license-apply, submit, board, lookup, edit) still use Bootstrap defaults, not the Evalo template design. The design guide (`specs/evalo-design-guide.md`) exists but hasn't been implemented yet.
- Impact: The site looks generic and cheap — not like the premium template that PM purchased.
- Fix: Dedicated design sprint needed. Every public page needs CSS overhaul to match Evalo tokens.

### 🟡 MINOR

**BUG-023: "로그인" text in /api/guest/login error response**
- Location: `src/app/api/guest/login/route.js` line ~42
- Description: Returns `"회원 제출 작품입니다. 로그인하여 확인해주세요."` for submissions with no password_hash. Since all submissions now have password_hash (no member submissions anymore), this is dead code. But it still contains "로그인" which violates the rule.
- Fix: Remove the `if (!submission.password_hash)` check entirely. All submissions now have passwords. If somehow triggered, return a generic error without "로그인".

**BUG-024: /api/submission/[id] still has member auth path — dead code**
- Location: `src/app/api/submission/[id]/route.js`
- Description: Both GET and PATCH check for guest JWT first, then fall back to Supabase auth (member path). Since all submissions now have user_id=NULL and passwords, the member auth path is never used. It's dead code that adds confusion.
- Fix: Remove the member auth fallback. All submissions use JWT for access.

**BUG-025: callback route.js still upserts into users table**
- Location: `src/app/(auth)/callback/route.js`
- Description: The OAuth callback still creates/updates a row in `public.users` table. This was designed for the member system. For license applications, we only need the auth metadata (name, email, phone) — the users table row is used by the license API to check auth. So it's still needed for license apply. Not dead code, but should be documented that it's ONLY for license application flow.
- Fix: No code change needed, but add a comment explaining this is for license-apply auth flow only.

---

## 4. Positive Aspects — What's RIGHT Now (User Perspective)

**As a participant visiting this site, I can now:**
1. ✅ See the homepage with contest overview → click "공모요강" → read full contest details
2. ✅ Click "AI 이용권 신청" → see "본인 인증이 필요합니다" → do Kakao/Naver auth right there → fill form → submit
3. ✅ After OAuth → land back on /license-apply (not homepage!) → BUG-017 fixed
4. ✅ Click "작품 접수" → fill in my name, email, phone, password, upload files → get submission number
5. ✅ See "접수번호를 반드시 저장해주세요" prominently
6. ✅ Click "접수 내역 조회" → enter submission_no + email + password → see my entry → edit before deadline
7. ✅ Check license status by email (no auth needed)
8. ✅ Read 공지사항, browse FAQ, write QnA question
9. ✅ No "로그인" confusion anywhere in the nav or main UI

**This is the first sprint where the site actually functions end-to-end as a contest portal.**

---

## 5. Acceptance Criteria

### Spec Criteria: All PASS

| # | Criterion | Result |
|---|-----------|--------|
| F1 | /login 404 | ✅ PASS — page deleted |
| F2 | No "로그인" in header | ✅ PASS |
| F3 | Inline OAuth on /license-apply | ✅ PASS |
| F4 | OAuth returns to /license-apply | ✅ PASS (redirectTo includes ?next=/license-apply) |
| F5 | Single submit form | ✅ PASS — no auth check, no dual mode |
| F6 | Everyone enters name+email+password | ✅ PASS — contact_name field added |
| F7 | Submit works without auth | ✅ PASS — /api/submit has no auth check |
| F8 | All uploads through API proxy | ✅ PASS — no Supabase Storage client calls in submit page |
| F9 | Board tabs work | ✅ PASS |
| F10 | 3 notices visible | ✅ PASS (seed data from migration 004) |
| F11 | 5 FAQ visible | ✅ PASS |
| F12 | QnA write works | ✅ PASS |
| F13 | Admin board page | ✅ PASS |
| F14 | No "로그인" in public UI | ⚠️ PARTIAL — API error message still has it (BUG-023) |
| F15 | Build succeeds | ✅ PASS |

---

## 6. Next Steps

Two tracks needed:

**Track A: Cleanup (small fix spec)**
- Delete /mypage
- Clean dead code (BUG-023, BUG-024)
- Can bundle into Sprint 5

**Track B: Design Overhaul (critical — PM priority)**
- Apply Evalo template design to ALL public pages
- This is the #1 PM complaint right now
- Needs a dedicated design sprint or be included as primary objective of Sprint 5

**Recommendation**: Sprint 5 should be the design sprint. Apply Evalo to every public page. Bundle cleanup fixes. Then Sprint 6 for AI chatbot, Sprint 7 for remaining features.

---

*Reviewer: Claude (PM/Architect)*
