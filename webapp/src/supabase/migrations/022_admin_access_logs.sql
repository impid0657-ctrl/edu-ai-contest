-- Migration 022: 관리자 접속 로그 테이블
-- 보안 로깅용 (접속, 로그인 성공/실패, 이상 징후)

CREATE TABLE IF NOT EXISTS admin_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('login_success', 'login_fail', 'page_access', 'attack_detected')),
  ip_address TEXT,
  user_agent TEXT,
  email TEXT,
  path TEXT,
  details JSONB DEFAULT '{}',
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 조회 성능을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_access_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_event_type ON admin_access_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_severity ON admin_access_logs (severity);
CREATE INDEX IF NOT EXISTS idx_admin_logs_ip ON admin_access_logs (ip_address);

-- RLS 활성화 (service_role만 접근)
ALTER TABLE admin_access_logs ENABLE ROW LEVEL SECURITY;

-- service_role은 RLS 무시하므로 별도 정책 불필요
-- 일반 사용자는 접근 불가
