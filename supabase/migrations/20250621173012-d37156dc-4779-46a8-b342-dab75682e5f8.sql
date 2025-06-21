
-- Add spacing_settings column to hero_settings table
ALTER TABLE hero_settings 
ADD COLUMN spacing_settings JSONB DEFAULT '{
  "topPadding": 0,
  "bottomPadding": 0,
  "leftPadding": 0,
  "rightPadding": 0,
  "topMargin": 0,
  "bottomMargin": 0,
  "minHeight": 60,
  "maxHeight": 100
}'::jsonb;
