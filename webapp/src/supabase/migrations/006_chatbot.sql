-- Sprint 5: Chatbot tables (contest_documents with pgvector, chatbot_logs, chatbot_settings)

-- Enable pgvector extension (must be run by Supabase admin)
CREATE EXTENSION IF NOT EXISTS vector;

-- Contest documents for RAG vector search
CREATE TABLE IF NOT EXISTS public.contest_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contest_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_contest_docs" ON public.contest_documents
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_contest_docs" ON public.contest_documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "service_insert_contest_docs" ON public.contest_documents
  FOR INSERT WITH CHECK (true);

CREATE INDEX ON public.contest_documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

-- Chatbot conversation logs
CREATE TABLE IF NOT EXISTS public.chatbot_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  user_query TEXT NOT NULL,
  ai_response TEXT,
  is_blocked BOOLEAN DEFAULT false,
  tokens_used INTEGER DEFAULT 0,
  provider TEXT,
  model TEXT,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chatbot_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_insert_chatbot_logs" ON public.chatbot_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_read_chatbot_logs" ON public.chatbot_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX idx_chatbot_logs_created ON public.chatbot_logs(created_at DESC);
CREATE INDEX idx_chatbot_logs_blocked ON public.chatbot_logs(is_blocked);

-- Chatbot settings (singleton row)
CREATE TABLE IF NOT EXISTS public.chatbot_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'openai' CHECK (provider IN ('openai','anthropic','google')),
  model_name TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  system_prompt TEXT NOT NULL DEFAULT '당신은 제8회 교육 공공데이터 AI활용대회의 안내 도우미입니다. 대회 요강 범위 내에서만 답변하세요. 범위 밖 질문에는 정중히 거절하세요.',
  max_tokens INTEGER NOT NULL DEFAULT 1000,
  temperature DECIMAL(3,2) NOT NULL DEFAULT 0.7,
  allowed_topics JSONB NOT NULL DEFAULT '["대회 일정","신청 방법","참가 자격","제출 양식","시상 내역","AI 이용권","심사 기준"]',
  blocked_topics JSONB NOT NULL DEFAULT '["정치","성인 콘텐츠","개인정보","욕설"]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  daily_limit INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.chatbot_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_chatbot_settings" ON public.chatbot_settings
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_chatbot_settings" ON public.chatbot_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Insert default settings row
INSERT INTO public.chatbot_settings (provider, model_name) VALUES ('openai', 'gpt-4o-mini');

-- Seed contest documents for RAG
INSERT INTO public.contest_documents (title, content, metadata) VALUES
('대회 개요', '제8회 교육 공공데이터 AI활용대회는 교육 공공데이터와 AI 기술을 활용한 창의적 프로젝트를 선보이는 대회입니다.', '{"section": "overview"}'),
('참가 대상', '초등부: 전국 초등학교 4~6학년 재학생 (개인 또는 팀). 중·고등부: 전국 중·고등학교 재학생 (개인 또는 팀). 일반부: 성인 누구나 (개인 또는 팀, 나이 제한 없음).', '{"section": "eligibility"}'),
('주요 일정', '접수 기간: 2026년 3월 1일(토) ~ 5월 31일(토) 23:59까지. 심사 기간: 2026년 6월 1일 ~ 6월 30일. 결과 발표: 2026년 7월 15일. 시상식: 2026년 8월 중 서울 소재 예정.', '{"section": "schedule"}'),
('부문별 주제', '초등부: 교육 데이터를 활용한 창의적 영상 제작. 중·고등부: AI 기술을 활용한 교육 데이터 분석 프로젝트. 일반부: 교육 공공데이터 기반 AI 서비스 개발.', '{"section": "themes"}'),
('심사 기준', '창의성 30점: 아이디어의 참신함과 독창성. 기술성 30점: AI 기술 활용도 및 구현 완성도. 활용성 30점: 실생활 적용 가능성 및 교육적 효과. 완성도 10점: 프로젝트 완성도 및 발표 자료.', '{"section": "scoring"}'),
('AI 이용권', 'AI 이용권은 선착순 500명까지 무료로 제공됩니다. 에듀핏(EduFit) AI 학습 플랫폼 2개월 이용권 (4월 1일 ~ 5월 31일). 카카오 또는 네이버 본인 인증 후 신청 가능합니다. 신청 후 관리자 승인까지 1~3일 소요됩니다.', '{"section": "license"}'),
('작품 접수', '팀당 최대 500MB까지 업로드 가능합니다. 제출하신 작품은 마감 전까지 수정 가능합니다. 누구나 이름, 이메일, 비밀번호를 입력하면 접수할 수 있습니다. 접수 완료 시 접수번호가 발급되며, 접수번호와 비밀번호로 조회/수정이 가능합니다.', '{"section": "submission"}'),
('허용 파일 형식', '허용 파일 형식: PDF, ZIP, HWP, HWPX, PPTX, PPT, DOCX, DOC, XLSX, XLS, PNG, JPG, JPEG, MP4, AVI, MOV. 총 500MB 이내.', '{"section": "file_formats"}'),
('총상금', '총상금은 800만원입니다.', '{"section": "prizes"}'),
('팀 참가', '개인 또는 팀(최대 4명) 모두 참가 가능합니다.', '{"section": "team"}');
