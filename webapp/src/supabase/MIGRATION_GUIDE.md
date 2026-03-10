# Migration Execution Guide

## Execution Order (MUST run in this sequence)

All migrations must be run in Supabase Dashboard → SQL Editor.
Copy-paste each file's contents and execute sequentially.

### Prerequisites
- pgvector extension must be available (Supabase has it by default)
- Run as the `postgres` role (Supabase Dashboard SQL Editor does this)

### Execution Sequence

| Order | File | Creates/Modifies | Depends On |
|-------|------|-------------------|------------|
| 1 | `001_initial_schema.sql` | `users` table, `update_updated_at_column()` trigger function | None |
| 2 | `002_license_applications.sql` | `license_applications` table | 001 (users) |
| 3 | `003_submissions.sql` | `submissions`, `submission_files` tables + Storage bucket instructions | 001 (users, trigger fn) |
| 4 | `004_seed_data.sql` | `posts` table + seed notices/FAQ | 001 (trigger fn) |
| 5 | `005_add_contact_name.sql` | ALTER `submissions` + `contact_name` column | 003 |
| 6 | `006_chatbot.sql` | `contest_documents`, `chatbot_logs`, `chatbot_settings` tables + pgvector | None (standalone) |
| 7 | `006b_match_function.sql` | `match_contest_documents()` RPC function | 006 (contest_documents) |
| 8 | `007_school_otp.sql` | `school_email_verifications`, `student_verifications`, `ai_review_queue` | 001 (users), 003 (submissions) |
| 9 | `008b_board_enhancements.sql` | ALTER `posts` + `is_pinned`, `parent_id` | 004 (posts) |
| 10 | `008c_file_upload_settings.sql` | `file_upload_settings` table | None |
| 11 | `009a_auth_providers_setting.sql` | ALTER `chatbot_settings` + `auth_providers` | 006 (chatbot_settings) |
| 12 | `009b_pages_and_site_settings.sql` | `site_settings`, `pages` tables + seed data | 001 (users) |
| 13 | `010_license_issued_tracking.sql` | ALTER `license_applications` + `license_issued_at` | 002 |
| 14 | `011_site_settings_enhancements.sql` | ALTER `site_settings` + `description`, `updated_by`; seed data | 009b, 001 (users) |
| 15 | `012_tighten_rls_policies.sql` | DROP/CREATE RLS policies (security fix) | All above |
| 16 | `013_menu_management.sql` | ALTER `pages` + `path`, `menu_order`, `is_visible`, `is_public`, `access_warning` + seed menus | 009b |
| 17 | `014_license_auth_method.sql` | ALTER `license_applications` + `auth_method`, `applicant_name`, `applicant_email`, `student_verification_id`; `user_id` nullable | 002, 007 |
| 18 | `015_gemini_switch.sql` | ALTER `contest_documents` VECTOR(1536→768); update RPC; update chatbot_settings default | 006, 006b |
| 19 | `016_review_stages.sql` | ALTER `submissions` + review_stage, pre_screening_result, first_round_result, first_round_score; `review_criteria` table + seed data | 003 |

### SKIP
- `_DEPRECATED_010_site_settings_and_pages.sql` — DO NOT RUN (superseded by 009b + 011)

### Post-Migration Manual Steps

1. **Supabase Storage**: Create bucket `contest-files` (private, 500MB limit)
2. **Storage RLS**: Apply storage policies from comments in `003_submissions.sql`
3. **Auth Providers**: Configure Kakao/Naver OAuth in Supabase Dashboard → Authentication → Providers
4. **Admin User**: Create admin user via Supabase Dashboard → Authentication → Users, then update `public.users` role to 'admin'

### Verification Queries

Run these after all migrations to verify:

```sql
-- Check all tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Expected: 13 tables
-- ai_review_queue, chatbot_logs, chatbot_settings, contest_documents,
-- file_upload_settings, license_applications, pages, posts,
-- school_email_verifications, site_settings, student_verifications,
-- submission_files, submissions, users

-- Check RLS is enabled on all tables
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = true ORDER BY tablename;

-- Check pgvector extension
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Check site_settings seed data
SELECT key, value FROM site_settings ORDER BY key;

-- Check default chatbot settings (should show google/gemini-3-flash)
SELECT provider, model_name, is_active FROM chatbot_settings LIMIT 1;

-- Check menu items (should show 7 menus)
SELECT slug, title, path, is_visible, is_public FROM pages ORDER BY menu_order;

-- Check vector dimension (should be 768 after migration 015)
SELECT atttypmod FROM pg_attribute
WHERE attrelid = 'contest_documents'::regclass AND attname = 'embedding';
```
