-- Sprint 4: Add contact_name to submissions
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS contact_name TEXT;
