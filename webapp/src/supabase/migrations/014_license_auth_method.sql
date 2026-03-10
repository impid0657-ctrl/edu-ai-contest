-- Migration 014: License auth method tracking + student direct application support
-- Adds auth_method to track how each applicant verified identity
-- Makes user_id nullable for student direct applications (no account)
-- Adds applicant_name, applicant_email for non-user applicants

-- 1. Add auth_method column
ALTER TABLE public.license_applications
ADD COLUMN IF NOT EXISTS auth_method TEXT DEFAULT 'kakao'
CHECK (auth_method IN ('kakao', 'naver', 'school_email', 'student_direct'));

-- 2. Make user_id nullable (student direct applications have no user account)
ALTER TABLE public.license_applications
ALTER COLUMN user_id DROP NOT NULL;

-- 3. Add applicant info for non-user applications
ALTER TABLE public.license_applications
ADD COLUMN IF NOT EXISTS applicant_name TEXT;

ALTER TABLE public.license_applications
ADD COLUMN IF NOT EXISTS applicant_email TEXT;

-- 4. Add reference to student_verifications (for student direct applications)
ALTER TABLE public.license_applications
ADD COLUMN IF NOT EXISTS student_verification_id UUID REFERENCES public.student_verifications(id);

-- 5. Update existing rows: set auth_method based on user presence
-- (Existing rows all have user_id, so they came from kakao/naver)
UPDATE public.license_applications
SET auth_method = 'kakao'
WHERE auth_method IS NULL;

-- 6. Drop the old unique index that requires user_id (it would fail for NULL user_id)
DROP INDEX IF EXISTS idx_unique_user_application;

-- 7. Create new unique index that handles both user and non-user applications
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_user_application
ON public.license_applications(user_id)
WHERE status != 'rejected' AND user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_email_application
ON public.license_applications(applicant_email)
WHERE status != 'rejected' AND applicant_email IS NOT NULL AND user_id IS NULL;
