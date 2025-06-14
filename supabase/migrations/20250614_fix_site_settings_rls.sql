
-- Fix RLS policies for site_settings table to allow admin access

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow admin to manage site settings" ON site_settings;
DROP POLICY IF EXISTS "Allow read access to site settings" ON site_settings;

-- Enable RLS on site_settings table
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admin users to manage all site settings
CREATE POLICY "Allow admin to manage site settings" ON site_settings
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.role = 'admin' OR profiles.is_super_admin = true)
  )
);

-- Create policy to allow authenticated users to read site settings
CREATE POLICY "Allow read access to site settings" ON site_settings
FOR SELECT USING (auth.role() = 'authenticated');
