-- Sprint 2: License Applications table
CREATE TABLE IF NOT EXISTS public.license_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  team_name TEXT,
  category TEXT NOT NULL CHECK (category IN ('elementary', 'secondary', 'general')),
  school_name TEXT,
  grade TEXT,
  member_count INTEGER DEFAULT 1 CHECK (member_count BETWEEN 1 AND 4),
  phone TEXT,
  motivation TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.license_applications ENABLE ROW LEVEL SECURITY;

-- Users can read own applications
CREATE POLICY "users_read_own_applications" ON public.license_applications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert own applications
CREATE POLICY "users_insert_own_applications" ON public.license_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can read all applications
CREATE POLICY "admins_read_all_applications" ON public.license_applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update all applications (for approve/reject)
CREATE POLICY "admins_update_applications" ON public.license_applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Prevent duplicate applications per user
CREATE UNIQUE INDEX idx_unique_user_application ON public.license_applications(user_id)
  WHERE status != 'rejected';

-- Index for admin queries
CREATE INDEX idx_applications_status ON public.license_applications(status);
CREATE INDEX idx_applications_created_at ON public.license_applications(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_license_applications_updated_at
  BEFORE UPDATE ON public.license_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
