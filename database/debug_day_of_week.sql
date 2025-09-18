-- Debug: Check events with missing day_of_week
-- All recent imports should have day_of_week calculated

-- 1. Count events with NULL day_of_week (should be 0 if all recent)
SELECT 'NULL day_of_week count:' as info, COUNT(*) 
FROM events 
WHERE day_of_week IS NULL;

-- 2. Show recent events with NULL day_of_week to see the pattern
SELECT gym_id, title, date, day_of_week, created_at
FROM events 
WHERE day_of_week IS NULL 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Check if dates are valid format
SELECT gym_id, title, date, 
       EXTRACT(DOW FROM date::date) as day_number,
       to_char(date::date, 'FMDay') as calculated_day
FROM events 
WHERE day_of_week IS NULL 
LIMIT 5;
