
-- Create table to track bulk member imports
CREATE TABLE IF NOT EXISTS public.member_imports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  profile_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.member_imports ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage imports
CREATE POLICY "Admins can manage member imports"
ON public.member_imports
FOR ALL
TO authenticated
USING (public.can_manage_users());

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_member_imports_email ON public.member_imports(email);
CREATE INDEX IF NOT EXISTS idx_member_imports_status ON public.member_imports(status);
