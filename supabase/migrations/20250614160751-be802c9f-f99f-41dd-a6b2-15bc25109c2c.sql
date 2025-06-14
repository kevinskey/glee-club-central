
-- Create the soundcloud_embeds table
CREATE TABLE public.soundcloud_embeds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL DEFAULT 'Spelman College Glee Club',
  url TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.soundcloud_embeds ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to view active embeds (for public homepage)
CREATE POLICY "Anyone can view active soundcloud embeds" 
  ON public.soundcloud_embeds 
  FOR SELECT 
  USING (is_active = true);

-- Create policy that allows admins to manage all embeds
CREATE POLICY "Admins can manage soundcloud embeds" 
  ON public.soundcloud_embeds 
  FOR ALL 
  USING (is_current_user_admin_safe());

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_soundcloud_embeds_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_soundcloud_embeds_updated_at_trigger
  BEFORE UPDATE ON public.soundcloud_embeds
  FOR EACH ROW
  EXECUTE FUNCTION update_soundcloud_embeds_updated_at();
