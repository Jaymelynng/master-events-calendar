-- Add start_date and end_date columns to events table for proper calendar display

-- Add the new columns
ALTER TABLE events 
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE;

-- Populate start_date and end_date from existing date column
-- For existing single-day events, start_date = end_date = date
UPDATE events 
SET start_date = date::date,
    end_date = date::date
WHERE start_date IS NULL OR end_date IS NULL;

-- Add NOT NULL constraints after populating data
ALTER TABLE events 
ALTER COLUMN start_date SET NOT NULL,
ALTER COLUMN end_date SET NOT NULL;

-- Add check constraint to ensure end_date >= start_date
ALTER TABLE events 
ADD CONSTRAINT events_date_range_check 
CHECK (end_date >= start_date);

-- Create index for better query performance on date ranges
CREATE INDEX IF NOT EXISTS idx_events_date_range ON events(start_date, end_date);

-- Fix any NULL day_of_week values while we're at it
UPDATE events 
SET day_of_week = to_char(start_date, 'FMDay')
WHERE day_of_week IS NULL 
AND start_date IS NOT NULL;

-- Show summary
SELECT 
    COUNT(*) as total_events,
    COUNT(CASE WHEN start_date = end_date THEN 1 END) as single_day_events,
    COUNT(CASE WHEN end_date > start_date THEN 1 END) as multi_day_events,
    COUNT(CASE WHEN day_of_week IS NULL THEN 1 END) as null_day_of_week
FROM events;
