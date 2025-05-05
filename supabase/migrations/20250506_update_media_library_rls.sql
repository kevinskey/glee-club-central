
-- Update RLS policies for media_library to allow any authenticated user to upload media

-- Create a policy for any authenticated user to insert media files
CREATE POLICY IF NOT EXISTS "Any authenticated user can insert media"
ON public.media_library
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create a policy for any authenticated user to update their own media files
CREATE POLICY IF NOT EXISTS "Users can update their own media"
ON public.media_library
FOR UPDATE
TO authenticated
USING (uploaded_by = auth.uid());
