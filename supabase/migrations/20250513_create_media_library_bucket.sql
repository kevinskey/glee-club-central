
-- Create media-library bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('media-library', 'Media Library Files', TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Set liberal RLS policies for the media-library bucket
-- Allow any authenticated user to upload files
CREATE POLICY "Anyone can upload media" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'media-library');

-- Allow any authenticated user to update their own files
CREATE POLICY "Anyone can update their own media" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'media-library' AND owner = auth.uid());

-- Allow anyone to read public media files
CREATE POLICY "Anyone can view media" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'media-library');

-- Allow authenticated users to delete their own files
CREATE POLICY "Anyone can delete their own media" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'media-library' AND owner = auth.uid());

-- Update RLS for media_library table to match storage policies
-- Any authenticated user can insert media files
CREATE POLICY "Any authenticated user can insert media"
ON public.media_library
FOR INSERT
TO authenticated
WITH CHECK (uploaded_by = auth.uid());

-- Users can view all media
CREATE POLICY "Users can view all media"
ON public.media_library
FOR SELECT
TO authenticated
USING (true);

-- Users can update their own media files
CREATE POLICY "Users can update their own media"
ON public.media_library
FOR UPDATE
TO authenticated
USING (uploaded_by = auth.uid());

-- Users can delete their own media files
CREATE POLICY "Users can delete their own media"
ON public.media_library
FOR DELETE
TO authenticated
USING (uploaded_by = auth.uid());
