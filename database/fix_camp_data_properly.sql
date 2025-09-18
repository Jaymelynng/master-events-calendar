-- PROPER FIX FOR CAMP DATA MESS
-- This will clean up the wrong day calculations and populate missing columns

-- Step 1: Fill missing start_date and end_date for ALL events
UPDATE events 
SET start_date = date::date
WHERE start_date IS NULL;

UPDATE events 
SET end_date = date::date
WHERE end_date IS NULL;

-- Step 2: Fix ALL wrong day_of_week calculations
-- The issue is the calculation was wrong during import
UPDATE events 
SET day_of_week = TO_CHAR(date::date, 'FMDay')
WHERE day_of_week IS NOT NULL;

-- Step 3: Show the camps that were showing wrong days
SELECT 
  'BEFORE FIX: Wrong day examples' as status,
  COUNT(*) as camps_with_sunday
FROM events 
WHERE type = 'CAMP' 
  AND day_of_week = 'Sunday'
  AND EXTRACT(DOW FROM date::date) != 0; -- Sunday = 0

-- Step 4: Now fix those specifically
UPDATE events 
SET day_of_week = TO_CHAR(date::date, 'FMDay')
WHERE type = 'CAMP';

-- Step 5: Verify the fix worked
SELECT 
  title,
  date,
  day_of_week,
  TO_CHAR(date::date, 'FMDay') as should_be,
  start_date,
  end_date
FROM events 
WHERE type = 'CAMP'
  AND day_of_week != TO_CHAR(date::date, 'FMDay')
LIMIT 5;

-- Step 6: Show summary of camps by actual day
SELECT 
  TO_CHAR(date::date, 'FMDay') as actual_day,
  COUNT(*) as camp_count
FROM events 
WHERE type = 'CAMP'
GROUP BY TO_CHAR(date::date, 'FMDay'), EXTRACT(DOW FROM date::date)
ORDER BY EXTRACT(DOW FROM date::date);

-- Step 7: Final verification - should show no issues
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ All start_date populated'
    ELSE '❌ ' || COUNT(*) || ' events missing start_date'
  END as start_date_status
FROM events WHERE start_date IS NULL
UNION ALL
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ All end_date populated'
    ELSE '❌ ' || COUNT(*) || ' events missing end_date'
  END as end_date_status
FROM events WHERE end_date IS NULL
UNION ALL
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ All day_of_week correct'
    ELSE '❌ ' || COUNT(*) || ' events with wrong day_of_week'
  END as day_status
FROM events WHERE day_of_week != TO_CHAR(date::date, 'FMDay');
