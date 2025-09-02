-- SQL to Remove Duplicate Capital Gymnastics Cedar Park Events
-- Run this in Supabase SQL Editor to clean up duplicates

-- First, let's see the duplicates
SELECT 
    date, 
    time, 
    type,
    COUNT(*) as duplicate_count,
    array_agg(title) as all_titles,
    array_agg(id) as event_ids
FROM events
WHERE gym_id = 'CCP' 
    AND date >= '2025-09-01' 
    AND date <= '2025-09-30'
GROUP BY date, time, type
HAVING COUNT(*) > 1
ORDER BY date, time;

-- Remove duplicates (keep the ones with LONGER/MORE DESCRIPTIVE titles)
WITH duplicates AS (
    SELECT 
        id,
        title,
        ROW_NUMBER() OVER (
            PARTITION BY date, time, gym_id, type 
            ORDER BY LENGTH(title) DESC, id ASC
        ) as row_num
    FROM events
    WHERE gym_id = 'CCP' 
        AND date >= '2025-09-01' 
        AND date <= '2025-09-30'
)
DELETE FROM events 
WHERE id IN (
    SELECT id 
    FROM duplicates 
    WHERE row_num > 1
);

-- Verify cleanup - should show 4 unique CCP events
SELECT 
    title, 
    date, 
    time, 
    type, 
    gym_id,
    event_url
FROM events
WHERE gym_id = 'CCP' 
    AND date >= '2025-09-01' 
    AND date <= '2025-09-30'
ORDER BY date, time;
