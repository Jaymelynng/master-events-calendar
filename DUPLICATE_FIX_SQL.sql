-- SQL to clean up ALL duplicate events across all gyms
-- This keeps the FIRST occurrence of each event and deletes newer duplicates

DELETE FROM events
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY gym_id, date, time, type, event_url 
             ORDER BY created_at
           ) as rn
    FROM events
  ) duplicates
  WHERE rn > 1
);

-- After running this, check how many events remain:
SELECT gym_id, COUNT(*) as event_count
FROM events
GROUP BY gym_id
ORDER BY gym_id;
