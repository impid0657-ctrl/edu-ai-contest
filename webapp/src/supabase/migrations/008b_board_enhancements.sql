-- Migration 008b: Board enhancements
-- Add pinned column for notices
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- Add parent_id for QnA replies (admin answers)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.posts(id) ON DELETE CASCADE;
