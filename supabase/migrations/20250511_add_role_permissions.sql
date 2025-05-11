
-- Create enum type for permission names
CREATE TYPE public.permission_name AS ENUM (
  'can_view_financials', 
  'can_edit_financials', 
  'can_upload_sheet_music',
  'can_view_sheet_music', 
  'can_edit_attendance', 
  'can_view_attendance',
  'can_view_wardrobe', 
  'can_edit_wardrobe', 
  'can_upload_media',
  'can_manage_tour', 
  'can_manage_stage', 
  'can_view_prayer_box',
  'can_post_announcements', 
  'can_manage_users'
);

-- Create enum type for user titles
CREATE TYPE public.user_title AS ENUM (
  'Super Admin',
  'Treasurer',
  'Librarian',
  'Wardrobe Mistress',
  'Secretary',
  'President',
  'Historian',
  'PR Manager',
  'Tour Manager',
  'Stage Manager',
  'Chaplain',
  'Section Leader',
  'Student Worker',
  'General Member'
);

-- Create user roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title user_title NOT NULL UNIQUE,
  description TEXT
);

-- Insert default roles
INSERT INTO public.user_roles (title, description)
VALUES
  ('Super Admin', 'Full access to all system features'),
  ('Treasurer', 'Manages financial aspects'),
  ('Librarian', 'Manages sheet music library'),
  ('Section Leader', 'Leads voice section and helps with sectional rehearsals'),
  ('Student Worker', 'Student with limited admin privileges'),
  ('General Member', 'Regular member with basic access')
ON CONFLICT (title) DO NOTHING;

-- Add title field to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS title user_title DEFAULT 'General Member';

-- Create role permissions table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES public.user_roles(id),
  permission permission_name NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(role_id, permission)
);

-- Get user permissions function
CREATE OR REPLACE FUNCTION public.get_user_permissions(p_user_id UUID)
RETURNS TABLE(permission permission_name, granted boolean)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is super admin
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id AND is_super_admin = TRUE) THEN
    -- Return all permissions as granted for super admin
    RETURN QUERY
    SELECT enum_range(NULL::permission_name) AS permission, TRUE AS granted;
  ELSE
    -- Get permissions based on user's title
    RETURN QUERY
    SELECT 
      rp.permission,
      rp.granted
    FROM 
      public.profiles p
    JOIN 
      public.user_roles r ON p.title = r.title
    JOIN 
      public.role_permissions rp ON r.id = rp.role_id
    WHERE 
      p.id = p_user_id;
  END IF;
END;
$$;

-- Function to check if user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(p_user_id UUID, p_permission permission_name)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin BOOLEAN;
  has_perm BOOLEAN;
BEGIN
  -- Check if super admin
  SELECT is_super_admin INTO is_admin FROM public.profiles WHERE id = p_user_id;
  
  IF is_admin THEN
    RETURN TRUE;
  END IF;
  
  -- Check specific permission
  SELECT 
    EXISTS (
      SELECT 1 
      FROM public.profiles p
      JOIN public.user_roles r ON p.title = r.title
      JOIN public.role_permissions rp ON r.id = rp.role_id
      WHERE p.id = p_user_id 
      AND rp.permission = p_permission
      AND rp.granted = TRUE
    ) 
  INTO has_perm;
  
  RETURN has_perm;
END;
$$;

-- Function to update a specific user's permission
CREATE OR REPLACE FUNCTION public.update_user_permission(p_user_id UUID, p_permission permission_name, p_granted BOOLEAN)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role_id UUID;
  v_title user_title;
BEGIN
  -- Get the user's title
  SELECT title INTO v_title FROM public.profiles WHERE id = p_user_id;
  
  IF v_title IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get the role ID for this title
  SELECT id INTO v_role_id FROM public.user_roles WHERE title = v_title;
  
  IF v_role_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if permission exists for this role
  IF EXISTS (
    SELECT 1 FROM public.role_permissions 
    WHERE role_id = v_role_id AND permission = p_permission
  ) THEN
    -- Update existing permission
    UPDATE public.role_permissions
    SET granted = p_granted
    WHERE role_id = v_role_id AND permission = p_permission;
  ELSE
    -- Insert new permission
    INSERT INTO public.role_permissions (role_id, permission, granted)
    VALUES (v_role_id, p_permission, p_granted);
  END IF;
  
  RETURN TRUE;
END;
$$;
