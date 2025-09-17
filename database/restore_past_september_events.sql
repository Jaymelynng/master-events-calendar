-- Restore past September 2025 events (September 1-16 only)
-- This SQL restores events that already happened but were deleted
-- Events from September 17 onwards are already in the database

INSERT INTO events (id, gym_id, title, date, time, price, type, event_url, created_at)
VALUES
-- August 29th events (these were likely the last weekend of August events)
('09864591-1b42-4742-9443-cecd8dd0c844', 'OAS', 'Sports Mania', '2025-08-29', '6:30 PM - 9:30 PM', '40.00', 'KIDS NIGHT OUT', 'https://portal.iclasspro.com/oasisgymnastics/camp-details/773?typeId=27', '2025-08-29 20:48:51.269093+00'),
('0f3497f9-958d-4596-ae62-e6ecd3c87371', 'CPF', 'DECADE - Through the Years', '2025-08-29', '6:30 PM - 9:30 PM', '35.00', 'KIDS NIGHT OUT', 'https://portal.iclasspro.com/capgymhp/camp-details/2435?typeId=2', '2025-08-29 20:48:51.269093+00'),
('b00f39a1-97d1-41e0-b366-cc48d25d50ea', 'EST', 'Idol Quest', '2025-08-29', '6:30 PM - 9:30 PM', '40.00', 'KIDS NIGHT OUT', 'https://portal.iclasspro.com/estrellagymnastics/camp-details/552?typeId=3', '2025-08-29 20:48:51.269093+00'),
('d416ce2b-9117-4cc4-b781-d731e5396aa7', 'CRR', 'Pullover Clinic', '2025-08-29', '6:30 PM - 7:30 PM', NULL, 'CLINIC', 'https://portal.iclasspro.com/capgymroundrock/camp-details/1565?typeId=28', '2025-08-29 20:48:51.269093+00'),
('e94a909d-0ed2-4543-bfd8-90af681e7aca', 'SGT', 'Nerf Night', '2025-08-29', '6:30 PM - 9:30 PM', '45.00', 'KIDS NIGHT OUT', 'https://portal.iclasspro.com/scottsdalegymnastics/camp-details/1894?typeId=32', '2025-08-29 20:48:51.269093+00'),

