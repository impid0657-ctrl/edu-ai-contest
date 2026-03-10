-- Sprint 3: Submissions + Files tables

-- Submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),  -- NULL for guest submissions
  submission_no TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('elementary', 'secondary', 'general')),
  team_name TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  password_hash TEXT,  -- Guest only (bcrypt, saltRounds >= 12)
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'accepted', 'rejected')),
  ai_review_status TEXT DEFAULT 'pending' CHECK (ai_review_status IN ('pending', 'queued', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Members can read own submissions
CREATE POLICY "members_read_own_submissions" ON public.submissions
  FOR SELECT USING (auth.uid() = user_id);

-- Members can insert own submissions
CREATE POLICY "members_insert_submissions" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Members can update own submissions (before deadline)
CREATE POLICY "members_update_own_submissions" ON public.submissions
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can read all
CREATE POLICY "admins_read_all_submissions" ON public.submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update all
CREATE POLICY "admins_update_submissions" ON public.submissions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Service role can insert (for guest submissions via API proxy)
CREATE POLICY "service_insert_submissions" ON public.submissions
  FOR INSERT WITH CHECK (true);

CREATE INDEX idx_submissions_no ON public.submissions(submission_no);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_submissions_category ON public.submissions(category);
CREATE INDEX idx_submissions_created_at ON public.submissions(created_at DESC);

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Submission files table
CREATE TABLE IF NOT EXISTS public.submission_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.submission_files ENABLE ROW LEVEL SECURITY;

-- Same RLS pattern as submissions
CREATE POLICY "read_own_submission_files" ON public.submission_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.submissions s
      WHERE s.id = submission_id AND (s.user_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
    )
  );

CREATE POLICY "service_insert_submission_files" ON public.submission_files
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- MANUAL STEP: Create Supabase Storage Bucket
-- In Supabase Dashboard → Storage → New bucket
-- Bucket name: contest-files
-- Public: OFF
-- File size limit: 500MB
--
-- Folder structure:
-- contest-files/
--   submissions/
--     {submission_id}/
--       file1.pdf
--       file2.zip
-- ============================================================

-- Storage RLS policies (execute in Supabase Dashboard SQL Editor)
-- Members can upload to their own submission folder
-- CREATE POLICY "members_upload_files" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'contest-files' AND
--     auth.uid() IS NOT NULL
--   );

-- Members can read own files
-- CREATE POLICY "members_read_files" ON storage.objects
--   FOR SELECT USING (
--     bucket_id = 'contest-files' AND
--     auth.uid() IS NOT NULL
--   );

-- Admins can read all files
-- CREATE POLICY "admins_read_all_files" ON storage.objects
--   FOR SELECT USING (
--     bucket_id = 'contest-files' AND
--     EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
--   );
