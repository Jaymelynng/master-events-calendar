-- Create separate camps table for proper camp management
-- This separates camps from monthly requirement events

-- Create the camps table
CREATE TABLE IF NOT EXISTS camps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gym_id TEXT,
  title TEXT,
  start_date DATE,
  end_date DATE,
  time TEXT,
  price DECIMAL(8,2),
  age_range TEXT,
  camp_type TEXT,
  camp_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_camps_gym_id ON camps(gym_id);
CREATE INDEX IF NOT EXISTS idx_camps_date_range ON camps(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_camps_gym_date ON camps(gym_id, start_date);

-- Add constraint to ensure end_date >= start_date
ALTER TABLE camps 
ADD CONSTRAINT camps_date_range_check 
CHECK (end_date >= start_date);

-- Create a view that combines camps with gym information (like events_with_gym)
-- First check what columns exist in gyms table
SELECT column_name FROM information_schema.columns WHERE table_name = 'gyms';

-- Create view without gym_code since that column doesn't exist
CREATE OR REPLACE VIEW camps_with_gym AS
SELECT 
  c.*,
  g.name as gym_name,
  g.id as gym_table_id,
  (end_date - start_date + 1) as duration_days,
  CASE 
    WHEN start_date = end_date THEN 'Single Day'
    ELSE (end_date - start_date + 1) || ' Days'
  END as duration_text
FROM camps c
LEFT JOIN gyms g ON c.gym_id = g.id
ORDER BY c.start_date, c.gym_id;

-- Migration: Move existing camp events to camps table
INSERT INTO camps (gym_id, title, start_date, end_date, time, price, camp_url, age_range, camp_type)
SELECT 
  gym_id,
  title,
  COALESCE(start_date, date::date) as start_date,
  COALESCE(end_date, date::date) as end_date,
  time,
  CASE 
    WHEN price IS NULL THEN NULL
    WHEN price::text ~ '^[0-9]+\.?[0-9]*$' THEN price::numeric
    ELSE NULL
  END as price,
  event_url as camp_url,
  -- Extract age range from title
  CASE 
    WHEN title ~* 'Ages?\s+(\d+)-(\d+)' THEN 
      'Ages ' || (regexp_match(title, 'Ages?\s+(\d+)-(\d+)', 'i'))[1] || '-' || (regexp_match(title, 'Ages?\s+(\d+)-(\d+)', 'i'))[2]
    WHEN title ~* 'Ages?\s+(\d+)\+' THEN 
      'Ages ' || (regexp_match(title, 'Ages?\s+(\d+)\+', 'i'))[1] || '+'
    ELSE 'All Ages'
  END as age_range,
  -- Determine camp type from title or time
  CASE 
    WHEN title ~* 'half.?day|9.*AM.*12.*PM' THEN 'half_day'
    ELSE 'full_day'
  END as camp_type
FROM events 
WHERE type = 'CAMP';

-- Show what was migrated
SELECT 
  gym_id,
  title,
  start_date,
  end_date,
  duration_days,
  age_range,
  camp_type
FROM camps_with_gym
ORDER BY start_date
LIMIT 10;

-- Clean up: Remove camps from events table (optional - uncomment if you want)
-- DELETE FROM events WHERE type = 'CAMP';
