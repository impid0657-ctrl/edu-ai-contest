-- Migration 016: Board attachments
-- posts 테이블에 attachments JSONB 컬럼 추가
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Supabase Storage 버킷 생성 (Supabase Dashboard → Storage에서 수동 생성 또는 아래 SQL)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('board-attachments', 'board-attachments', true)
-- ON CONFLICT (id) DO NOTHING;
