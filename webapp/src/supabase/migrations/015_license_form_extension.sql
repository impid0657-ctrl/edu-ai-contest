-- Migration: AI이용권 신청 폼 확장
-- 신규 컬럼 추가 + 변경이력 테이블 + 개인정보 동의 기록

-- 1. 신규 컬럼 추가
ALTER TABLE public.license_applications
  ADD COLUMN IF NOT EXISTS birth_year TEXT,
  ADD COLUMN IF NOT EXISTS representative_name TEXT,
  ADD COLUMN IF NOT EXISTS member1_name TEXT,
  ADD COLUMN IF NOT EXISTS member2_name TEXT,
  ADD COLUMN IF NOT EXISTS topic TEXT,
  ADD COLUMN IF NOT EXISTS region TEXT,
  ADD COLUMN IF NOT EXISTS privacy_agreed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS third_party_agreed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS teacher_name TEXT,
  ADD COLUMN IF NOT EXISTS teacher_email TEXT,
  ADD COLUMN IF NOT EXISTS teacher_phone TEXT;

-- member_count 제약 조건 수정 (1~3명)
ALTER TABLE public.license_applications
  DROP CONSTRAINT IF EXISTS license_applications_member_count_check;
ALTER TABLE public.license_applications
  ADD CONSTRAINT license_applications_member_count_check CHECK (member_count BETWEEN 1 AND 3);

-- 2. 변경이력 테이블
CREATE TABLE IF NOT EXISTS public.license_application_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.license_applications(id) ON DELETE CASCADE,
  changed_by TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  change_type TEXT NOT NULL CHECK (change_type IN ('create', 'update', 'status_change')),
  old_data JSONB,
  new_data JSONB,
  changed_fields TEXT[]
);

ALTER TABLE public.license_application_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "admins_read_history" ON public.license_application_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY IF NOT EXISTS "service_insert_history" ON public.license_application_history
  FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_app_history_application_id
  ON public.license_application_history(application_id);
CREATE INDEX IF NOT EXISTS idx_app_history_changed_at
  ON public.license_application_history(changed_at DESC);
