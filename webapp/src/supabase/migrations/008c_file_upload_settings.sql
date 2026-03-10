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
