-- FIX CEDAR PARK KNO EVENTS
-- This script will:
-- 1. Remove duplicate events
-- 2. Fix the gym_id to use proper UUID instead of "CCP"

-- First, let's see what the correct gym_id should be
SELECT id, name, code FROM gyms WHERE name = 'Capital Gymnastics Cedar Park';

-- Delete duplicates, keeping only one of each event
-- We'll keep the one with the earlier created_at timestamp
DELETE FROM events
WHERE id IN (
  -- Find duplicate IDs to delete
  SELECT id FROM (
    SELECT 
      id,
      event_url,
      date,
      ROW_NUMBER() OVER (
        PARTITION BY event_url, date 
        ORDER BY created_at
      ) as rn
    FROM events
    WHERE gym_id = 'CCP'
    AND type = 'KIDS NIGHT OUT'
  ) duplicates
  WHERE rn > 1
);

-- Now update the gym_id from 'CCP' to the correct UUID
-- Replace 'YOUR_CORRECT_GYM_UUID' with the actual UUID from the first query
UPDATE events
SET gym_id = (SELECT id FROM gyms WHERE name = 'Capital Gymnastics Cedar Park' LIMIT 1)
WHERE gym_id = 'CCP';

-- Verify the fixes
SELECT 
  COUNT(*) as total_events,
  COUNT(DISTINCT event_url) as unique_events,
  gym_id
FROM events
WHERE type = 'KIDS NIGHT OUT'
AND gym_id IN (
  SELECT id FROM gyms WHERE name = 'Capital Gymnastics Cedar Park'
)
GROUP BY gym_id;
