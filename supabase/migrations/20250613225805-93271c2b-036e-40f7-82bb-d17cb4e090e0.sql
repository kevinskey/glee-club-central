
-- Add the show_title column to the hero_slides table
ALTER TABLE public.hero_slides 
ADD COLUMN show_title BOOLEAN DEFAULT true;

-- Update existing records to have show_title = true by default
UPDATE public.hero_slides 
SET show_title = true 
WHERE show_title IS NULL;
