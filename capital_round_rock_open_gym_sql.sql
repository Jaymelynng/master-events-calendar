-- SQL to insert Capital Gymnastics Round Rock Open Gym Events for September 2025
-- Run this in Supabase SQL Editor

-- First, let's check the gym_id for Capital Gymnastics Round Rock
-- SELECT id, name, gym_code FROM gyms WHERE name ILIKE '%round rock%';
-- Replace 'REPLACE_WITH_ACTUAL_GYM_ID' with the actual gym_id from the query above

-- Insert 8 Open Gym events for Capital Gymnastics Round Rock
INSERT INTO events (gym_id, title, date, time, day_of_week, type, event_url, price)
VALUES 
-- Gym Fun Friday 9/5/25 - Friday 10:00 AM - 11:30 AM
(
    (SELECT id FROM gyms WHERE name = 'Capital Gymnastics Round Rock'),
    'Gym Fun Friday 9/5/25',
    '2025-09-05',
    '10:00 AM - 11:30 AM',
    'Friday',
    'OPEN GYM',
    'https://portal.iclasspro.com/capgymroundrock/camp-details/1576?typeId=35&filters=%7B%22sorting%22:%22time%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
    NULL
),

-- Homeschool Open Gym 9/5/25 - Friday 11:30 AM - 1:00 PM  
(
    (SELECT id FROM gyms WHERE name = 'Capital Gymnastics Round Rock'),
    'Homeschool Open Gym 9/5/25',
    '2025-09-05',
    '11:30 AM - 1:00 PM',
    'Friday',
    'OPEN GYM',
    'https://portal.iclasspro.com/capgymroundrock/camp-details/1580?typeId=35&filters=%7B%22sorting%22:%22time%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
    NULL
),

-- Gym Fun Friday 9/12/25 - Friday 10:00 AM - 11:30 AM
(
    (SELECT id FROM gyms WHERE name = 'Capital Gymnastics Round Rock'),
    'Gym Fun Friday 9/12/25',
    '2025-09-12',
    '10:00 AM - 11:30 AM',
    'Friday',
    'OPEN GYM',
    'https://portal.iclasspro.com/capgymroundrock/camp-details/1577?typeId=35&filters=%7B%22sorting%22:%22time%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
    NULL
),

-- Homeschool Open Gym 9/12/25 - Friday 11:30 AM - 1:00 PM
(
    (SELECT id FROM gyms WHERE name = 'Capital Gymnastics Round Rock'),
    'Homeschool Open Gym 9/12/25',
    '2025-09-12',
    '11:30 AM - 1:00 PM',
    'Friday',
    'OPEN GYM',
    'https://portal.iclasspro.com/capgymroundrock/camp-details/1581?typeId=35&filters=%7B%22sorting%22:%22time%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
    NULL
),

-- Gym Fun Friday 9/19/25 - Friday 10:00 AM - 11:30 AM
(
    (SELECT id FROM gyms WHERE name = 'Capital Gymnastics Round Rock'),
    'Gym Fun Friday 9/19/25',
    '2025-09-19',
    '10:00 AM - 11:30 AM',
    'Friday',
    'OPEN GYM',
    'https://portal.iclasspro.com/capgymroundrock/camp-details/1578?typeId=35&filters=%7B%22sorting%22:%22time%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
    NULL
),

-- Homeschool Open Gym 9/19/25 - Friday 11:30 AM - 1:00 PM
(
    (SELECT id FROM gyms WHERE name = 'Capital Gymnastics Round Rock'),
    'Homeschool Open Gym 9/19/25',
    '2025-09-19',
    '11:30 AM - 1:00 PM',
    'Friday',
    'OPEN GYM',
    'https://portal.iclasspro.com/capgymroundrock/camp-details/1582?typeId=35&filters=%7B%22sorting%22:%22time%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
    NULL
),

-- Gym Fun Friday 9/26/25 - Friday 10:00 AM - 11:30 AM
(
    (SELECT id FROM gyms WHERE name = 'Capital Gymnastics Round Rock'),
    'Gym Fun Friday 9/26/25',
    '2025-09-26',
    '10:00 AM - 11:30 AM',
    'Friday',
    'OPEN GYM',
    'https://portal.iclasspro.com/capgymroundrock/camp-details/1579?typeId=35&filters=%7B%22sorting%22:%22time%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
    NULL
),

-- Homeschool Open Gym 9/26/25 - Friday 11:30 AM - 1:00 PM
(
    (SELECT id FROM gyms WHERE name = 'Capital Gymnastics Round Rock'),
    'Homeschool Open Gym 9/26/25',
    '2025-09-26',
    '11:30 AM - 1:00 PM',
    'Friday',
    'OPEN GYM',
    'https://portal.iclasspro.com/capgymroundrock/camp-details/1583?typeId=35&filters=%7B%22sorting%22:%22time%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
    NULL
);

-- Verify the insertions
SELECT 
    e.title, 
    e.date, 
    e.time, 
    e.type, 
    g.name as gym_name,
    e.event_url
FROM events e
JOIN gyms g ON e.gym_id = g.id
WHERE g.name = 'Capital Gymnastics Round Rock' 
    AND e.type = 'OPEN GYM'
    AND e.date >= '2025-09-01' 
    AND e.date <= '2025-09-30'
ORDER BY e.date, e.time;
