
-- First, completely disable RLS temporarily to clear any problematic state
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on profiles table (including any we might have missed)
DO $$ 
DECLARE 
    policy_name text;
BEGIN 
    FOR policy_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', policy_name);
    END LOOP;
END $$;

-- Drop all admin-related functions to start fresh
DROP FUNCTION IF EXISTS public.is_admin_simple() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_safe() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_by_email() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin_by_email_safe() CASCADE;
DROP FUNCTION IF EXISTS public.can_access_profile_safe(uuid) CASCADE;

-- Create a completely isolated admin check function that ONLY queries auth.users
CREATE OR REPLACE FUNCTION public.check_is_admin()
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

-- Create simple, isolated policies
CREATE POLICY "allow_own_profile_access"
  ON public.profiles
  FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "allow_admin_full_access"
  ON public.profiles
  FOR ALL
  USING (public.check_is_admin());
