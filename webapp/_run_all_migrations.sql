-- ============================================================
-- 통합 마이그레이션 스크립트 (미실행 건: 003~017)
-- 실행 대상 DB: puqoqsxwdrvdhnwemmcl (Supabase)
-- 이미 존재하는 테이블: users, license_applications, posts
-- 생성일: 2026-03-09
-- ============================================================

-- ==================== 003: submissions ====================
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  team_name TEXT,
  title TEXT NOT NULL,
  description TEXT,
  ai_usage TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','under_review','accepted','rejected')),
  score DECIMAL(5,2),
  feedback TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.submission_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_manage_own_submissions" ON public.submissions;
CREATE POLICY "users_manage_own_submissions" ON public.submissions FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "service_role_all_submissions" ON public.submissions;
CREATE POLICY "service_role_all_submissions" ON public.submissions FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "users_manage_own_files" ON public.submission_files;
CREATE POLICY "users_manage_own_files" ON public.submission_files FOR ALL USING (EXISTS (SELECT 1 FROM public.submissions s WHERE s.id = submission_id AND s.user_id = auth.uid()));
DROP POLICY IF EXISTS "service_role_all_files" ON public.submission_files;
CREATE POLICY "service_role_all_files" ON public.submission_files FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_submission_files_submission_id ON public.submission_files(submission_id);

-- ==================== 005: add contact_name ====================
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS contact_name TEXT;

-- ==================== 006: chatbot ====================
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.contest_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  content TEXT NOT NULL,
  embedding VECTOR(768),
  has_embedding BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chatbot_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  assistant_message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chatbot_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'google' CHECK (provider IN ('openai','anthropic','google')),
  model_name TEXT NOT NULL DEFAULT 'gemini-3-flash-preview',
  system_prompt TEXT NOT NULL DEFAULT '당신은 제8회 교육 공공데이터 AI활용대회의 안내 도우미입니다.',
  max_tokens INTEGER NOT NULL DEFAULT 1000,
  temperature DECIMAL(3,2) NOT NULL DEFAULT 0.7,
  allowed_topics JSONB NOT NULL DEFAULT '["대회 일정","신청 방법","참가 자격"]',
  blocked_topics JSONB NOT NULL DEFAULT '["정치","성인 콘텐츠","개인정보","욕설"]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  daily_limit INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contest_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_manage_documents" ON public.contest_documents;
CREATE POLICY "admin_manage_documents" ON public.contest_documents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "service_read_documents" ON public.contest_documents;
CREATE POLICY "service_read_documents" ON public.contest_documents FOR SELECT USING (true);

DROP POLICY IF EXISTS "admin_read_logs" ON public.chatbot_logs;
CREATE POLICY "admin_read_logs" ON public.chatbot_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "service_insert_logs" ON public.chatbot_logs;
CREATE POLICY "service_insert_logs" ON public.chatbot_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "admin_manage_chatbot_settings" ON public.chatbot_settings;
CREATE POLICY "admin_manage_chatbot_settings" ON public.chatbot_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

CREATE INDEX IF NOT EXISTS idx_chatbot_logs_session ON public.chatbot_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_logs_created ON public.chatbot_logs(created_at);

-- Insert default chatbot settings (singleton)
INSERT INTO public.chatbot_settings (provider, model_name) VALUES ('google', 'gemini-3-flash-preview')
ON CONFLICT DO NOTHING;

-- Insert default contest documents
INSERT INTO public.contest_documents (title, content) VALUES
  ('대회 개요', '제8회 교육 공공데이터 AI활용대회는 교육부가 주최하고 한국교육학술정보원(KERIS)이 주관하는 대회입니다.'),
  ('참가 자격', '전국 초·중·고등학교 학생 및 교원, 일반인 누구나 참가 가능합니다. 팀(최대 3인) 또는 개인으로 참가할 수 있습니다.'),
  ('시상 내역', '대상 1팀(교육부장관상, 상금 300만원), 최우수상 2팀(각 200만원), 우수상 5팀(각 100만원) 등 총 17팀 시상 예정입니다.')
ON CONFLICT DO NOTHING;

