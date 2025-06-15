
-- Completely disable RLS temporarily to clear all policies
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin to view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow super admins to view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

-- Also drop policies on other tables that might be using the problematic functions
DROP POLICY IF EXISTS "Admins can manage soundcloud embeds" ON public.soundcloud_embeds;

-- Drop all potentially problematic functions with CASCADE to remove dependent objects
DROP FUNCTION IF EXISTS public.is_current_user_super_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_current_user_admin_simple() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_by_email() CASCADE;
DROP FUNCTION IF EXISTS public.is_user_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_user_safe() CASCADE;
DROP FUNCTION IF EXISTS public.is_current_user_admin_safe() CASCADE;
DROP FUNCTION IF EXISTS public.is_current_user_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_email() CASCADE;

-- Create a completely safe admin check function
CREATE OR REPLACE FUNCTION public.is_admin_email_safe()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT email = 'kevinskey@mac.com' FROM auth.users WHERE id = auth.uid()),
    false
  );
$$;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, safe policies
CREATE POLICY "profiles_select_policy"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin_email_safe());

CREATE POLICY "profiles_insert_policy"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin_email_safe());

CREATE POLICY "profiles_update_policy"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin_email_safe());

CREATE POLICY "profiles_delete_policy"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id OR public.is_admin_email_safe());

-- Recreate the soundcloud_embeds policy if that table exists
CREATE POLICY "admins_can_manage_soundcloud_embeds"
  ON public.soundcloud_embeds
  FOR ALL
  USING (public.is_admin_email_safe());
