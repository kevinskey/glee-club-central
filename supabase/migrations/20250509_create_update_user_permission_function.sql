
-- Function to update a specific user permission
CREATE OR REPLACE FUNCTION public.update_user_permission(
  p_user_id UUID,
  p_permission permission_name,
  p_granted BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role_id UUID;
  v_title user_title;
BEGIN
  -- Get the user's title
  SELECT title INTO v_title FROM public.profiles WHERE id = p_user_id;
  
  IF v_title IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get the role ID for this title
  SELECT id INTO v_role_id FROM public.user_roles WHERE title = v_title;
  
  IF v_role_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if permission exists for this role
  IF EXISTS (
    SELECT 1 FROM public.role_permissions 
    WHERE role_id = v_role_id AND permission = p_permission
  ) THEN
    -- Update existing permission
    UPDATE public.role_permissions
    SET granted = p_granted
    WHERE role_id = v_role_id AND permission = p_permission;
  ELSE
    -- Insert new permission
    INSERT INTO public.role_permissions (role_id, permission, granted)
    VALUES (v_role_id, p_permission, p_granted);
  END IF;
  
  RETURN TRUE;
END;
$$;
