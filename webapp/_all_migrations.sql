-- Sprint 3: Submissions + Files tables

-- Submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),  -- NULL for guest submissions
  submission_no TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('elementary', 'secondary', 'general')),
  team_name TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  password_hash TEXT,  -- Guest only (bcrypt, saltRounds >= 12)
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'accepted', 'rejected')),
  ai_review_status TEXT DEFAULT 'pending' CHECK (ai_review_status IN ('pending', 'queued', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Members can read own submissions
CREATE POLICY "members_read_own_submissions" ON public.submissions
  FOR SELECT USING (auth.uid() = user_id);

-- Members can insert own submissions
CREATE POLICY "members_insert_submissions" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Members can update own submissions (before deadline)
CREATE POLICY "members_update_own_submissions" ON public.submissions
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can read all
CREATE POLICY "admins_read_all_submissions" ON public.submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update all
CREATE POLICY "admins_update_submissions" ON public.submissions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Service role can insert (for guest submissions via API proxy)
CREATE POLICY "service_insert_submissions" ON public.submissions
  FOR INSERT WITH CHECK (true);

CREATE INDEX idx_submissions_no ON public.submissions(submission_no);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_submissions_category ON public.submissions(category);
CREATE INDEX idx_submissions_created_at ON public.submissions(created_at DESC);

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Submission files table
CREATE TABLE IF NOT EXISTS public.submission_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.submission_files ENABLE ROW LEVEL SECURITY;

-- Same RLS pattern as submissions
CREATE POLICY "read_own_submission_files" ON public.submission_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.submissions s
      WHERE s.id = submission_id AND (s.user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
    )
  );

CREATE POLICY "service_insert_submission_files" ON public.submission_files
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- MANUAL STEP: Create Supabase Storage Bucket
-- In Supabase Dashboard → Storage → New bucket
-- Bucket name: contest-files
-- Public: OFF
-- File size limit: 500MB
--
-- Folder structure:
-- contest-files/
--   submissions/
--     {submission_id}/
--       file1.pdf
--       file2.zip
-- ============================================================

-- Storage RLS policies (execute in Supabase Dashboard SQL Editor)
-- Members can upload to their own submission folder
-- CREATE POLICY "members_upload_files" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'contest-files' AND
--     auth.uid() IS NOT NULL
--   );

-- Members can read own files
-- CREATE POLICY "members_read_files" ON storage.objects
--   FOR SELECT USING (
--     bucket_id = 'contest-files' AND
--     auth.uid() IS NOT NULL
--   );

-- Admins can read all files
-- CREATE POLICY "admins_read_all_files" ON storage.objects
--   FOR SELECT USING (
--     bucket_id = 'contest-files' AND
--     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
--   );
-- Sprint 4: Add contact_name to submissions
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS contact_name TEXT;
-- Sprint 5: Chatbot tables (contest_documents with pgvector, chatbot_logs, chatbot_settings)

-- Enable pgvector extension (must be run by Supabase admin)
CREATE EXTENSION IF NOT EXISTS vector;

-- Contest documents for RAG vector search
CREATE TABLE IF NOT EXISTS public.contest_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contest_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_contest_docs" ON public.contest_documents
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_contest_docs" ON public.contest_documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "service_insert_contest_docs" ON public.contest_documents
  FOR INSERT WITH CHECK (true);

CREATE INDEX ON public.contest_documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

-- Chatbot conversation logs
CREATE TABLE IF NOT EXISTS public.chatbot_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  user_query TEXT NOT NULL,
  ai_response TEXT,
  is_blocked BOOLEAN DEFAULT false,
  tokens_used INTEGER DEFAULT 0,
  provider TEXT,
  model TEXT,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chatbot_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_insert_chatbot_logs" ON public.chatbot_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_read_chatbot_logs" ON public.chatbot_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX idx_chatbot_logs_created ON public.chatbot_logs(created_at DESC);
CREATE INDEX idx_chatbot_logs_blocked ON public.chatbot_logs(is_blocked);

