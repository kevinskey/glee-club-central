
-- Create a table to store Google Calendar tokens
CREATE TABLE IF NOT EXISTS public.user_google_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies to protect tokens
ALTER TABLE public.user_google_tokens ENABLE ROW LEVEL SECURITY;

-- Users can only see their own tokens
CREATE POLICY "Users can view their own tokens"
  ON public.user_google_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only update their own tokens
CREATE POLICY "Users can update their own tokens"
  ON public.user_google_tokens
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own tokens
CREATE POLICY "Users can delete their own tokens"
  ON public.user_google_tokens
  FOR DELETE
  USING (auth.uid() = user_id);

-- Service role can manage all tokens
CREATE POLICY "Service role can manage tokens"
  ON public.user_google_tokens
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
