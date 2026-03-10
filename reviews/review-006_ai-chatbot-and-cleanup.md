# Review Report 006 — AI Chatbot (RAG) + Dead Code Cleanup

## 1. Overview

| Field | Value |
|-------|-------|
| Review ID | REV-006 |
| Target Task | WO-006 (task-006_ai-chatbot-and-cleanup_v1.0.md) |
| Reviewer | Claude (PM/Architect) |

---

## 2. Evaluation

### 2.1 Score: 82/100

| Category | Weight | Score | Notes |
|----------|--------|-------|-------|
| Functionality | 30 | 24/30 | RAG pipeline complete but vector search won't work without RPC function |
| Code Quality | 25 | 23/25 | Zero inline styles, clean modular chatbot.js, good streaming pattern |
| Performance | 15 | 12/15 | Settings caching good (5min TTL), but fallback silently degrades RAG quality |
| Security | 15 | 14/15 | Admin auth on all settings/logs APIs, no API key exposure |
| Documentation | 15 | 9/15 | Migrations clean, but missing RPC function is undocumented |

### 2.2 Approval: ⚠️ Conditional Approval — 1 issue must be fixed before S6

---

## 3. Issues Found

### 🔴 CRITICAL

**BUG-026: Missing `match_contest_documents` PostgreSQL RPC function — vector search broken**
- Location: `src/lib/chatbot.js` line `searchDocuments()` calls `adminClient.rpc("match_contest_documents", ...)`
- Migration `006_chatbot.sql` does NOT create this function
- Impact: Every RAG query will error → fallback returns ALL 10 docs without similarity ranking → chatbot still "works" but answers are less relevant because it feeds all documents as context instead of the most similar ones
- Fix: Add to migration 006 (or create 006b):

```sql
CREATE OR REPLACE FUNCTION match_contest_documents(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (id UUID, title TEXT, content TEXT, similarity FLOAT)
LANGUAGE sql STABLE
AS $$
  SELECT
    cd.id,
    cd.title,
    cd.content,
    1 - (cd.embedding <=> query_embedding) AS similarity
  FROM public.contest_documents cd
  WHERE cd.embedding IS NOT NULL
    AND 1 - (cd.embedding <=> query_embedding) > match_threshold
  ORDER BY cd.embedding <=> query_embedding
  LIMIT match_count;
$$;
```

Without this, the chatbot degrades to "dump all docs into prompt" mode — it works but it's wasteful on tokens and gives lower quality answers.

### 🟡 MINOR

**BUG-027: `cursor-pointer` CSS class used in logs page but not defined**
- Location: `src/app/admin/chatbot/logs/page.jsx` — `className="cursor-pointer"`
- Bootstrap 5 does not include `cursor-pointer` utility. Needs to be in custom CSS or replaced with `role="button"`.
- Impact: Rows don't show pointer cursor on hover. Functional click still works.
- Fix: Add `.cursor-pointer { cursor: pointer; }` to admin CSS, or use `role="button"` attribute.

**BUG-028: Embedding script uses ES module imports but needs package.json type:module or .mjs extension**
- Location: `src/scripts/generate-embeddings.js` uses `import` syntax
- If `package.json` doesn't have `"type": "module"`, running `node src/scripts/generate-embeddings.js` will fail with SyntaxError
- Fix: Either rename to `.mjs`, or verify package.json has `"type": "module"`, or rewrite with `require()`.

---

## 4. User/Admin Perspective Review

**Visitor using chatbot**:
- ✅ Floating button visible bottom-right on all public pages
- ✅ Click → chat panel with welcome message
- ✅ Ask contest question → streaming response (with degraded RAG until BUG-026 fixed)
- ✅ Ask off-topic → "해당 주제는 답변할 수 없습니다" rejection
- ✅ Panel has close button, keyboard enter to send, loading indicator

**Admin managing chatbot**:
- ✅ /admin/chatbot → settings form (provider, model, prompt, topics, limits, active toggle)
- ✅ Save settings → cache invalidated → next chat uses new settings
- ✅ /admin/chatbot/logs → paginated log table with blocked filter, expandable rows
- ✅ AdminSidebar has chatbot section

**What I'd want if I were actually operating this site**:
- The chatbot needs to give RELEVANT answers, not just dump all docs. BUG-026 fix is critical for answer quality.
- The admin should be able to test the chatbot from the settings page (send a test query) — nice-to-have for a future sprint.
- Token cost tracking per day/month would help budget — logs capture `tokens_used` which is good, but no aggregation view yet.

---

## 5. Dead Code Cleanup — All Done Correctly

| Item | Status |
|------|--------|
| `/mypage` deleted | ✅ Verified — 404 on /mypage |
| `storage.js` deleted | ✅ Verified — file not found |
| `guest/login` dead code removed | ✅ Verified — no `password_hash` null check, no "로그인" text |
| `submission/[id]` member auth removed | ✅ Verified — JWT-only, no Supabase auth fallback |

---

## 6. Acceptance Criteria

| # | Criterion | Result |
|---|-----------|--------|
| F1 | Floating chat button on all public pages | ✅ PASS |
| F2 | Click → chat panel opens | ✅ PASS |
| F3 | Contest question → relevant answer | ⚠️ PARTIAL — works but degraded without RPC function |
| F4 | Off-topic → rejection | ✅ PASS |
| F5 | Admin settings page | ✅ PASS |
| F6 | Admin save settings | ✅ PASS |
| F7 | Admin logs page | ✅ PASS |
| F8 | Blocked queries flagged | ✅ PASS |
| F9 | /mypage → 404 | ✅ PASS |
| F10 | No "로그인" in public UI | ✅ PASS |
| F11 | Build succeeds | ✅ PASS |

---

## 7. Required Fix Before S6

**BUG-026 must be fixed.** Options:
- A) Antigravity creates `006b_match_function.sql` migration with the RPC function
- B) Include it in the Sprint 6 migration

Recommendation: Fix now (Option A). It's a single SQL function — 5 minutes of work. The chatbot is functional but degraded without it.

---

*Reviewer: Claude (PM/Architect)*
