-- Check what's wrong with the camp data after our "fix"

-- 1. Check if start_date and end_date were properly populated
SELECT 
  'Missing start_date' as issue,
  COUNT(*) as count
FROM events 
WHERE start_date IS NULL
UNION ALL
SELECT 
  'Missing end_date' as issue,
  COUNT(*) as count
FROM events 
WHERE end_date IS NULL
UNION ALL
SELECT 
  'NULL day_of_week' as issue,
  COUNT(*) as count
FROM events 
WHERE day_of_week IS NULL;

-- 2. Check for wrong day calculations (camps on Sunday)
SELECT 
  title,
  date,
  day_of_week,
  EXTRACT(DOW FROM date::date) as actual_dow,
  TO_CHAR(date::date, 'FMDay') as correct_day,
  start_date,
  end_date
FROM events 
WHERE type = 'CAMP' 
  AND day_of_week = 'Sunday'
ORDER BY date
LIMIT 10;

-- 3. Show a sample of camp events to see the mess
SELECT 
  gym_id,
  title,
  date,
  day_of_week,
  start_date,
  end_date,
  EXTRACT(DOW FROM date::date) as actual_dow,
  TO_CHAR(date::date, 'FMDay') as correct_day
FROM events 
WHERE type = 'CAMP'
ORDER BY date
LIMIT 15;
