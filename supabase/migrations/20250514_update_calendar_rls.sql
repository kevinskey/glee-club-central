
-- Update the Row Level Security policies for calendar_events table to make it more permissive

-- First drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can create their own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can update their own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can delete their own events" ON public.calendar_events;

-- Create new more permissive policies
-- Allow any authenticated user to view all events
CREATE POLICY "Authenticated users can view all events" 
  ON public.calendar_events 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Allow any authenticated user to create events
CREATE POLICY "Authenticated users can create events" 
  ON public.calendar_events 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow any authenticated user to update their own events
CREATE POLICY "Authenticated users can update their own events" 
  ON public.calendar_events 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id OR pg_has_role(auth.uid(), 'authenticated', 'member'));

-- Allow any authenticated user to delete their own events
CREATE POLICY "Authenticated users can delete their own events" 
  ON public.calendar_events 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id OR pg_has_role(auth.uid(), 'authenticated', 'member'));
