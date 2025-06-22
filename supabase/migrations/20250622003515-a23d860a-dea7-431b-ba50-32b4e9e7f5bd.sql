
-- Add recurrence fields to the events table
ALTER TABLE public.events 
ADD COLUMN is_recurring boolean DEFAULT false,
ADD COLUMN recurrence_pattern text DEFAULT NULL,
ADD COLUMN recurrence_interval integer DEFAULT 1,
ADD COLUMN recurrence_end_date timestamp with time zone DEFAULT NULL,
ADD COLUMN recurrence_count integer DEFAULT NULL,
ADD COLUMN parent_event_id uuid REFERENCES public.events(id) DEFAULT NULL;

-- Add index for better performance when querying recurring events
CREATE INDEX idx_events_recurring ON public.events(is_recurring, parent_event_id);
CREATE INDEX idx_events_recurrence_pattern ON public.events(recurrence_pattern) WHERE recurrence_pattern IS NOT NULL;

-- Add a function to generate recurring event instances
CREATE OR REPLACE FUNCTION generate_recurring_events(
  p_parent_event_id uuid,
  p_max_instances integer DEFAULT 100
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  parent_event RECORD;
  new_start_time timestamp with time zone;
  new_end_time timestamp with time zone;
  new_call_time timestamp with time zone;
  instance_count integer := 0;
  interval_string text;
BEGIN
  -- Get the parent event details
  SELECT * INTO parent_event 
  FROM public.events 
  WHERE id = p_parent_event_id AND is_recurring = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Parent event not found or not recurring';
  END IF;
  
  -- Build interval string based on pattern and interval
  CASE parent_event.recurrence_pattern
    WHEN 'daily' THEN interval_string := parent_event.recurrence_interval || ' days';
    WHEN 'weekly' THEN interval_string := parent_event.recurrence_interval || ' weeks';
    WHEN 'monthly' THEN interval_string := parent_event.recurrence_interval || ' months';
    WHEN 'yearly' THEN interval_string := parent_event.recurrence_interval || ' years';
    ELSE RAISE EXCEPTION 'Invalid recurrence pattern: %', parent_event.recurrence_pattern;
  END CASE;
  
  -- Generate recurring instances
  new_start_time := parent_event.start_time;
  new_end_time := parent_event.end_time;
  new_call_time := parent_event.call_time;
  
  WHILE (
    (parent_event.recurrence_end_date IS NULL OR new_start_time <= parent_event.recurrence_end_date) AND
    (parent_event.recurrence_count IS NULL OR instance_count < parent_event.recurrence_count) AND
    instance_count < p_max_instances
  ) LOOP
    -- Move to next occurrence
    new_start_time := new_start_time + interval_string::interval;
    new_end_time := new_end_time + interval_string::interval;
    IF new_call_time IS NOT NULL THEN
      new_call_time := new_call_time + interval_string::interval;
    END IF;
    
    -- Check if we should still create this instance
    IF parent_event.recurrence_end_date IS NOT NULL AND new_start_time > parent_event.recurrence_end_date THEN
      EXIT;
    END IF;
    
    -- Insert the recurring instance
    INSERT INTO public.events (
      title, start_time, end_time, call_time, location_name, location_map_url,
      feature_image_url, short_description, full_description, event_host_name,
      event_host_contact, event_types, is_private, is_public, allow_rsvp,
      allow_reminders, allow_ics_download, allow_google_map_link,
      parent_event_id, created_by
    ) VALUES (
      parent_event.title, new_start_time, new_end_time, new_call_time,
      parent_event.location_name, parent_event.location_map_url,
      parent_event.feature_image_url, parent_event.short_description,
      parent_event.full_description, parent_event.event_host_name,
      parent_event.event_host_contact, parent_event.event_types,
      parent_event.is_private, parent_event.is_public, parent_event.allow_rsvp,
      parent_event.allow_reminders, parent_event.allow_ics_download,
      parent_event.allow_google_map_link, p_parent_event_id, parent_event.created_by
    );
    
    instance_count := instance_count + 1;
  END LOOP;
END;
$$;

-- Add a trigger to automatically generate recurring events when a recurring event is created/updated
CREATE OR REPLACE FUNCTION handle_recurring_event_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only process if this is a recurring event and not a child event
  IF NEW.is_recurring = true AND NEW.parent_event_id IS NULL THEN
    -- Delete existing child events if this is an update
    IF TG_OP = 'UPDATE' THEN
      DELETE FROM public.events WHERE parent_event_id = NEW.id;
    END IF;
    
    -- Generate new recurring instances
    PERFORM generate_recurring_events(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_handle_recurring_events ON public.events;
CREATE TRIGGER trigger_handle_recurring_events
  AFTER INSERT OR UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION handle_recurring_event_changes();
