-- Sprint 3.5: Posts table + seed data (notices + FAQ)

-- Posts table (minimal, will be expanded in Sprint 4)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('notice', 'faq', 'qna', 'gallery')),
  title TEXT NOT NULL,
  content TEXT,
  author_name TEXT DEFAULT '관리자',
  author_id UUID REFERENCES public.users(id),
  is_secret BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Public can read non-secret posts
CREATE POLICY "public_read_posts" ON public.posts
  FOR SELECT USING (is_secret = false);

-- Service role can insert
CREATE POLICY "service_insert_posts" ON public.posts
  FOR INSERT WITH CHECK (true);

-- Admins can do everything
CREATE POLICY "admins_all_posts" ON public.posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed: 3 notices
INSERT INTO public.posts (type, title, content, author_name, created_at) VALUES
('notice', '제8회 교육 공공데이터 AI활용대회 개최 안내', '2026년 교육 공공데이터 AI활용대회가 3월 1일부터 접수를 시작합니다. 많은 참여 바랍니다.', '관리자', '2026-02-15T00:00:00+09:00'),
('notice', 'AI 이용권 신청 방법 안내', 'AI 이용권은 카카오/네이버/학교 이메일 인증 후 신청 가능합니다. 선착순 500명까지 제공됩니다.', '관리자', '2026-02-20T00:00:00+09:00'),
('notice', '작품 제출 가이드라인 공지', '작품은 팀당 최대 500MB까지 업로드 가능하며, 마감 전까지 수정 가능합니다.', '관리자', '2026-02-25T00:00:00+09:00');

-- Seed: 5 FAQ
INSERT INTO public.posts (type, title, content, author_name, created_at) VALUES
('faq', 'AI 이용권은 누구나 받을 수 있나요?', '선착순 500명까지 무료로 제공됩니다.', '관리자', '2026-02-15T00:00:00+09:00'),
('faq', '작품 접수는 언제까지인가요?', '2026년 5월 31일 23:59까지입니다.', '관리자', '2026-02-15T00:00:00+09:00'),
('faq', '팀으로 참가할 수 있나요?', '네, 개인 또는 팀(최대 4명) 모두 참가 가능합니다.', '관리자', '2026-02-15T00:00:00+09:00'),
('faq', '비회원도 작품 제출이 가능한가요?', '네, 이메일 인증만으로 작품 제출이 가능합니다.', '관리자', '2026-02-15T00:00:00+09:00'),
('faq', '작품 제출 후 수정이 가능한가요?', '네, 마감 전까지 수정 가능합니다.', '관리자', '2026-02-15T00:00:00+09:00');
