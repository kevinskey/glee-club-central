
-- Update the handle_new_user function to include the role from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER set search_path = ''
AS $$
begin
  insert into public.profiles (id, first_name, last_name, role)
  values (
    new.id, 
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name',
    coalesce(new.raw_user_meta_data ->> 'role', 'member') -- Use 'member' as default if not provided
  );
  return new;
end;
$$;
