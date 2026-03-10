-- ═══════════════════════════════════════════════
-- posts 테이블 생성 + RLS + 인덱스
-- Supabase Dashboard > SQL Editor에서 실행
-- ═══════════════════════════════════════════════

-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT,
  author_id UUID,
  author_name TEXT DEFAULT '익명',
  parent_id UUID,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_secret BOOLEAN DEFAULT FALSE,
  password_hash TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS 활성화 + 정책
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY service_role_all ON posts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY anon_read ON posts FOR SELECT TO anon USING (true);

-- 3. 인덱스
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_type_category ON posts(type, category);
CREATE INDEX IF NOT EXISTS idx_posts_parent_id ON posts(parent_id);
