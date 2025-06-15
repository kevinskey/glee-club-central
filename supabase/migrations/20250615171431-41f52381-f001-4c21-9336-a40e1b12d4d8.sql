
-- Drop all existing problematic policies that might cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can access all profiles" ON public.profiles;

-- Create a completely safe admin check function that only queries auth.users
CREATE OR REPLACE FUNCTION public.is_admin_safe()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT email = 'kevinskey@mac.com' FROM auth.users WHERE id = auth.uid()),
    false
  );
$$;

-- Create simple, non-recursive policies using only auth.uid() and the safe function
CREATE POLICY "Allow own profile access"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = id OR public.is_admin_safe());

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