-- Chatbot settings (singleton row)
CREATE TABLE IF NOT EXISTS public.chatbot_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'openai' CHECK (provider IN ('openai','anthropic','google')),
  model_name TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  system_prompt TEXT NOT NULL DEFAULT '당신은 제8회 교육 공공데이터 AI활용대회의 안내 도우미입니다. 대회 요강 범위 내에서만 답변하세요. 범위 밖 질문에는 정중히 거절하세요.',
  max_tokens INTEGER NOT NULL DEFAULT 1000,
  temperature DECIMAL(3,2) NOT NULL DEFAULT 0.7,
  allowed_topics JSONB NOT NULL DEFAULT '["대회 일정","신청 방법","참가 자격","제출 양식","시상 내역","AI 이용권","심사 기준"]',
  blocked_topics JSONB NOT NULL DEFAULT '["정치","성인 콘텐츠","개인정보","욕설"]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  daily_limit INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.chatbot_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_chatbot_settings" ON public.chatbot_settings
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_chatbot_settings" ON public.chatbot_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Insert default settings row
INSERT INTO public.chatbot_settings (provider, model_name) VALUES ('openai', 'gpt-4o-mini');

-- Seed contest documents for RAG
INSERT INTO public.contest_documents (title, content, metadata) VALUES
('대회 개요', '제8회 교육 공공데이터 AI활용대회는 교육 공공데이터와 AI 기술을 활용한 창의적 프로젝트를 선보이는 대회입니다.', '{"section": "overview"}'),
('참가 대상', '초등부: 전국 초등학교 4~6학년 재학생 (개인 또는 팀). 중·고등부: 전국 중·고등학교 재학생 (개인 또는 팀). 일반부: 성인 누구나 (개인 또는 팀, 나이 제한 없음).', '{"section": "eligibility"}'),
('주요 일정', '접수 기간: 2026년 3월 1일(토) ~ 5월 31일(토) 23:59까지. 심사 기간: 2026년 6월 1일 ~ 6월 30일. 결과 발표: 2026년 7월 15일. 시상식: 2026년 8월 중 서울 소재 예정.', '{"section": "schedule"}'),
('부문별 주제', '초등부: 교육 데이터를 활용한 창의적 영상 제작. 중·고등부: AI 기술을 활용한 교육 데이터 분석 프로젝트. 일반부: 교육 공공데이터 기반 AI 서비스 개발.', '{"section": "themes"}'),
('심사 기준', '창의성 30점: 아이디어의 참신함과 독창성. 기술성 30점: AI 기술 활용도 및 구현 완성도. 활용성 30점: 실생활 적용 가능성 및 교육적 효과. 완성도 10점: 프로젝트 완성도 및 발표 자료.', '{"section": "scoring"}'),
('AI 이용권', 'AI 이용권은 선착순 500명까지 무료로 제공됩니다. 에듀핏(EduFit) AI 학습 플랫폼 2개월 이용권 (4월 1일 ~ 5월 31일). 카카오 또는 네이버 본인 인증 후 신청 가능합니다. 신청 후 관리자 승인까지 1~3일 소요됩니다.', '{"section": "license"}'),
('작품 접수', '팀당 최대 500MB까지 업로드 가능합니다. 제출하신 작품은 마감 전까지 수정 가능합니다. 누구나 이름, 이메일, 비밀번호를 입력하면 접수할 수 있습니다. 접수 완료 시 접수번호가 발급되며, 접수번호와 비밀번호로 조회/수정이 가능합니다.', '{"section": "submission"}'),
('허용 파일 형식', '허용 파일 형식: PDF, ZIP, HWP, HWPX, PPTX, PPT, DOCX, DOC, XLSX, XLS, PNG, JPG, JPEG, MP4, AVI, MOV. 총 500MB 이내.', '{"section": "file_formats"}'),
('총상금', '총상금은 800만원입니다.', '{"section": "prizes"}'),
('팀 참가', '개인 또는 팀(최대 4명) 모두 참가 가능합니다.', '{"section": "team"}');
-- BUG-026 Fix: RPC function for pgvector cosine similarity search
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
-- Sprint 6: School email OTP + student verifications + AI review queue

