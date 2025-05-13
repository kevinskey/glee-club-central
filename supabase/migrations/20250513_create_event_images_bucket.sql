
-- Create event-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('event-images', 'Event Images', TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Set liberal RLS policies for the event-images bucket
-- Allow any authenticated user to upload files
CREATE POLICY "Anyone can upload event images" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'event-images');

-- Allow any authenticated user to update their own files
CREATE POLICY "Anyone can update their own event images" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'event-images' AND owner = auth.uid());

-- Allow anyone to read event images
CREATE POLICY "Anyone can view event images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'event-images');

-- Allow authenticated users to delete their own files
CREATE POLICY "Anyone can delete their own event images" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'event-images' AND owner = auth.uid());
