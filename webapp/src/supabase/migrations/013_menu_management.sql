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
