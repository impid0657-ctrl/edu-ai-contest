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
