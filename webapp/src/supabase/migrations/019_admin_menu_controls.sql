-- 019_admin_menu_controls.sql
-- 관리자 전용 메뉴 노출/공개/경고 설정 (일반 사용자 설정과 완전 독립)

-- 관리자 전용 메뉴 노출 여부
ALTER TABLE pages ADD COLUMN IF NOT EXISTS admin_visible BOOLEAN DEFAULT true;

-- 관리자 전용 공개 여부
ALTER TABLE pages ADD COLUMN IF NOT EXISTS admin_public BOOLEAN DEFAULT true;

-- 관리자 전용 비공개 경고 메시지
ALTER TABLE pages ADD COLUMN IF NOT EXISTS admin_access_warning TEXT DEFAULT '';