-- School email OTP verification
CREATE TABLE IF NOT EXISTS public.school_email_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  purpose TEXT DEFAULT 'license_apply',
  verified BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.school_email_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_manage_otp" ON public.school_email_verifications
  FOR ALL WITH CHECK (true);

CREATE INDEX idx_otp_email ON public.school_email_verifications(email);
CREATE INDEX idx_otp_expires ON public.school_email_verifications(expires_at);

-- Student ID uploads for failed OTP
CREATE TABLE IF NOT EXISTS public.student_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  student_id_file_path TEXT NOT NULL,
  school_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.student_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_manage_student_verif" ON public.student_verifications
  FOR ALL WITH CHECK (true);

CREATE POLICY "admin_read_student_verif" ON public.student_verifications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- AI review queue (manual trigger only, doc 12.4)
CREATE TABLE IF NOT EXISTS public.ai_review_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','processing','completed','failed','skipped')),
  priority INTEGER NOT NULL DEFAULT 5,
  ai_score DECIMAL(5,2),
  ai_feedback JSONB,
  ai_provider TEXT,
  ai_model TEXT,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  queued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  triggered_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ai_review_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_manage_review_queue" ON public.ai_review_queue
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX idx_review_queue_status ON public.ai_review_queue(status);
CREATE INDEX idx_review_queue_submission ON public.ai_review_queue(submission_id);
-- Migration 008b: Board enhancements
-- Add pinned column for notices
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- Add parent_id for QnA replies (admin answers)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.posts(id) ON DELETE CASCADE;
-- Migration 008c: File upload settings table
CREATE TABLE IF NOT EXISTS public.file_upload_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_type TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  max_file_size_mb INTEGER NOT NULL DEFAULT 10,
  allowed_extensions JSONB NOT NULL DEFAULT '["pdf","hwp","docx"]',
  storage_bucket TEXT NOT NULL DEFAULT 'contest-files',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.file_upload_settings (upload_type, display_name, max_file_size_mb, allowed_extensions)
VALUES
  ('submission_file', '작품 제출 파일', 500, '["zip","pdf","hwp","docx","pptx","mp4","avi"]'),
  ('student_id', '학생증 사진', 5, '["jpg","jpeg","png","pdf"]')
ON CONFLICT (upload_type) DO NOTHING;

ALTER TABLE public.file_upload_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "file_settings_read" ON public.file_upload_settings FOR SELECT USING (true);
CREATE POLICY "file_settings_admin_write" ON public.file_upload_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
-- Migration 009a: Add auth_providers JSONB to chatbot_settings (singleton)
-- Claude task-C01: Admin settings DB integration
ALTER TABLE public.chatbot_settings
  ADD COLUMN IF NOT EXISTS auth_providers JSONB NOT NULL DEFAULT '{"kakao": true, "naver": true, "school_email": true}';

-- Backfill existing singleton row (ALTER TABLE default only applies to new rows)
UPDATE public.chatbot_settings
  SET auth_providers = '{"kakao": true, "naver": true, "school_email": true}'
  WHERE auth_providers IS NULL;
-- Migration 009b: pages table + site_settings table
-- Claude Phase 1: #6 (pages CMS) + #8 (deadline admin management)

