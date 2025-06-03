
-- First, completely disable RLS to test if that's the issue
ALTER TABLE public.news_items DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can view all news items" ON public.news_items;
DROP POLICY IF EXISTS "Admins can create news items" ON public.news_items;
DROP POLICY IF EXISTS "Admins can update news items" ON public.news_items;
DROP POLICY IF EXISTS "Admins can delete news items" ON public.news_items;
DROP POLICY IF EXISTS "Public can view active news items" ON public.news_items;

-- Re-enable RLS
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

-- Create simplified policies that avoid subqueries
CREATE POLICY "Allow authenticated users full access" ON public.news_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy for anonymous users to read active items
CREATE POLICY "Anonymous can view active items" ON public.news_items
  FOR SELECT
  TO anon
  USING (active = true);
