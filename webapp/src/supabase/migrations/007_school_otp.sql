-- Sprint 6: School email OTP + student verifications + AI review queue

-- School email OTP verification
CREATE TABLE IF NOT EXISTS public.school_email_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  purpose TEXT DEFAULT 'license_apply',
  verified BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.school_email_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_manage_otp" ON public.school_email_verifications
  FOR ALL WITH CHECK (true);

CREATE INDEX idx_otp_email ON public.school_email_verifications(email);
CREATE INDEX idx_otp_expires ON public.school_email_verifications(expires_at);

-- Student ID uploads for failed OTP
CREATE TABLE IF NOT EXISTS public.student_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  student_id_file_path TEXT NOT NULL,
  school_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.student_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_manage_student_verif" ON public.student_verifications
  FOR ALL WITH CHECK (true);

CREATE POLICY "admin_read_student_verif" ON public.student_verifications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- AI review queue (manual trigger only, doc 12.4)
CREATE TABLE IF NOT EXISTS public.ai_review_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','processing','completed','failed','skipped')),
  priority INTEGER NOT NULL DEFAULT 5,
  ai_score DECIMAL(5,2),
  ai_feedback JSONB,
  ai_provider TEXT,
  ai_model TEXT,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  queued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  triggered_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ai_review_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_manage_review_queue" ON public.ai_review_queue
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX idx_review_queue_status ON public.ai_review_queue(status);
CREATE INDEX idx_review_queue_submission ON public.ai_review_queue(submission_id);
