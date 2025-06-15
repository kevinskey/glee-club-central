
-- Drop all existing problematic policies
DROP POLICY IF EXISTS "profiles_own_access" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_access" ON public.profiles;

-- Drop any problematic functions
DROP FUNCTION IF EXISTS public.is_admin_simple();

-- Create a simple, non-recursive admin check function
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
