
-- SQL to create a function for safely updating a profile with an avatar URL
-- This function will handle the update even if avatar_url column doesn't exist
CREATE OR REPLACE FUNCTION update_profile_avatar(p_user_id uuid, p_avatar_url text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the column exists in the table
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'profiles'
    AND column_name = 'avatar_url'
  ) THEN
    -- Column exists, update it
    UPDATE profiles
    SET avatar_url = p_avatar_url,
        updated_at = now()
    WHERE id = p_user_id;
  ELSE
    -- Column doesn't exist, just update the timestamp
    UPDATE profiles
    SET updated_at = now()
    WHERE id = p_user_id;
  END IF;
END;
$$;