-- September 5th events
('f21b921a-f223-4c5d-bdf7-922065e0d594', 'TIG', 'Friday Night Lights', '2025-09-05', '6:30 PM - 9:30 PM', '35.00', 'KIDS NIGHT OUT', 'https://portal.iclasspro.com/tigar/camp-details/503?typeId=8', '2025-08-28 01:40:18.591694+00'),
('4fc6368d-db6f-43b5-a660-4d7332109edf', 'SGT', 'Kids Night Out', '2025-09-05', '6:30 PM - 9:30 PM', '45.00', 'KIDS NIGHT OUT', 'https://portal.iclasspro.com/scottsdalegymnastics/camp-details/1861?typeId=32', '2025-08-28 01:40:18.591694+00'),
('d68dac30-00ea-48df-acdc-10f8574d8fdc', 'CRR', 'Kids Night Out', '2025-09-05', '6:30 PM - 9:30 PM', NULL, 'KIDS NIGHT OUT', 'https://portal.iclasspro.com/capgymroundrock/camp-details/1568?typeId=26', '2025-08-28 01:40:18.591694+00'),
('ce62f27e-b042-4737-a9fa-29c7434b6b16', 'EST', 'Open Gym', '2025-09-05', '7:30 PM - 9:30 PM', '30.00', 'OPEN GYM', 'https://portal.iclasspro.com/estrellagymnastics/camp-details/557?typeId=12', '2025-08-30 06:35:53.498643+00'),
('f8c8c073-eb51-4e88-ae6b-dea502509482', 'OAS', 'Back Handspring Clinic', '2025-09-05', '6:30 PM - 7:30 PM', '25.00', 'CLINIC', 'https://portal.iclasspro.com/oasisgymnastics/camp-details/795?typeId=33', '2025-08-28 01:40:18.591694+00'),
('4043a6d8-b89c-44e5-adc2-c724cc9b83e9', 'CPF', 'Gym Fun Fridays', '2025-09-05', '10:00 AM - 11:30 AM', '10', 'OPEN GYM', 'https://portal.iclasspro.com/capgymhp/camp-details/2477?typeId=81', '2025-09-03 18:20:19.192165+00'),
('d4e9dccf-dc06-4f1e-b61a-4d225b2e112d', 'CCP', 'Gym Fun Fridays | Open Gym | Ages 1-5 | September 5, 2025 | 10:30am -12:00pm', '2025-09-05', '10:30 AM - 12:00 PM', NULL, 'OPEN GYM', 'https://portal.iclasspro.com/capgymavery/camp-details/1138?typeId=17', '2025-09-02 18:58:30.932131+00'),
('9ae91bd3-bf42-454d-91d7-ff3cc2a34fcb', 'CRR', 'Gym Fun Friday 9/5/25', '2025-09-05', '10:00 AM - 11:30 AM', NULL, 'OPEN GYM', 'https://portal.iclasspro.com/capgymroundrock/camp-details/1576?typeId=35', '2025-09-02 18:07:25.812318+00'),
('90f8cf05-b636-439a-a018-3640dc88e647', 'CRR', 'Homeschool Open Gym 9/5/25', '2025-09-05', '11:30 AM - 1:00 PM', NULL, 'OPEN GYM', 'https://portal.iclasspro.com/capgymroundrock/camp-details/1580?typeId=35', '2025-09-02 18:06:15.135293+00'),

-- September 6th events
('329da371-e831-4023-93ce-13f7f04e2179', 'RBA', 'Tumbling Clinic', '2025-09-06', '12:00 PM - 1:00 PM', '25.00', 'CLINIC', 'https://portal.iclasspro.com/rbatascocita/camp-details/2075?typeId=33', '2025-08-28 01:40:18.591694+00'),

-- September 10th events
('05ee79c8-335b-4a0a-9657-1fd9b559f89d', 'CPF', 'Homeschool Free Play', '2025-09-10', '10:00 AM - 11:30 AM', '10', 'OPEN GYM', 'https://portal.iclasspro.com/capgymhp/camp-details/2481?typeId=81', '2025-09-03 18:20:19.192165+00'),

