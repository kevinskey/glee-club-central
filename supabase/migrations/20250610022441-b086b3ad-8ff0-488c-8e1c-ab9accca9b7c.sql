
-- Add a new column to store YouTube URLs separately from media_id
ALTER TABLE public.hero_slides 
ADD COLUMN IF NOT EXISTS youtube_url text;

-- Update the table to allow media_id to be null when using YouTube URLs
-- The media_id will remain for media library files (UUIDs)
-- The youtube_url will store YouTube embed URLs
