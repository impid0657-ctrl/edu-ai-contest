-- Fix chatbot_logs table: add missing columns
-- Run this in Supabase SQL Editor if chatbot_logs exists but is missing columns

-- ai_response 컬럼 추가 (응답 텍스트 저장용)
ALTER TABLE public.chatbot_logs ADD COLUMN IF NOT EXISTS ai_response TEXT;

-- provider 컬럼 추가 (google, openrouter 등)
ALTER TABLE public.chatbot_logs ADD COLUMN IF NOT EXISTS provider TEXT;

-- model 컬럼 추가 (사용된 모델명)
ALTER TABLE public.chatbot_logs ADD COLUMN IF NOT EXISTS model TEXT;

-- latency_ms 컬럼 추가 (응답 지연시간)
ALTER TABLE public.chatbot_logs ADD COLUMN IF NOT EXISTS latency_ms INTEGER;

-- is_blocked 컬럼 추가 (차단 여부)
ALTER TABLE public.chatbot_logs ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;

-- tokens_used 컬럼 추가 (토큰 사용량)
ALTER TABLE public.chatbot_logs ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 0;

-- session_id 컬럼 추가 (세션 ID)
ALTER TABLE public.chatbot_logs ADD COLUMN IF NOT EXISTS session_id TEXT;

-- user_query 컬럼 추가 (사용자 질문)
ALTER TABLE public.chatbot_logs ADD COLUMN IF NOT EXISTS user_query TEXT;

-- chatbot_health_checks 테이블 생성 (없으면)
CREATE TABLE IF NOT EXISTS public.chatbot_health_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT,
  model TEXT,
  status TEXT NOT NULL DEFAULT 'unknown',
  error_message TEXT,
  latency_ms INTEGER,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chatbot_health_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "admin_manage_health_checks" ON public.chatbot_health_checks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY IF NOT EXISTS "service_insert_health_checks" ON public.chatbot_health_checks
  FOR INSERT WITH CHECK (true);

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
