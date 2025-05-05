
-- Enable Row Level Security on media_library table
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Create a policy for admin users to read all media files
CREATE POLICY "Admin users can view all media"
ON public.media_library
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create a policy for regular users to view only their own files
CREATE POLICY "Users can view their own media"
ON public.media_library
FOR SELECT
TO authenticated
USING (uploaded_by = auth.uid());

-- Create a policy for admin users to insert media files
CREATE POLICY "Admin users can insert media"
ON public.media_library
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create a policy for admin users to update media files
CREATE POLICY "Admin users can update media"
ON public.media_library
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create a policy for admin users to delete media files
CREATE POLICY "Admin users can delete media"
ON public.media_library
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create a policy for regular users to delete their own media files
CREATE POLICY "Users can delete their own media"
ON public.media_library
FOR DELETE
TO authenticated
USING (uploaded_by = auth.uid());
