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
