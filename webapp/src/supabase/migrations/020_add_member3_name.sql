-- Migration: Add member3_name column to license_applications
-- For elementary category, supports 3 team members

ALTER TABLE license_applications ADD COLUMN IF NOT EXISTS member3_name TEXT;

COMMENT ON COLUMN license_applications.member3_name IS '팀원3 이름';
