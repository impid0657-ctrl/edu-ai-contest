-- Migration 017: Add category column to posts table for FAQ categorization
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS category TEXT;

-- Update existing FAQ seed data with categories
UPDATE public.posts SET category = 'ai_license'    WHERE type = 'faq' AND title LIKE '%AI 이용권%' AND category IS NULL;
UPDATE public.posts SET category = 'submission'     WHERE type = 'faq' AND title LIKE '%작품 접수%' AND category IS NULL;
UPDATE public.posts SET category = 'participation'  WHERE type = 'faq' AND title LIKE '%팀으로 참가%' AND category IS NULL;
UPDATE public.posts SET category = 'submission'     WHERE type = 'faq' AND title LIKE '%비회원%' AND category IS NULL;
UPDATE public.posts SET category = 'submission'     WHERE type = 'faq' AND title LIKE '%수정이 가능%' AND category IS NULL;
