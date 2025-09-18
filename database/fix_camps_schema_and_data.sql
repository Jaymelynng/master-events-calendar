-- ========================================
-- FIX CAMPS: Add Date Range Support
-- ========================================
-- This script fixes the camp import issues:
-- 1. Adds start_date and end_date columns
-- 2. Groups camp days into single events
-- 3. Fixes wrong day_of_week calculations

-- Step 1: Add the missing columns for date ranges
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Step 2: Fill start_date and end_date for existing single-day events
-- For existing events, start_date = end_date = date
UPDATE events 
SET start_date = date::date,
    end_date = date::date
WHERE start_date IS NULL OR end_date IS NULL;

-- Step 3: Fix wrong day_of_week calculations
-- The import was showing wrong days (Wednesday for Thursday etc)
UPDATE events 
SET day_of_week = to_char(date::date, 'FMDay')
WHERE day_of_week IS NOT NULL;

-- Step 4: Show camps that need consolidation (for reference only)
-- This identifies multi-day camps that should be consolidated
SELECT 
  gym_id,
  SPLIT_PART(title, '|', 1) as camp_name,
  MIN(date::date) as start_date,
  MAX(date::date) as end_date,
  COUNT(*) as day_count,
  STRING_AGG(title, ' | ' ORDER BY date) as all_titles
FROM events 
WHERE type = 'CAMP' 
  AND title LIKE '%|%'  -- Only process camp titles with separators
GROUP BY gym_id, SPLIT_PART(title, '|', 1)
HAVING COUNT(*) > 1  -- Only camps with multiple days
ORDER BY gym_id, MIN(date::date);

-- Step 5: Show the camps that need consolidation
-- (Run this query first to see what will be affected)

-- Step 5: Manual consolidation will be handled by the updated import logic
-- The React app now automatically consolidates camps during import
-- No manual cleanup needed - just run schema changes above

-- If you need to clean up existing duplicate camps manually, use this pattern:
/*
EXAMPLE: Consolidate "Pumpkin Palooza" camps into one event:

-- 1. Update the first event to have the date range
UPDATE events 
SET title = 'Pumpkin Palooza | School Year Camp | Ages 4-13 | Oct 16-17, 2025 | 9 am-3 pm | $67/day',
    start_date = '2025-10-16',
    end_date = '2025-10-17',
    day_of_week = 'Thursday'
WHERE title LIKE 'Pumpkin Palooza%' 
  AND date = '2025-10-16'
  AND gym_id = 'CCP';

-- 2. Delete the duplicate day(s)
DELETE FROM events 
WHERE title LIKE 'Pumpkin Palooza%' 
  AND date = '2025-10-17'
  AND gym_id = 'CCP';
*/

-- Step 6: Add constraints and indexes
-- Check if constraint already exists before adding
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'events_date_range_check' 
        AND table_name = 'events'
    ) THEN
        ALTER TABLE events 
        ADD CONSTRAINT events_date_range_check 
        CHECK (end_date >= start_date);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_events_date_range 
ON events(start_date, end_date);

-- Step 7: Show summary after cleanup
SELECT 
  'Total Events' as metric,
  COUNT(*) as count
FROM events
UNION ALL
SELECT 
  'Single Day Events',
  COUNT(*)
FROM events 
WHERE start_date = end_date
UNION ALL
SELECT 
  'Multi-Day Events',
  COUNT(*)
FROM events 
WHERE end_date > start_date
UNION ALL
SELECT 
  'Camp Events',
  COUNT(*)
FROM events 
WHERE type = 'CAMP';
