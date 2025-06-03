
-- Enable RLS on news_items table
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to select all news items
CREATE POLICY "Admins can view all news items" ON public.news_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (is_super_admin = true OR role = 'admin')
    )
  );

-- Policy to allow admins to insert news items
CREATE POLICY "Admins can create news items" ON public.news_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (is_super_admin = true OR role = 'admin')
    )
  );

-- Policy to allow admins to update news items
CREATE POLICY "Admins can update news items" ON public.news_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (is_super_admin = true OR role = 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (is_super_admin = true OR role = 'admin')
    )
  );

-- Policy to allow admins to delete news items
CREATE POLICY "Admins can delete news items" ON public.news_items
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (is_super_admin = true OR role = 'admin')
    )
  );

-- Policy to allow public read access to active news items (for the news ticker)
CREATE POLICY "Public can view active news items" ON public.news_items
  FOR SELECT
  USING (active = true);
