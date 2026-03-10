-- Migration 018: 감사 이슈 수정
-- 1. contest-files Storage 버킷 생성 (SQL로 가능한 경우)
-- 2. chatbot_settings에 example_questions 컬럼 추가

-- ============================================================
-- 1. Storage Bucket: contest-files
-- NOTE: Supabase에서 SQL로 버킷 생성 가능
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('contest-files', 'contest-files', false, 524288000)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: 인증 사용자 업로드
CREATE POLICY IF NOT EXISTS "members_upload_files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'contest-files' AND
    auth.uid() IS NOT NULL
  );

-- Storage RLS: 인증 사용자 자기 파일 읽기
CREATE POLICY IF NOT EXISTS "members_read_files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'contest-files' AND
    auth.uid() IS NOT NULL
  );

-- Storage RLS: 관리자 전체 파일 읽기
CREATE POLICY IF NOT EXISTS "admins_read_all_files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'contest-files' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Storage RLS: 관리자 파일 삭제
CREATE POLICY IF NOT EXISTS "admins_delete_files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'contest-files' AND
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 2. chatbot_settings: example_questions 컬럼 추가
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'chatbot_settings'
      AND column_name = 'example_questions'
  ) THEN
    ALTER TABLE public.chatbot_settings
      ADD COLUMN example_questions JSONB DEFAULT '[]'::jsonb;
    RAISE NOTICE 'Added example_questions column to chatbot_settings';
  ELSE
    RAISE NOTICE 'example_questions column already exists';
  END IF;
END $$;
