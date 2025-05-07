
-- Function to update the get_all_users function to include new fields
CREATE OR REPLACE FUNCTION public.update_get_all_users_function()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Drop existing function
  DROP FUNCTION IF EXISTS public.get_all_users();
  
  -- Recreate function with new fields
  CREATE OR REPLACE FUNCTION public.get_all_users()
  RETURNS TABLE(
    id uuid, 
    email text, 
    first_name text, 
    last_name text, 
    phone text, 
    role text, 
    voice_part text, 
    avatar_url text, 
    status text, 
    join_date date, 
    created_at timestamp with time zone, 
    last_sign_in_at timestamp with time zone, 
    role_display_name text, 
    voice_part_display text,
    class_year text,
    dues_paid boolean,
    notes text,
    special_roles text
  )
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $func$
  BEGIN
    RETURN QUERY
    SELECT
      p.id,
      u.email::text,
      p.first_name::text,
      p.last_name::text,
      p.phone::text,
      p.role::text,
      p.voice_part::text,
      p.avatar_url::text,
      p.status::text,
      p.join_date,
      u.created_at,
      u.last_sign_in_at,
      CASE
        WHEN p.role = 'administrator' THEN 'Administrator'::text
        WHEN p.role = 'section_leader' THEN 'Section Leader'::text
        WHEN p.role = 'singer' THEN 'Singer'::text
        WHEN p.role = 'student_conductor' THEN 'Student Conductor'::text
        WHEN p.role = 'accompanist' THEN 'Accompanist'::text
        WHEN p.role = 'non_singer' THEN 'Non-Singer'::text
        ELSE p.role::text
      END as role_display_name,
      CASE
        WHEN p.voice_part = 'soprano_1' THEN 'Soprano 1'::text
        WHEN p.voice_part = 'soprano_2' THEN 'Soprano 2'::text
        WHEN p.voice_part = 'alto_1' THEN 'Alto 1'::text
        WHEN p.voice_part = 'alto_2' THEN 'Alto 2'::text
        WHEN p.voice_part = 'tenor' THEN 'Tenor'::text
        WHEN p.voice_part = 'bass' THEN 'Bass'::text
        ELSE NULL
      END as voice_part_display,
      p.class_year::text,
      p.dues_paid,
      p.notes::text,
      p.special_roles::text
    FROM
      public.profiles p
    LEFT JOIN
      auth.users u ON p.id = u.id
    ORDER BY
      p.last_name, p.first_name;
  END;
  $func$;
END;
$$;

-- Function to update the get_user_by_id function to include new fields
CREATE OR REPLACE FUNCTION public.update_get_user_by_id_function()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Drop existing function
  DROP FUNCTION IF EXISTS public.get_user_by_id(p_user_id uuid);
  
  -- Recreate function with new fields
  CREATE OR REPLACE FUNCTION public.get_user_by_id(p_user_id uuid)
  RETURNS TABLE(
    id uuid, 
    email text, 
    first_name text, 
    last_name text, 
    phone text, 
    role text, 
    voice_part text, 
    avatar_url text, 
    status text, 
    join_date date, 
    created_at timestamp with time zone, 
    last_sign_in_at timestamp with time zone, 
    role_display_name text, 
    voice_part_display text,
    class_year text,
    dues_paid boolean,
    notes text,
    special_roles text
  )
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $func$
  BEGIN
    RETURN QUERY
    SELECT
      p.id,
      u.email::text,
      p.first_name::text,
      p.last_name::text,
      p.phone::text,
      p.role::text,
      p.voice_part::text,
      p.avatar_url::text,
      p.status::text,
      p.join_date,
      u.created_at,
      u.last_sign_in_at,
      CASE
        WHEN p.role = 'administrator' THEN 'Administrator'::text
        WHEN p.role = 'section_leader' THEN 'Section Leader'::text
        WHEN p.role = 'singer' THEN 'Singer'::text
        WHEN p.role = 'student_conductor' THEN 'Student Conductor'::text
        WHEN p.role = 'accompanist' THEN 'Accompanist'::text
        WHEN p.role = 'non_singer' THEN 'Non-Singer'::text
        ELSE p.role::text
      END as role_display_name,
      CASE
        WHEN p.voice_part = 'soprano_1' THEN 'Soprano 1'::text
        WHEN p.voice_part = 'soprano_2' THEN 'Soprano 2'::text
        WHEN p.voice_part = 'alto_1' THEN 'Alto 1'::text
        WHEN p.voice_part = 'alto_2' THEN 'Alto 2'::text
        WHEN p.voice_part = 'tenor' THEN 'Tenor'::text
        WHEN p.voice_part = 'bass' THEN 'Bass'::text
        ELSE NULL
      END as voice_part_display,
      p.class_year::text,
      p.dues_paid,
      p.notes::text,
      p.special_roles::text
    FROM
      public.profiles p
    LEFT JOIN
      auth.users u ON p.id = u.id
    WHERE
      p.id = p_user_id;
  END;
  $func$;
END;
$$;
