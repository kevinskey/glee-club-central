
-- Enable RLS on site_settings table if not already enabled
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Super admins can manage site settings" ON public.site_settings;

-- Create policy allowing super admins to manage all site settings
CREATE POLICY "Super admins can manage site settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_super_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_super_admin = true
  )
);

-- Also allow reading site settings for all authenticated users (for public settings)
CREATE POLICY "Authenticated users can read site settings"
ON public.site_settings
FOR SELECT
TO authenticated
USING (true);
