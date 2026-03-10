# Review Report 002 — License Apply + Admin Dashboard

## 1. Overview

| Field | Value |
|-------|-------|
| Review ID | REV-002 |
| Target Task | WO-002 (task-002_license-apply-and-admin_v1.0.md) |
| Reviewer | Claude (PM/Architect) |

---

## 2. Evaluation

### 2.1 Score: 82/100

| Category | Weight | Score | Notes |
|----------|--------|-------|-------|
| Functionality | 30 | 27/30 | All core features work, progress bar cosmetic issue |
| Code Quality | 25 | 20/25 | Zero inline styles, but KST date policy violations |
| Performance | 15 | 13/15 | Pagination implemented, count queries efficient |
| Security | 15 | 14/15 | Auth + admin check in all admin APIs, RLS proper |
| Documentation | 15 | 8/15 | Migration good, but no completion report in §5 format |

### 2.2 Approval: ⚠️ Conditional Approval

Zero Critical issues. 2 Minor issues can be bundled into Sprint 3. Sprint 2 deliverables are functionally complete.

---

## 3. Issues Found

### 🟡 MINOR Issues

**BUG-012: KST date policy violation in admin license table**
- Severity: Minor
- Location: `src/app/admin/license/page.jsx` — `new Date(created_at).toLocaleDateString("ko-KR")`
- Description: Client-side date formatting without `dateUtils.js`. Doc 12.7 requires all date operations use KST helpers. On a client in Korea this works by coincidence (browser uses local TZ), but it's inconsistent with the project's date policy.
- Fix: Import `formatKST` from `@/lib/dateUtils` and use `formatKST(app.created_at, "yyyy-MM-dd")`.

**BUG-013: Raw `new Date()` in bulk-action API**
- Severity: Minor
- Location: `src/app/api/admin/license/bulk-action/route.js` — `const now = new Date().toISOString();`
- Description: Uses raw `new Date()` for `reviewed_at` timestamp. While TIMESTAMPTZ handles UTC correctly, this violates the blanket policy from doc 12.7. Should use `dateUtils` for consistency.
- Fix: Import `nowKST` or use `new Date().toISOString()` is acceptable for server-side UTC storage. Add a comment noting this is intentional UTC for DB storage.

**BUG-014: Admin dashboard progress bar has no visible width**
- Severity: Minor
- Location: `src/app/admin/page.jsx` — progress bar `<div>` has `aria-valuenow` but no width
- Description: Bootstrap progress bars require explicit width styling to render visually. The progress bar div has no `className` for width (e.g., `w-50`) and inline style is banned. Currently renders as an empty bar.
- Fix: Use Bootstrap's `w-XX` utility class dynamically, or calculate a CSS custom property via a wrapper class. Example: add a `<div>` with computed `className={`progress-bar bg-success w-${Math.round(counts.approved / 5)}`}`.

---

## 4. Positive Aspects

1. **Zero inline styles** — Complete compliance with ai-agent-rules §3. Major improvement from Sprint 1.
2. **Security architecture solid** — All 3 admin API routes verify both auth AND admin role. Can't bypass.
3. **500-seat cap logic correct** — `currentApproved + ids.length > 500` check with clear error message showing numbers.
4. **CSV implementation excellent** — BOM for Korean Excel, proper value escaping, approved-only filter.
5. **AdminSidebar created separately** — Original MasterLayout untouched (doc 12.1 compliance).
6. **Duplicate application prevention** — Both at API level (query check) and DB level (unique partial index).
7. **Form UX well designed** — Conditional fields for school/grade, auto-fill phone, char counter for motivation, loading/error states all handled.
8. **Pagination implemented** — Server-side with count, client-side navigation.
9. **Migration complete** — RLS policies, indexes, partial unique index for duplicate prevention, updated_at trigger.

---

## 5. Acceptance Criteria Verification

### 5.1 Functional

| # | Criterion | Result |
|---|-----------|--------|
| F1 | License form renders for logged-in user | ✅ PASS |
| F2 | Form shows login prompt when unauthenticated | ✅ PASS |
| F3 | Form submit creates row with status='pending' | ✅ PASS |
| F4 | Duplicate application returns 409 | ✅ PASS |
| F5 | /api/license/my-application returns data | ✅ PASS |
| F6 | Admin dashboard shows counts | ✅ PASS |
| F7 | Admin license page shows table with filters | ✅ PASS |
| F8 | Bulk approve works | ✅ PASS |
| F9 | Bulk approve blocked at 500 cap | ✅ PASS |
| F10 | Bulk reject works | ✅ PASS |
| F11 | CSV exports approved-only | ✅ PASS |
| F12 | Non-admin redirected from /admin | ✅ PASS (middleware from Sprint 1) |

### 5.2 Code Quality

| # | Check | Result |
|---|-------|--------|
| CQ1 | Zero inline styles | ✅ PASS |
| CQ2 | Auth in all API routes | ✅ PASS |
| CQ3 | 500-seat cap in bulk-action | ✅ PASS |
| CQ4 | Migration file exists | ✅ PASS |
| CQ5 | Build succeeds | ✅ PASS |

### 5.3 Fail Conditions

| # | Condition | Result |
|---|-----------|--------|
| FC1 | Inline styles in new files | ✅ PASS — none found |
| FC2 | Auto-approve on submit | ✅ PASS — always pending |
| FC3 | No 500-seat cap | ✅ PASS — cap enforced |
| FC4 | CSV includes non-approved | ✅ PASS — approved only |
| FC5 | Build fails | ✅ PASS |
| FC6 | No sync.md report | ✅ PASS — report present |

---

## 6. Issue Summary

| Severity | Count | IDs |
|----------|-------|-----|
| 🔴 Critical | 0 | — |
| 🟠 Major | 0 | — |
| 🟡 Minor | 3 | BUG-012, BUG-013, BUG-014 |

---

## 7. Decision

**Conditional Approval.** Sprint 2 is functionally complete. Minor issues (BUG-012~014) are deferred to Sprint 3 — they do not block progress.

**Next**: Sprint 3 작업지시서 작성 (Submission system: file upload + Supabase Storage).

---

*Reviewer: Claude (PM/Architect)*
