-- 챗봇 폴백 이벤트 로그 테이블
CREATE TABLE IF NOT EXISTS chatbot_fallback_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  original_provider text NOT NULL,
  original_model text,
  fallback_provider text NOT NULL,
  fallback_model text NOT NULL,
  error_message text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- 챗봇 헬스체크 결과 테이블
CREATE TABLE IF NOT EXISTS chatbot_health_checks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  provider text NOT NULL,
  model text,
  status text NOT NULL,
  error_message text,
  latency_ms integer,
  checked_at timestamptz DEFAULT now()
);

-- chatbot_settings 테이블에 폴백 관련 컬럼 추가
DO $$ BEGIN
  ALTER TABLE chatbot_settings ADD COLUMN IF NOT EXISTS fallback_provider text DEFAULT 'openrouter';
  ALTER TABLE chatbot_settings ADD COLUMN IF NOT EXISTS fallback_model text DEFAULT 'anthropic/claude-3.5-haiku';
  ALTER TABLE chatbot_settings ADD COLUMN IF NOT EXISTS auto_fallback boolean DEFAULT true;
EXCEPTION WHEN others THEN
  RAISE NOTICE 'chatbot_settings columns may already exist';
END $$;
