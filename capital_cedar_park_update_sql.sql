-- SQL to update Capital Gymnastics Cedar Park Events for September 2025
-- Run this in Supabase SQL Editor

-- First, let's see what CCP events currently exist for September 2025
SELECT 
    title, 
    date, 
    time, 
    type,
    event_url
FROM events
WHERE gym_id = 'CCP' 
    AND date >= '2025-09-01' 
    AND date <= '2025-09-30'
ORDER BY date, time;

-- Clear existing CCP September events (if any need replacing)
-- DELETE FROM events 
-- WHERE gym_id = 'CCP' 
--     AND date >= '2025-09-01' 
--     AND date <= '2025-09-30';

-- Insert updated CCP September 2025 events
INSERT INTO events (gym_id, title, date, time, day_of_week, type, event_url, price)
VALUES 
-- Kids Night Out September 12 - Friday 6:30 PM - 9:30 PM
(
    'CCP',
    'Kids Night Out | Ages 4-13 | September 12, 2025 | 6:30-9:30 pm',
    '2025-09-12',
    '6:30 PM - 9:30 PM',
    'Friday',
    'KIDS NIGHT OUT',
    'https://portal.iclasspro.com/capgymavery/camp-details/1160?typeId=13&filters=%7B%22sorting%22:%22time%22%7D&campTypeName=KIDS%20NIGHT%20OUT&campTypeNamePlural=KIDS%20NIGHT%20OUT',
    35.00
),

-- Kids Night Out September 19 - Friday 6:30 PM - 9:30 PM  
(
    'CCP',
    'Kids Night Out | Ages 4-13 | September 19, 2025 | 6:30-9:30 pm',
    '2025-09-19',
    '6:30 PM - 9:30 PM',
    'Friday',
    'KIDS NIGHT OUT',
    'https://portal.iclasspro.com/capgymavery/camp-details/1161?typeId=13&filters=%7B%22sorting%22:%22time%22%7D&campTypeName=KIDS%20NIGHT%20OUT&campTypeNamePlural=KIDS%20NIGHT%20OUT',
    35.00
),

-- Gym Fun Fridays September 5 - Friday 10:30 AM - 12:00 PM
(
    'CCP',
    'Gym Fun Fridays | Open Gym | Ages 1-5 | September 5, 2025 | 10:30am -12:00pm',
    '2025-09-05',
    '10:30 AM - 12:00 PM',
    'Friday',
    'OPEN GYM',
    'https://portal.iclasspro.com/capgymavery/camp-details/1138?typeId=17&filters=%7B%22sorting%22:%22time%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
    NULL
),

-- Gym Fun Fridays September 12 - Friday 10:30 AM - 12:00 PM
(
    'CCP',
    'Gym Fun Fridays | Open Gym | Ages 1-5 | September 12, 2025 | 10:30am -12:00pm',
    '2025-09-12',
    '10:30 AM - 12:00 PM',
    'Friday',
    'OPEN GYM',
    'https://portal.iclasspro.com/capgymavery/camp-details/1164?typeId=17&filters=%7B%22sorting%22:%22time%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
    NULL
);

-- Verify the new CCP events
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
