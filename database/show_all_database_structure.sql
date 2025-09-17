-- COMPLETE DATABASE STRUCTURE QUERY
-- This will show every table, column, data type, and constraint

-- 1. Show all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Show complete structure of each table
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.character_maximum_length,
    c.is_nullable,
    c.column_default
FROM information_schema.tables t
JOIN information_schema.columns c 
    ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
ORDER BY t.table_name, c.ordinal_position;

-- 3. Show sample data from key tables
-- Gyms table (to see gym IDs)
SELECT * FROM gyms ORDER BY id;

-- Event types
SELECT * FROM event_types ORDER BY name;

-- Monthly requirements
SELECT * FROM monthly_requirements;

-- Sample events (first 5)
SELECT * FROM events LIMIT 5;
