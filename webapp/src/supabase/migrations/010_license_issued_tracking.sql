-- Migration: 010_license_issued_tracking.sql
-- Add license_issued_at column to track when EduFit license was actually issued

ALTER TABLE license_applications
ADD COLUMN IF NOT EXISTS license_issued_at TIMESTAMPTZ DEFAULT NULL;

-- Index for filtering issued/not-issued
CREATE INDEX IF NOT EXISTS idx_license_applications_issued
ON license_applications (license_issued_at)
WHERE license_issued_at IS NOT NULL;

COMMENT ON COLUMN license_applications.license_issued_at
IS 'Timestamp when the EduFit license was actually issued/sent. NULL = not yet issued.';
