-- Step 1: Add 'camps' to link_types table first (required for foreign key)
-- Based on your existing link_types structure
INSERT INTO link_types (id, label, display_label, emoji, category, sort_order, is_active, created_at, updated_at) 
VALUES ('camps', 'Camps', '🏕️ Camps', '🏕️', 'special', 6, true, NOW(), NOW());

-- Step 2: Add camp URLs for each gym based on the URLs you provided
-- Including all required columns: gym_id, link_type_id, url, title, description, is_active, sort_order, created_at, updated_at
INSERT INTO gym_links (gym_id, link_type_id, url, title, description, is_active, sort_order, created_at, updated_at) VALUES
-- Capital Gymnastics Cedar Park (uses booking page for camps)
('CCP', 'camps', 'https://portal.iclasspro.com/capgymavery/booking', NULL, NULL, true, 1, NOW(), NOW()),

-- Capital Gymnastics Pflugerville (has specific camp page)
('CPF', 'camps', 'https://portal.iclasspro.com/capgymhp/camps/73?sortBy=time', NULL, NULL, true, 1, NOW(), NOW()),

-- Capital Gymnastics Round Rock (uses booking page for camps)
('CRR', 'camps', 'https://portal.iclasspro.com/capgymroundrock/booking', NULL, NULL, true, 1, NOW(), NOW()),

-- Estrella Gymnastics - Full Day Camps (you showed 2 camp pages, using the first one)
('EST', 'camps', 'https://portal.iclasspro.com/estrellagymnastics/camps/25?sortBy=time', NULL, NULL, true, 1, NOW(), NOW()),

-- Houston Gymnastics Academy (uses booking page for camps)
('HGA', 'camps', 'https://portal.iclasspro.com/houstongymnastics/booking', NULL, NULL, true, 1, NOW(), NOW()),

-- Oasis Gymnastics (uses booking page for camps)
('OAS', 'camps', 'https://portal.iclasspro.com/oasisgymnastics/booking', NULL, NULL, true, 1, NOW(), NOW()),

-- Rowland Ballard Atascocita (uses booking page for camps)
('RBA', 'camps', 'https://portal.iclasspro.com/rbatascocita/booking', NULL, NULL, true, 1, NOW(), NOW()),

-- Rowland/Ballard Kingwood (uses booking page for camps)
('RBK', 'camps', 'https://portal.iclasspro.com/rbkingwood/booking', NULL, NULL, true, 1, NOW(), NOW()),

-- Scottsdale Gymnastics (uses booking page for camps)
('SGT', 'camps', 'https://portal.iclasspro.com/scottsdalegymnastics/booking', NULL, NULL, true, 1, NOW(), NOW()),

-- TIGAR Gymnastics (uses booking page for camps)
('TIG', 'camps', 'https://portal.iclasspro.com/tigar/booking', NULL, NULL, true, 1, NOW(), NOW());

-- To check if camps were added successfully:
-- SELECT gym_id, link_type_id, url FROM gym_links WHERE link_type_id = 'camps' ORDER BY gym_id;
