-- CRITICAL PERFORMANCE INDEXES FOR MASTER EVENTS
-- Run these in your Supabase SQL editor immediately

-- 1. Primary query optimization (most used)
CREATE INDEX CONCURRENTLY idx_events_date_range 
ON events(date, gym_id, type) 
WHERE date >= CURRENT_DATE - INTERVAL '6 months';

-- 2. Stats calculation optimization
CREATE INDEX CONCURRENTLY idx_events_monthly_stats 
ON events(
  date_trunc('month', date), 
  gym_id, 
  type
) INCLUDE (id, title, price);

-- 3. Gym filtering optimization
CREATE INDEX CONCURRENTLY idx_events_gym_lookup 
ON events(gym_id, date DESC) 
INCLUDE (type, event_url);

-- 4. Type filtering optimization  
CREATE INDEX CONCURRENTLY idx_events_type_lookup
ON events(type, date DESC)
WHERE type IN ('CLINIC', 'KIDS NIGHT OUT', 'OPEN GYM');

-- 5. URL deduplication optimization
CREATE INDEX CONCURRENTLY idx_events_url_unique
ON events(event_url, gym_id);

-- 6. Quick gym links lookup
CREATE INDEX CONCURRENTLY idx_gym_links_lookup
ON gym_links(gym_id, link_type_id)
WHERE is_active = true;

-- ANALYZE tables after creating indexes
ANALYZE events;
ANALYZE gym_links;
ANALYZE gyms;

-- Check index usage after a day
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
