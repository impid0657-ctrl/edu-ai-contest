-- Migration: 지도교사(teacher_name) 컬럼 추가
-- AI활용 소속학교 홍보영상 제작(elementary) 선택 시 지도교사 입력

ALTER TABLE public.license_applications
  ADD COLUMN IF NOT EXISTS teacher_name TEXT,
  ADD COLUMN IF NOT EXISTS teacher_email TEXT,
  ADD COLUMN IF NOT EXISTS teacher_phone TEXT;

COMMENT ON COLUMN public.license_applications.teacher_name
  IS '지도교사 이름 (elementary 카테고리 전용)';
