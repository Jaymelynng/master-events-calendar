-- Check how camps are actually structured in the database
-- and if we have conflicting date columns

-- 1. Show the actual events table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'events' 
  AND column_name IN ('date', 'start_date', 'end_date', 'day_of_week')
ORDER BY ordinal_position;

-- 2. Show a sample camp event to see all the date fields
SELECT 
  title,
  date,
  start_date,
  end_date,
  day_of_week,
  type
FROM events 
WHERE type = 'CAMP' 
LIMIT 3;

-- 3. Check if we have camps with different start_date vs date
SELECT 
  'Camps where start_date != date' as issue,
  COUNT(*) as count
FROM events 
WHERE type = 'CAMP' 
  AND start_date::text != date::text
UNION ALL
SELECT 
  'Camps where end_date != date' as issue,
  COUNT(*) as count
FROM events 
WHERE type = 'CAMP' 
  AND end_date::text != date::text
UNION ALL
SELECT 
  'Camps where end_date > start_date' as issue,
  COUNT(*) as count
FROM events 
WHERE type = 'CAMP' 
  AND end_date > start_date;



