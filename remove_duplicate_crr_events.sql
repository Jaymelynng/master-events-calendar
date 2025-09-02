-- SQL to Remove Duplicate Capital Gymnastics Round Rock Events
-- Run this in Supabase SQL Editor to clean up duplicates

-- First, let's see the duplicates
SELECT 
    title, 
    date, 
    time, 
    COUNT(*) as duplicate_count,
    array_agg(id) as event_ids
FROM events
WHERE gym_id = 'CRR' 
    AND type = 'OPEN GYM'
    AND date >= '2025-09-01' 
    AND date <= '2025-09-30'
GROUP BY title, date, time
HAVING COUNT(*) > 1
ORDER BY date, time;

-- Remove duplicates (keep only the first occurrence of each event)
WITH duplicates AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY title, date, time, gym_id, type 
            ORDER BY id
        ) as row_num
    FROM events
    WHERE gym_id = 'CRR' 
        AND type = 'OPEN GYM'
        AND date >= '2025-09-01' 
        AND date <= '2025-09-30'
)
DELETE FROM events 
WHERE id IN (
    SELECT id 
    FROM duplicates 
    WHERE row_num > 1
);

-- Verify cleanup - should show 8 unique events
SELECT 
    title, 
    date, 
    time, 
    type, 
    gym_id,
    event_url
FROM events
WHERE gym_id = 'CRR' 
    AND type = 'OPEN GYM'
    AND date >= '2025-09-01' 
    AND date <= '2025-09-30'
ORDER BY date, time;
