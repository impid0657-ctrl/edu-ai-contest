-- Migration 012: Tighten overly permissive RLS policies
-- SECURITY FIX: Several tables have FOR INSERT WITH CHECK (true) policies
-- that allow anyone with the public anon key to insert data directly,
-- bypassing API validation. The service role already bypasses RLS entirely,
-- so these policies are unnecessary and dangerous.
--
-- Tables affected:
--   posts: service_insert_posts
--   submissions: service_insert_submissions
--   submission_files: service_insert_submission_files
--   contest_documents: service_insert_contest_docs
--   school_email_verifications: service_manage_otp
--   student_verifications: service_manage_student_verif
--   chatbot_logs: service_insert_chatbot_logs
--
-- Fix strategy: Drop overly permissive policies. The service role (used by
-- createAdminClient() in API routes) bypasses RLS entirely, so it still works.
-- The anon key can no longer insert directly.

-- ============================================================
-- 1. posts — remove public INSERT permission
-- ============================================================
DROP POLICY IF EXISTS "service_insert_posts" ON public.posts;

-- ============================================================
-- 2. submissions — remove public INSERT permission
-- ============================================================
DROP POLICY IF EXISTS "service_insert_submissions" ON public.submissions;

-- ============================================================
-- 3. submission_files — remove public INSERT permission
-- ============================================================
DROP POLICY IF EXISTS "service_insert_submission_files" ON public.submission_files;

-- ============================================================
-- 4. contest_documents — remove public INSERT permission
-- ============================================================
DROP POLICY IF EXISTS "service_insert_contest_docs" ON public.contest_documents;

-- ============================================================
-- 5. school_email_verifications — replace ALL-permissive with admin-only
-- ============================================================
DROP POLICY IF EXISTS "service_manage_otp" ON public.school_email_verifications;

-- Admin can read all OTP records
CREATE POLICY "admin_manage_otp" ON public.school_email_verifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 6. student_verifications — replace ALL-permissive with admin-only write
-- ============================================================
DROP POLICY IF EXISTS "service_manage_student_verif" ON public.student_verifications;

-- Admin can manage all student verifications
CREATE POLICY "admin_manage_student_verif" ON public.student_verifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 7. chatbot_logs — remove public INSERT permission
-- ============================================================
DROP POLICY IF EXISTS "service_insert_chatbot_logs" ON public.chatbot_logs;

-- ============================================================
-- 8. users — tighten service INSERT
-- ============================================================
DROP POLICY IF EXISTS "service_insert_users" ON public.users;

-- Only authenticated users or service role can create user profiles
-- (OAuth callback creates profiles — service role bypasses RLS anyway)

-- ============================================================
-- NOTES:
-- - All API routes use createAdminClient() (service role) for writes
-- - Service role ALWAYS bypasses RLS — no policy needed for it
-- - After this migration, the public anon key can only READ public data
-- - Writes MUST go through API routes → adminClient → service role
-- ============================================================
