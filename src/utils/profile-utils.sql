
-- SQL to create a function for safely updating a profile with an avatar URL
-- This function will handle the update even if avatar_url column doesn't exist
CREATE OR REPLACE FUNCTION update_profile_avatar(user_id uuid, avatar_url_value text)
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
    SET avatar_url = avatar_url_value,
        updated_at = now()
    WHERE id = user_id;
  ELSE
    -- Column doesn't exist, just update the timestamp
    UPDATE profiles
    SET updated_at = now()
    WHERE id = user_id;
  END IF;
END;
$$;
