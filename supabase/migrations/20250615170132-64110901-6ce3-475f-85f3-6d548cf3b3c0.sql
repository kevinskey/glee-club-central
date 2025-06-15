
-- First, drop all policies that depend on the is_admin_email_safe function
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
DROP POLICY IF EXISTS "admins_can_manage_soundcloud_embeds" ON public.soundcloud_embeds;

-- Drop all other existing problematic policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow super admins to view all profiles" ON public.profiles;

-- Now drop the problematic admin check functions
DROP FUNCTION IF EXISTS public.is_admin_email();
DROP FUNCTION IF EXISTS public.is_admin_email_safe();
DROP FUNCTION IF EXISTS public.is_current_user_super_admin();

-- Create simple, non-recursive policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- Create a safe admin check function that doesn't query profiles table
CREATE OR REPLACE FUNCTION public.is_admin_by_email()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT email = 'kevinskey@mac.com' FROM auth.users WHERE id = auth.uid()),
    false
  );
$$;

-- Create additional policy for admin access using the safe function
CREATE POLICY "Admin can access all profiles"
  ON public.profiles
  FOR ALL
  USING (public.is_admin_by_email());

-- Recreate the soundcloud_embeds policy if needed
CREATE POLICY "admins_can_manage_soundcloud_embeds"
  ON public.soundcloud_embeds
  FOR ALL
  USING (public.is_admin_by_email());