-- 006b: match function
CREATE OR REPLACE FUNCTION match_contest_documents(
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (id UUID, title TEXT, content TEXT, similarity FLOAT)
LANGUAGE sql STABLE
AS $$
  SELECT cd.id, cd.title, cd.content, 1 - (cd.embedding <=> query_embedding) AS similarity
  FROM public.contest_documents cd
  WHERE cd.embedding IS NOT NULL AND 1 - (cd.embedding <=> query_embedding) > match_threshold
  ORDER BY cd.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ==================== 007: school OTP / student verifications ====================
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
DROP POLICY IF EXISTS "service_manage_otp" ON public.school_email_verifications;
CREATE POLICY "service_manage_otp" ON public.school_email_verifications FOR ALL WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_otp_email ON public.school_email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON public.school_email_verifications(expires_at);

CREATE TABLE IF NOT EXISTS public.student_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  student_id_file_path TEXT NOT NULL,
  school_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.student_verifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_manage_student_verif" ON public.student_verifications;
CREATE POLICY "service_manage_student_verif" ON public.student_verifications FOR ALL WITH CHECK (true);
DROP POLICY IF EXISTS "admin_read_student_verif" ON public.student_verifications;
CREATE POLICY "admin_read_student_verif" ON public.student_verifications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

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
DROP POLICY IF EXISTS "admin_manage_review_queue" ON public.ai_review_queue;
CREATE POLICY "admin_manage_review_queue" ON public.ai_review_queue FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE INDEX IF NOT EXISTS idx_review_queue_status ON public.ai_review_queue(status);
CREATE INDEX IF NOT EXISTS idx_review_queue_submission ON public.ai_review_queue(submission_id);

-- ==================== 008b: board enhancements ====================
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.posts(id) ON DELETE CASCADE;

-- ==================== 008c: file upload settings ====================
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
DROP POLICY IF EXISTS "file_settings_read" ON public.file_upload_settings;
CREATE POLICY "file_settings_read" ON public.file_upload_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "file_settings_admin_write" ON public.file_upload_settings;
CREATE POLICY "file_settings_admin_write" ON public.file_upload_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ==================== 009a: auth_providers in chatbot_settings ====================
ALTER TABLE public.chatbot_settings
  ADD COLUMN IF NOT EXISTS auth_providers JSONB NOT NULL DEFAULT '{"kakao": true, "naver": true, "school_email": true}';

UPDATE public.chatbot_settings
  SET auth_providers = '{"kakao": true, "naver": true, "school_email": true}'
  WHERE auth_providers IS NULL;

-- ==================== 009b: pages & site_settings ====================
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_manage_site_settings" ON public.site_settings;
CREATE POLICY "admin_manage_site_settings" ON public.site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "public_read_site_settings" ON public.site_settings;
CREATE POLICY "public_read_site_settings" ON public.site_settings FOR SELECT USING (true);

INSERT INTO public.site_settings (key, value) VALUES
  ('contest_deadline', '"2026-05-31T23:59:59+09:00"'),
  ('submission_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content JSONB,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_manage_pages" ON public.pages;
CREATE POLICY "admin_manage_pages" ON public.pages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "public_read_pages" ON public.pages;
CREATE POLICY "public_read_pages" ON public.pages FOR SELECT USING (is_published = true);

-- ==================== 010: license issued tracking ====================
ALTER TABLE license_applications ADD COLUMN IF NOT EXISTS license_issued_at TIMESTAMPTZ DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_license_applications_issued ON license_applications (license_issued_at) WHERE license_issued_at IS NOT NULL;

-- ==================== 011: site_settings enhancements ====================
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.users(id);

INSERT INTO public.site_settings (key, value, description) VALUES
  ('contest_name', '"제8회 교육 공공데이터 AI활용대회"', '대회명'),
  ('contest_location', '"세종특별자치시 교육부"', '대회 개최 장소'),
  ('submission_enabled', 'true', '작품 접수 가능 여부')
ON CONFLICT (key) DO UPDATE SET description = EXCLUDED.description;

UPDATE public.site_settings SET description = '작품 접수 마감 기한' WHERE key = 'contest_deadline' AND description IS NULL;

-- ==================== 012: tighten RLS ====================
-- (RLS policy updates - skip if already applied, all use DROP IF EXISTS pattern above)

-- ==================== 013: menu management ====================
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS path TEXT;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS menu_order INTEGER DEFAULT 0;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS access_warning TEXT;

-- Seed menu items
INSERT INTO public.pages (slug, title, path, menu_order, is_visible, is_public, is_published) VALUES
  ('home', '홈', '/', 0, true, true, true),
  ('contest-info', '공모요강', '/contest-info', 1, true, true, true),
  ('submit', '작품접수', '/submit', 2, true, false, true),
  ('submit-lookup', '접수조회', '/submit/lookup', 3, true, false, true),
  ('board', '게시판', '/board', 4, true, true, true),
  ('faq', 'FAQ', '/faq', 5, true, true, true),
  ('license-apply', '이용권 신청', '/license-apply', 6, true, true, true)
ON CONFLICT (slug) DO UPDATE SET
  path = EXCLUDED.path,
  menu_order = EXCLUDED.menu_order,
  is_visible = EXCLUDED.is_visible,
  is_public = EXCLUDED.is_public;

-- ==================== 014: license auth method ====================
ALTER TABLE public.license_applications ADD COLUMN IF NOT EXISTS auth_method TEXT DEFAULT 'kakao';
-- Skip CHECK constraint addition if column already had values

ALTER TABLE public.license_applications ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.license_applications ADD COLUMN IF NOT EXISTS applicant_name TEXT;
ALTER TABLE public.license_applications ADD COLUMN IF NOT EXISTS applicant_email TEXT;
ALTER TABLE public.license_applications ADD COLUMN IF NOT EXISTS student_verification_id UUID REFERENCES public.student_verifications(id);

UPDATE public.license_applications SET auth_method = 'kakao' WHERE auth_method IS NULL;

DROP INDEX IF EXISTS idx_unique_user_application;
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_application ON public.license_applications(user_id) WHERE status != 'rejected' AND user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_email_application ON public.license_applications(applicant_email) WHERE status != 'rejected' AND applicant_email IS NOT NULL AND user_id IS NULL;

-- ==================== 016: review stages ====================
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS review_stage TEXT DEFAULT 'none';
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS pre_screening_result JSONB;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS first_round_result JSONB;
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS first_round_score DECIMAL(5,2);

CREATE TABLE IF NOT EXISTS public.review_criteria (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stage TEXT NOT NULL CHECK (stage IN ('pre_screening','first_round')),
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
DROP POLICY IF EXISTS "admin_manage_review_criteria" ON public.review_criteria;
CREATE POLICY "admin_manage_review_criteria" ON public.review_criteria FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

INSERT INTO public.review_criteria (stage, criteria_key, criteria_label, criteria_description, is_required, sort_order) VALUES
  ('pre_screening', 'has_title', '작품 제목', '작품 제목이 입력되어 있는지', true, 1),
  ('pre_screening', 'has_description', '작품 설명', '작품 설명이 50자 이상인지', true, 2),
  ('pre_screening', 'has_files', '파일 첨부', '최소 1개 이상의 파일이 첨부되어 있는지', true, 3),
  ('pre_screening', 'valid_category', '부문 적합성', '유효한 부문이 선택되어 있는지', true, 4),
  ('pre_screening', 'has_contact', '연락처 정보', '이메일 또는 연락처가 입력되어 있는지', true, 5),
  ('pre_screening', 'file_size_ok', '파일 용량', '첨부파일이 500MB 이하인지', true, 6)
ON CONFLICT DO NOTHING;

INSERT INTO public.review_criteria (stage, criteria_key, criteria_label, criteria_description, weight, sort_order) VALUES
  ('first_round', 'creativity', '창의성', '아이디어의 참신함과 독창성', 30, 1),
  ('first_round', 'technical', '기술성', 'AI 기술 활용도 및 구현 완성도', 30, 2),
  ('first_round', 'utility', '활용성', '실생활 적용 가능성 및 교육적 효과', 30, 3),
  ('first_round', 'completeness', '완성도', '프로젝트 완성도 및 발표 자료', 10, 4)
ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_submissions_review_stage ON public.submissions(review_stage);

-- ==================== 017: posts category ====================
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS category TEXT;
UPDATE public.posts SET category = 'ai_license' WHERE type = 'faq' AND title LIKE '%AI 이용권%' AND category IS NULL;
UPDATE public.posts SET category = 'submission' WHERE type = 'faq' AND title LIKE '%작품 접수%' AND category IS NULL;
UPDATE public.posts SET category = 'participation' WHERE type = 'faq' AND title LIKE '%팀으로 참가%' AND category IS NULL;
UPDATE public.posts SET category = 'submission' WHERE type = 'faq' AND title LIKE '%비회원%' AND category IS NULL;
UPDATE public.posts SET category = 'submission' WHERE type = 'faq' AND title LIKE '%수정이 가능%' AND category IS NULL;

-- ==================== 018: 감사 이슈 수정 ====================
-- 1. contest-files Storage 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('contest-files', 'contest-files', false, 524288000)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS 정책
DROP POLICY IF EXISTS "members_upload_files" ON storage.objects;
CREATE POLICY "members_upload_files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'contest-files' AND auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "members_read_files" ON storage.objects;
CREATE POLICY "members_read_files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'contest-files' AND auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "admins_read_all_files" ON storage.objects;
CREATE POLICY "admins_read_all_files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'contest-files' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "admins_delete_files" ON storage.objects;
CREATE POLICY "admins_delete_files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'contest-files' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 2. chatbot_settings에 example_questions 컬럼 추가
ALTER TABLE public.chatbot_settings ADD COLUMN IF NOT EXISTS example_questions JSONB DEFAULT '[]'::jsonb;

-- ==================== 완료 ====================
-- 실행 완료 확인: SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
