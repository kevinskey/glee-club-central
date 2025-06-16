
-- Create a table for storing user role permissions
CREATE TABLE IF NOT EXISTS public.user_role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  permission_key TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(role, permission_key)
);

-- Enable RLS
ALTER TABLE public.user_role_permissions ENABLE ROW LEVEL SECURITY;

-- Only super admins can manage role permissions
CREATE POLICY "Super admins can manage role permissions"
ON public.user_role_permissions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_super_admin = true
  )
);

-- Insert default permissions for different roles
INSERT INTO public.user_role_permissions (role, permission_key, enabled) VALUES
-- Member permissions
('member', 'view_sheet_music', true),
('member', 'view_calendar', true),
('member', 'view_announcements', true),
('member', 'upload_recordings', false),
('member', 'create_setlists', false),
('member', 'view_financials', false),
('member', 'manage_wardrobe', false),
('member', 'send_messages', false),
('member', 'manage_events', false),
('member', 'view_analytics', false),

-- Admin permissions
('admin', 'view_sheet_music', true),
('admin', 'view_calendar', true),
('admin', 'view_announcements', true),
('admin', 'upload_recordings', true),
('admin', 'create_setlists', true),
('admin', 'view_financials', true),
('admin', 'manage_wardrobe', true),
('admin', 'send_messages', true),
('admin', 'manage_events', true),
('admin', 'view_analytics', true),

-- Section Leader permissions
('section_leader', 'view_sheet_music', true),
('section_leader', 'view_calendar', true),
('section_leader', 'view_announcements', true),
('section_leader', 'upload_recordings', true),
('section_leader', 'create_setlists', true),
('section_leader', 'view_financials', false),
('section_leader', 'manage_wardrobe', false),
('section_leader', 'send_messages', true),
('section_leader', 'manage_events', false),
('section_leader', 'view_analytics', false)

ON CONFLICT (role, permission_key) DO NOTHING;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_user_role_permissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_role_permissions_updated_at
  BEFORE UPDATE ON public.user_role_permissions
  FOR EACH ROW EXECUTE FUNCTION update_user_role_permissions_updated_at();