-- ============================================
-- 1. site_settings — operational parameters (deadline, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings_public_read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_admin_write" ON public.site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Seed default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('contest_deadline', '"2026-05-31T23:59:59+09:00"'),
  ('contest_start', '"2026-03-01T00:00:00+09:00"'),
  ('review_period_start', '"2026-06-01T00:00:00+09:00"'),
  ('review_period_end', '"2026-06-30T23:59:59+09:00"'),
  ('result_announcement', '"2026-07-15T00:00:00+09:00"'),
  ('ceremony_date', '"2026-08-01T00:00:00+09:00"'),
  ('max_license_seats', '500')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 2. pages — CMS for editable public page content
-- ============================================
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT true,
  updated_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pages_public_read" ON public.pages FOR SELECT USING (is_published = true);
CREATE POLICY "pages_admin_all" ON public.pages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Seed default pages
INSERT INTO public.pages (slug, title, content) VALUES
  ('home', '홈페이지', '{"hero_title": "제8회 교육 공공데이터 AI활용대회", "hero_subtitle": "교육의 미래를 AI와 함께 열어갑니다", "hero_cta_license": "AI 이용권 신청하기", "hero_cta_submit": "작품 접수하기"}'),
  ('contest-info', '공모요강', '{"sections": [{"title": "대회 개요", "content": "교육 공공데이터를 활용하여 AI 기반의 창의적인 솔루션을 개발하는 전국 규모 대회입니다."}, {"title": "참가 자격", "content": "초등부: 전국 초등학교 4~6학년 재학생. 중·고등부: 전국 중·고등학교 재학생. 일반부: 성인 누구나."}, {"title": "시상 내역", "content": "총상금 800만원. 부문별 대상, 최우수상, 우수상, 장려상."}]}'),
  ('submit-guide', '접수 안내', '{"file_formats": "PDF, ZIP, HWP, HWPX, PPTX, PPT, DOCX, DOC, XLSX, XLS, PNG, JPG, JPEG, MP4, AVI, MOV", "max_size": "총 500MB 이내", "deadline_note": "마감일 23:59까지 접수 가능"}')
ON CONFLICT (slug) DO NOTHING;
-- Migration: 010_license_issued_tracking.sql
-- Add license_issued_at column to track when EduFit license was actually issued

ALTER TABLE license_applications
ADD COLUMN IF NOT EXISTS license_issued_at TIMESTAMPTZ DEFAULT NULL;

-- Index for filtering issued/not-issued
CREATE INDEX IF NOT EXISTS idx_license_applications_issued
ON license_applications (license_issued_at)
WHERE license_issued_at IS NOT NULL;

COMMENT ON COLUMN license_applications.license_issued_at
IS 'Timestamp when the EduFit license was actually issued/sent. NULL = not yet issued.';
-- Migration 011: Enhance site_settings and pages tables from 009b
-- Adds columns needed by Claude's admin API (description, updated_by)
-- and additional seed data.
-- Depends on: 009b_pages_and_site_settings.sql

-- Add description column to site_settings
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add updated_by column to site_settings
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.users(id);

-- Add additional seed settings (contest operations)
INSERT INTO public.site_settings (key, value, description) VALUES
  ('contest_name', '"제8회 교육 공공데이터 AI활용대회"', '대회 명칭'),
  ('contest_location', '"세종특별자치시 교육부"', '대회 장소'),
  ('submission_enabled', 'true', '작품 접수 활성화 여부')
ON CONFLICT (key) DO NOTHING;

-- Update existing rows with descriptions
UPDATE public.site_settings SET description = '작품 접수 마감일 (KST)' WHERE key = 'contest_deadline' AND description IS NULL;
UPDATE public.site_settings SET description = '대회 시작일' WHERE key = 'contest_start' AND description IS NULL;
UPDATE public.site_settings SET description = '심사 시작일' WHERE key = 'review_period_start' AND description IS NULL;
UPDATE public.site_settings SET description = '심사 종료일' WHERE key = 'review_period_end' AND description IS NULL;
UPDATE public.site_settings SET description = '결과 발표일' WHERE key = 'result_announcement' AND description IS NULL;
UPDATE public.site_settings SET description = '시상식 날짜' WHERE key = 'ceremony_date' AND description IS NULL;
UPDATE public.site_settings SET description = '이용권 최대 승인 수' WHERE key = 'max_license_seats' AND description IS NULL;

-- Add footer seed page if not exists
INSERT INTO public.pages (slug, title, content) VALUES
  ('footer', '푸터', '{"contact_email": "contest@edu-ai.kr", "address": "세종특별자치시 교육부", "copyright": "© 2026 교육 공공데이터 AI활용대회"}')
ON CONFLICT (slug) DO NOTHING;
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
-- Migration 013: Convert pages table to menu management
-- Adds visibility, access control, and warning message columns

-- Add menu management columns
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS path TEXT;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS menu_order INTEGER DEFAULT 0;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS access_warning TEXT DEFAULT '이 페이지는 현재 비공개 상태입니다. 관리자에게 문의해주세요.';

-- is_visible: 헤더 메뉴에 보이냐/안보이냐
-- is_public: true=누구나 접근, false=관리자 로그인해야 접근
-- access_warning: 비공개 페이지 접근 시 보여줄 경고 메시지

-- Clear old seed data and insert menu items
DELETE FROM public.pages;

INSERT INTO public.pages (slug, title, path, menu_order, is_visible, is_public, is_published, content) VALUES
  ('home',          '홈',           '/',                0,  true,  true, true, '{}'),
  ('contest-info',  '공모요강',     '/contest-info',    1,  true,  true, true, '{}'),
  ('submit',        '작품접수',     '/submit',          2,  true,  true, true, '{}'),
  ('submit-lookup', '접수조회',     '/submit/lookup',   3,  true,  true, true, '{}'),
  ('board',         '게시판',       '/board',           4,  true,  true, true, '{}'),
  ('faq',           'FAQ',          '/faq',             5,  true,  true, true, '{}'),
  ('license-apply', '이용권 신청',  '/license-apply',   6,  true,  true, true, '{}')
ON CONFLICT (slug) DO UPDATE SET
  path = EXCLUDED.path,
  menu_order = EXCLUDED.menu_order,
  is_visible = COALESCE(public.pages.is_visible, EXCLUDED.is_visible),
  is_public = COALESCE(public.pages.is_public, EXCLUDED.is_public);

-- Add columns if they were missing on existing rows (for ON CONFLICT case)
UPDATE public.pages SET
  access_warning = '이 페이지는 현재 비공개 상태입니다. 관리자에게 문의해주세요.'
WHERE access_warning IS NULL;
-- Migration 014: License auth method tracking + student direct application support
-- Adds auth_method to track how each applicant verified identity
-- Makes user_id nullable for student direct applications (no account)
-- Adds applicant_name, applicant_email for non-user applicants

-- 1. Add auth_method column
ALTER TABLE public.license_applications
ADD COLUMN IF NOT EXISTS auth_method TEXT DEFAULT 'kakao'
CHECK (auth_method IN ('kakao', 'naver', 'school_email', 'student_direct'));

-- 2. Make user_id nullable (student direct applications have no user account)
ALTER TABLE public.license_applications
ALTER COLUMN user_id DROP NOT NULL;

-- 3. Add applicant info for non-user applications
ALTER TABLE public.license_applications
ADD COLUMN IF NOT EXISTS applicant_name TEXT;

ALTER TABLE public.license_applications
ADD COLUMN IF NOT EXISTS applicant_email TEXT;

-- 4. Add reference to student_verifications (for student direct applications)
ALTER TABLE public.license_applications
ADD COLUMN IF NOT EXISTS student_verification_id UUID REFERENCES public.student_verifications(id);

-- 5. Update existing rows: set auth_method based on user presence
-- (Existing rows all have user_id, so they came from kakao/naver)
UPDATE public.license_applications
SET auth_method = 'kakao'
WHERE auth_method IS NULL;

-- 6. Drop the old unique index that requires user_id (it would fail for NULL user_id)
DROP INDEX IF EXISTS idx_unique_user_application;

-- 7. Create new unique index that handles both user and non-user applications
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_application
ON public.license_applications(user_id)
WHERE status != 'rejected' AND user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_email_application
ON public.license_applications(applicant_email)
WHERE status != 'rejected' AND applicant_email IS NOT NULL AND user_id IS NULL;
-- Migration 015: Switch from OpenAI embeddings (1536 dim) to Gemini embeddings (768 dim)
-- Also updates the RPC function and chatbot_settings defaults

-- 1. Clear existing embeddings (they're OpenAI format, incompatible with Gemini)
UPDATE public.contest_documents SET embedding = NULL;

-- 2. Drop old index (references old vector size)
DROP INDEX IF EXISTS contest_documents_embedding_idx;

-- 3. Change vector column dimension: 1536 → 768
ALTER TABLE public.contest_documents
ALTER COLUMN embedding TYPE VECTOR(768);

-- 4. Recreate index for new dimension
CREATE INDEX ON public.contest_documents
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

-- 5. Update RPC function for new vector dimension
CREATE OR REPLACE FUNCTION match_contest_documents(
  query_embedding VECTOR(768),
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

-- 6. Update chatbot_settings defaults to Gemini
UPDATE public.chatbot_settings SET
  provider = 'google',
  model_name = 'gemini-3-flash-preview'
WHERE provider = 'openai';
-- Migration 016: Review stages (pre-screening + 1st round)
-- Adds review stage tracking to submissions table

-- 1. Add review stage columns
ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS review_stage TEXT DEFAULT 'none'
  CHECK (review_stage IN ('none', 'pre_screening', 'pre_screening_pass', 'pre_screening_fail', 'first_round', 'first_round_done'));

ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS pre_screening_result JSONB;

ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS first_round_result JSONB;

ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS first_round_score DECIMAL(5,2);

-- 2. Pre-screening criteria table (admin-configurable)
CREATE TABLE IF NOT EXISTS public.review_criteria (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stage TEXT NOT NULL CHECK (stage IN ('pre_screening', 'first_round')),
  criteria_key TEXT NOT NULL,
  criteria_label TEXT NOT NULL,
  criteria_description TEXT,
  is_required BOOLEAN DEFAULT true,
  weight INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.review_criteria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_manage_review_criteria" ON public.review_criteria
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. Seed default pre-screening criteria
INSERT INTO public.review_criteria (stage, criteria_key, criteria_label, criteria_description, is_required, sort_order) VALUES
  ('pre_screening', 'has_title', '작품 제목', '작품 제목이 입력되어 있는지', true, 1),
  ('pre_screening', 'has_description', '작품 설명', '작품 설명이 50자 이상인지', true, 2),
  ('pre_screening', 'has_files', '파일 첨부', '최소 1개 이상의 파일이 첨부되어 있는지', true, 3),
  ('pre_screening', 'valid_category', '부문 적합성', '유효한 부문(초등/중고등/일반)이 선택되어 있는지', true, 4),
  ('pre_screening', 'has_contact', '연락처 정보', '이메일 또는 연락처가 입력되어 있는지', true, 5),
  ('pre_screening', 'file_size_ok', '파일 용량', '첨부파일이 500MB 이하인지', true, 6)
ON CONFLICT DO NOTHING;

-- 4. Seed default 1st round criteria (AI will use these)
INSERT INTO public.review_criteria (stage, criteria_key, criteria_label, criteria_description, weight, sort_order) VALUES
  ('first_round', 'creativity', '창의성', '아이디어의 참신함과 독창성', 30, 1),
  ('first_round', 'technical', '기술성', 'AI 기술 활용도 및 구현 완성도', 30, 2),
  ('first_round', 'utility', '활용성', '실생활 적용 가능성 및 교육적 효과', 30, 3),
  ('first_round', 'completeness', '완성도', '프로젝트 완성도 및 발표 자료', 10, 4)
ON CONFLICT DO NOTHING;

-- 5. Index for review queries
CREATE INDEX IF NOT EXISTS idx_submissions_review_stage ON public.submissions(review_stage);
-- Migration 017: Add category column to posts table for FAQ categorization
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS category TEXT;

-- Update existing FAQ seed data with categories
UPDATE public.posts SET category = 'ai_license'    WHERE type = 'faq' AND title LIKE '%AI 이용권%' AND category IS NULL;
UPDATE public.posts SET category = 'submission'     WHERE type = 'faq' AND title LIKE '%작품 접수%' AND category IS NULL;
UPDATE public.posts SET category = 'participation'  WHERE type = 'faq' AND title LIKE '%팀으로 참가%' AND category IS NULL;
UPDATE public.posts SET category = 'submission'     WHERE type = 'faq' AND title LIKE '%비회원%' AND category IS NULL;
UPDATE public.posts SET category = 'submission'     WHERE type = 'faq' AND title LIKE '%수정이 가능%' AND category IS NULL;
