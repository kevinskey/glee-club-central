
-- Drop all existing policies that might be causing the issue
DROP POLICY IF EXISTS "Admins can view all news items" ON public.news_items;
DROP POLICY IF EXISTS "Admins can create news items" ON public.news_items;
DROP POLICY IF EXISTS "Admins can update news items" ON public.news_items;
DROP POLICY IF EXISTS "Admins can delete news items" ON public.news_items;
DROP POLICY IF EXISTS "Public can view active news items" ON public.news_items;

-- Create new policies that only check the profiles table
CREATE POLICY "Admins can view all news items" ON public.news_items
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE (is_super_admin = true OR role = 'admin')
    )
  );

CREATE POLICY "Admins can create news items" ON public.news_items
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE (is_super_admin = true OR role = 'admin')
    )
  );

CREATE POLICY "Admins can update news items" ON public.news_items
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE (is_super_admin = true OR role = 'admin')
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE (is_super_admin = true OR role = 'admin')
    )
  );

CREATE POLICY "Admins can delete news items" ON public.news_items
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE (is_super_admin = true OR role = 'admin')
    )
  );

CREATE POLICY "Public can view active news items" ON public.news_items
  FOR SELECT
  USING (active = true);
