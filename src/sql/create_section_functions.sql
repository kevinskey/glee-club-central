
-- Function to update a section
CREATE OR REPLACE FUNCTION update_section(
  p_id UUID,
  p_name TEXT,
  p_description TEXT,
  p_section_leader_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE sections
  SET 
    name = p_name,
    description = p_description,
    section_leader_id = p_section_leader_id,
    updated_at = NOW()
  WHERE id = p_id;
END;
$$;

-- Function to create a new section
CREATE OR REPLACE FUNCTION create_section(
  p_name TEXT,
  p_description TEXT,
  p_section_leader_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO sections (
    name,
    description,
    section_leader_id,
    created_at
  ) VALUES (
    p_name,
    p_description,
    p_section_leader_id,
    NOW()
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Function to delete a section and update related profiles
CREATE OR REPLACE FUNCTION delete_section(
  p_section_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- First update profiles to remove this section_id
  UPDATE profiles 
  SET section_id = NULL
  WHERE section_id = p_section_id;
  
  -- Then delete the section
  DELETE FROM sections 
  WHERE id = p_section_id;
END;
$$;
