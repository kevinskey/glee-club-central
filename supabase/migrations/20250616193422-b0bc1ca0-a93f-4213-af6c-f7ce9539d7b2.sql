
-- Drop the existing constraint
ALTER TABLE hero_slides DROP CONSTRAINT IF EXISTS hero_slides_text_position_check;

-- Add a new constraint that allows all the position values we use
ALTER TABLE hero_slides ADD CONSTRAINT hero_slides_text_position_check 
CHECK (text_position IN (
  'top-left', 'top-center', 'top-right',
  'center-left', 'center', 'center-right', 
  'bottom-left', 'bottom-center', 'bottom-right'
));