-- September 12th events
('bb28d976-234c-4ba1-9217-54781292e669', 'SGT', 'Kids Night Out', '2025-09-12', '6:30 PM - 9:30 PM', '45.00', 'KIDS NIGHT OUT', 'https://portal.iclasspro.com/scottsdalegymnastics/camp-details/1862?typeId=32', '2025-08-28 01:40:18.591694+00'),
('50a3e7d8-ddab-4027-b4a1-cf709cf76221', 'RBK', 'Pajama Jam KNO!', '2025-09-12', '7:00 PM - 9:30 PM', '25.00', 'KIDS NIGHT OUT', 'https://portal.iclasspro.com/rbkingwood/camp-details/1542?typeId=26', '2025-08-28 01:40:18.591694+00'),
('202ce5be-f0d7-40b0-8517-eafbca2d38ca', 'RBA', 'Nerf Night', '2025-09-12', '7:00 PM - 9:30 PM', '35.00', 'KIDS NIGHT OUT', 'https://portal.iclasspro.com/rbatascocita/camp-details/2072?typeId=35', '2025-08-28 01:40:18.591694+00'),
('89799df8-2a58-4436-a01d-d2c1b6c2aef9', 'OAS', 'Movie Night', '2025-09-12', '6:30 PM - 9:30 PM', '40.00', 'KIDS NIGHT OUT', 'https://portal.iclasspro.com/oasisgymnastics/camp-details/793?typeId=27', '2025-08-28 01:40:18.591694+00'),
('078d8465-04a4-46c7-9261-d68ed3f6684b', 'CRR', 'Advance Tumbling Clinic', '2025-09-12', '6:30 PM - 7:30 PM', NULL, 'CLINIC', 'https://portal.iclasspro.com/capgymroundrock/camp-details/1572?typeId=28', '2025-08-28 01:40:18.591694+00'),
('fc3bd9eb-c4d1-4e5c-965d-1247b6f152fd', 'HGA', 'Backwards Clinic', '2025-09-12', '6:00 PM - 7:00 PM', '25.00', 'CLINIC', 'https://portal.iclasspro.com/houstongymnastics/camp-details/859?typeId=2', '2025-08-28 01:40:18.591694+00'),
('4cd86901-f32c-4861-980a-0755c8a6de30', 'EST', 'Open Gym', '2025-09-12', '7:30 PM - 9:30 PM', '30.00', 'OPEN GYM', 'https://portal.iclasspro.com/estrellagymnastics/camp-details/554?typeId=12', '2025-08-28 01:40:18.591694+00'),
('d68f4b46-4ac4-43aa-8ad0-65d1095bdc6b', 'TIG', 'Open Gym', '2025-09-12', '6:30 PM - 8:30 PM', '20.00', 'OPEN GYM', 'https://portal.iclasspro.com/tigar/camp-details/504?typeId=22', '2025-08-28 01:40:18.591694+00'),
('0794c0b3-6f19-49d6-a258-9b96666415ad', 'RBK', 'Preschool Fun Gym', '2025-09-12', '11:00 AM - 12:00 PM', '15.00', 'OPEN GYM', 'https://portal.iclasspro.com/rbkingwood/camp-details/1543?typeId=6', '2025-08-28 01:40:18.591694+00'),
('8eeb8e53-74f8-4a0d-b261-9ed7d0458468', 'CPF', 'Gym Fun Fridays', '2025-09-12', '10:00 AM - 11:30 AM', '10', 'OPEN GYM', 'https://portal.iclasspro.com/capgymhp/camp-details/2478?typeId=81', '2025-09-03 18:20:19.192165+00'),
('6d2e8ff0-144c-4fc5-85e9-86c228b14b64', 'CCP', 'Gym Fun Fridays | Open Gym | Ages 1-5 | September 12, 2025 | 10:30am -12:00pm', '2025-09-12', '10:30 AM - 12:00 PM', NULL, 'OPEN GYM', 'https://portal.iclasspro.com/capgymavery/camp-details/1164?typeId=17', '2025-09-02 18:58:30.932131+00'),
('3970c325-92e9-43ab-91c6-3b380bd717d9', 'CRR', 'Gym Fun Friday 9/12/25', '2025-09-12', '10:00 AM - 11:30 AM', NULL, 'OPEN GYM', 'https://portal.iclasspro.com/capgymroundrock/camp-details/1577?typeId=35', '2025-09-02 18:06:15.135293+00'),
('542a5aab-7ac5-4a65-b1cd-1d501c3cad9f', 'CRR', 'Homeschool Open Gym 9/12/25', '2025-09-12', '11:30 AM - 1:00 PM', NULL, 'OPEN GYM', 'https://portal.iclasspro.com/capgymroundrock/camp-details/1581?typeId=35', '2025-09-02 18:07:25.812318+00'),

-- September 13th events
('3df3800a-67bb-4841-b659-74591b64339b', 'RBK', 'Back Handspring Clinic', '2025-09-13', '12:30 PM - 2:00 PM', '25.00', 'CLINIC', 'https://portal.iclasspro.com/rbkingwood/camp-details/1544?typeId=31', '2025-08-28 01:40:18.591694+00')

ON CONFLICT (id) DO NOTHING;

-- Note: This only restores events before September 17, 2025
-- Events from September 17 onwards should be re-imported using the current import process
