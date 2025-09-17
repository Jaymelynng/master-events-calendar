-- First, delete ALL Cedar Park Kids Night Out entries (we'll re-import correctly)
DELETE FROM events
WHERE gym_id = 'CEP' 
  AND type = 'KIDS NIGHT OUT';

-- Check what's left
SELECT gym_id, type, COUNT(*) as count
FROM events
WHERE gym_id = 'CEP'
GROUP BY gym_id, type;

-- Also clean up any other duplicates across all gyms
DELETE FROM events
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY gym_id, date, time, type 
             ORDER BY created_at
           ) as rn
    FROM events
  ) duplicates
  WHERE rn > 1
);

-- Final check - show all events with NULL titles
SELECT gym_id, date, time, type, event_url
FROM events
WHERE title IS NULL
ORDER BY gym_id, date;
