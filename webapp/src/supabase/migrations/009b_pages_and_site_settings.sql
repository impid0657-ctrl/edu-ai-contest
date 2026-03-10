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
