
-- Drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can access all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow own profile access" ON public.profiles;

-- Drop any problematic functions
DROP FUNCTION IF EXISTS public.is_admin_safe();
DROP FUNCTION IF EXISTS public.is_admin_by_email();
DROP FUNCTION IF EXISTS public.can_access_profile_safe(uuid);

-- Create the simplest possible admin check function
CREATE OR REPLACE FUNCTION public.is_admin_simple()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT email = 'kevinskey@mac.com' FROM auth.users WHERE id = auth.uid()),
    false
  );
$$;

-- Create simple, non-recursive policies
CREATE POLICY "profiles_own_access"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "profiles_admin_access"
  ON public.profiles
  FOR ALL
  USING (public.is_admin_simple());

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
