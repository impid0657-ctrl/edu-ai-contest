-- Migration 009a: Add auth_providers JSONB to chatbot_settings (singleton)
-- Claude task-C01: Admin settings DB integration
ALTER TABLE public.chatbot_settings
  ADD COLUMN IF NOT EXISTS auth_providers JSONB NOT NULL DEFAULT '{"kakao": true, "naver": true, "school_email": true}';

-- Backfill existing singleton row (ALTER TABLE default only applies to new rows)
UPDATE public.chatbot_settings
  SET auth_providers = '{"kakao": true, "naver": true, "school_email": true}'
  WHERE auth_providers IS NULL;
