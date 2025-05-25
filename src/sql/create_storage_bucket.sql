
-- Create storage bucket for member uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('member-uploads', 'member-uploads', false);

-- Create storage policies for member uploads
CREATE POLICY "Members can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'member-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Members can view their own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'member-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Members can delete their own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'member-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Admin policies for member uploads
CREATE POLICY "Admins can view all member uploads" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'member-uploads' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_super_admin = true)
  );

CREATE POLICY "Admins can delete member uploads" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'member-uploads' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_super_admin = true)
  );
