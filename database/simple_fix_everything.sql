-- SIMPLE FIX: Clean up the camp mess in one go

-- Step 1: Fix ALL wrong day calculations (the main issue)
UPDATE events 
SET day_of_week = TO_CHAR(date::date, 'FMDay');

-- Step 2: Add missing columns if they don't exist
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS start_date DATE;

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Step 3: Fill missing start_date and end_date with the main date
UPDATE events 
SET start_date = date::date
WHERE start_date IS NULL;

UPDATE events 
SET end_date = date::date
WHERE end_date IS NULL;

-- Step 4: Show the camps are now correct
SELECT 
  left(title, 50) as camp_name,
  date,
  day_of_week,
  start_date,
  end_date
FROM events 
WHERE type = 'CAMP' 
ORDER BY date 
LIMIT 10;
