
-- Create a function to check if current user can manage other users
CREATE OR REPLACE FUNCTION public.can_manage_users()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT email = 'kevinskey@mac.com' FROM auth.users WHERE id = auth.uid()) OR
    (SELECT is_super_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Create a function to safely create users with proper permissions
CREATE OR REPLACE FUNCTION public.admin_create_user(
  user_email TEXT,
  user_password TEXT DEFAULT 'TempPassword123!',
  user_first_name TEXT DEFAULT NULL,
  user_last_name TEXT DEFAULT NULL,
  user_role TEXT DEFAULT 'member',
  user_voice_part TEXT DEFAULT NULL,
  user_phone TEXT DEFAULT NULL,
  user_class_year TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  result JSON;
BEGIN
  -- Check if current user can manage users
  IF NOT public.can_manage_users() THEN
    RETURN json_build_object('error', 'Insufficient permissions');
  END IF;

  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = user_email) THEN
    RETURN json_build_object('error', 'User already exists');
  END IF;

  -- Generate a new user ID
  new_user_id := gen_random_uuid();

  -- Insert into profiles table (the trigger will handle auth.users creation)
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    role,
    voice_part,
    phone,
    class_year,
    status,
    is_super_admin,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    user_first_name,
    user_last_name,
    user_role,
    user_voice_part,
    user_phone,
    user_class_year,
    'pending',
    CASE WHEN user_role = 'admin' THEN true ELSE false END,
    NOW(),
    NOW()
  );

  -- Return success with user ID
  RETURN json_build_object(
    'success', true,
    'user_id', new_user_id,
    'message', 'User created successfully'
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;

-- Create RLS policy for profiles table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Allow admins to insert profiles'
  ) THEN
    CREATE POLICY "Allow admins to insert profiles"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (public.can_manage_users());
  END IF;
END$$;

-- Ensure admins can select all profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Allow admins to select all profiles'
  ) THEN
    CREATE POLICY "Allow admins to select all profiles"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (public.can_manage_users() OR id = auth.uid());
  END IF;
END$$;

-- Ensure admins can update all profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Allow admins to update all profiles'
  ) THEN
    CREATE POLICY "Allow admins to update all profiles"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (public.can_manage_users() OR id = auth.uid());
  END IF;
END$$;
