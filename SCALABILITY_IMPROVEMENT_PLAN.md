# Master Events Scalability Improvement Plan

## Phase 1: Component Architecture (Week 1-2)

### Current Problem
- Single 2600+ line EventsDashboard component
- Hard to maintain, test, and scale with team
- Performance issues with re-renders

### Solution: Component Breakdown

```
src/
├── components/
│   ├── EventsDashboard/
│   │   ├── index.js (main container ~200 lines)
│   │   ├── EventCalendar/
│   │   │   ├── CalendarGrid.js
│   │   │   ├── CalendarHeader.js
│   │   │   ├── EventCard.js
│   │   │   └── DayCell.js
│   │   ├── EventStats/
│   │   │   ├── StatsTable.js
│   │   │   ├── GymStatsRow.js
│   │   │   └── RequirementIndicator.js
│   │   ├── EventFilters/
│   │   │   ├── FilterBar.js
│   │   │   ├── GymSelector.js
│   │   │   └── EventTypeFilter.js
│   │   ├── AdminTools/
│   │   │   ├── BulkImportModal.js
│   │   │   ├── EventValidator.js
│   │   │   └── CollectionManager.js
│   │   └── hooks/
│   │       ├── useEventData.js
│   │       ├── useEventStats.js
│   │       └── useFilteredEvents.js
```

### Benefits
- Each component under 300 lines
- Parallel development possible
- Easier testing
- Better performance with React.memo

## Phase 2: Performance Optimizations (Week 2-3)

### 1. Implement Virtual Scrolling
```javascript
// For calendar with many events
import { FixedSizeList } from 'react-window';

const VirtualEventList = ({ events }) => {
  return (
    <FixedSizeList
      height={600}
      itemCount={events.length}
      itemSize={80}
      width="100%"
    >
      {({ index, style }) => (
        <EventCard event={events[index]} style={style} />
      )}
    </FixedSizeList>
  );
};
```

### 2. Add React Query for Data Management
```javascript
// Replace direct API calls with React Query
import { useQuery, useMutation, useQueryClient } from 'react-query';

const useEvents = (startDate, endDate) => {
  return useQuery(
    ['events', startDate, endDate],
    () => eventsApi.getAll(startDate, endDate),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};
```

### 3. Implement Code Splitting
```javascript
// Lazy load heavy components
const AdminTools = lazy(() => import('./AdminTools'));
const BulkImportModal = lazy(() => import('./AdminTools/BulkImportModal'));

// In render
<Suspense fallback={<LoadingSpinner />}>
  {showAdminTools && <AdminTools />}
</Suspense>
```

## Phase 3: Database Scaling (Week 3-4)

### 1. Add Database Indexes
```sql
-- Critical indexes for performance
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_gym_date ON events(gym_id, date);
CREATE INDEX idx_events_type_date ON events(type, date);
CREATE INDEX idx_events_compound ON events(gym_id, type, date);

-- For quick stats
CREATE INDEX idx_events_month ON events(
  date_trunc('month', date), 
  gym_id, 
  type
);
```

### 2. Implement Materialized Views
```sql
-- Pre-calculate monthly statistics
CREATE MATERIALIZED VIEW monthly_event_stats AS
SELECT 
  date_trunc('month', date) as month,
  gym_id,
  type,
  COUNT(*) as event_count,
  COUNT(DISTINCT date) as unique_days
FROM events
GROUP BY date_trunc('month', date), gym_id, type;

-- Refresh every hour
CREATE OR REPLACE FUNCTION refresh_monthly_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_event_stats;
END;
$$ LANGUAGE plpgsql;
```

### 3. Implement Row Level Security
```sql
-- Enable RLS for multi-tenant scaling
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy for organization-based access
CREATE POLICY events_org_policy ON events
  USING (gym_id IN (
    SELECT gym_id FROM user_gym_access 
    WHERE user_id = auth.uid()
  ));
```

## Phase 4: Caching Strategy (Week 4-5)

### 1. Browser Caching with Service Worker
```javascript
// serviceWorker.js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/events')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          return caches.open('events-v1').then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});
```

### 2. Edge Caching with Vercel
```javascript
// vercel.json
{
  "functions": {
    "api/events.js": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/events",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=300, stale-while-revalidate=600"
        }
      ]
    }
  ]
}
```

### 3. Implement Redis for Session Data
```javascript
// lib/redis.js
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL
});

export const cacheEventStats = async (month, stats) => {
  const key = `stats:${month}`;
  await redis.setex(key, 3600, JSON.stringify(stats)); // 1 hour TTL
};

export const getCachedStats = async (month) => {
  const cached = await redis.get(`stats:${month}`);
  return cached ? JSON.parse(cached) : null;
};
```

## Phase 5: Infrastructure Scaling (Week 5-6)

### 1. Implement Microservices Architecture
```javascript
// Split into services
- events-api (Node.js) - Port 4001
- stats-api (Node.js) - Port 4002  
- notification-service (Node.js) - Port 4003
- sync-service (Python) - Port 4004

// API Gateway (server.js)
const proxy = httpProxy.createProxyServer();

app.use('/api/events', (req, res) => {
  proxy.web(req, res, { target: 'http://localhost:4001' });
});

app.use('/api/stats', (req, res) => {
  proxy.web(req, res, { target: 'http://localhost:4002' });
});
```

### 2. Add Background Job Processing
```javascript
// lib/queue.js
import Bull from 'bull';

const eventQueue = new Bull('event-processing');

// Add job to sync events
eventQueue.add('sync-iclass', {
  gymId: gym.id,
  month: currentMonth
});

// Process jobs
eventQueue.process('sync-iclass', async (job) => {
  const { gymId, month } = job.data;
  await syncEventsFromIClass(gymId, month);
});
```

### 3. Implement WebSocket for Real-time Updates
```javascript
// Real-time event updates
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

// Subscribe to changes
const subscription = supabase
  .from('events')
  .on('INSERT', (payload) => {
    updateLocalCache(payload.new);
  })
  .on('UPDATE', (payload) => {
    updateLocalCache(payload.new);
  })
  .subscribe();
```

## Phase 6: Monitoring & Analytics (Week 6)

### 1. Application Performance Monitoring
```javascript
// lib/monitoring.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
});

// Track custom metrics
export const trackEventLoad = (duration) => {
  Sentry.addBreadcrumb({
    category: 'performance',
    message: 'Event load time',
    level: 'info',
    data: { duration }
  });
};
```

### 2. Database Query Monitoring
```sql
-- Enable pg_stat_statements
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Monitor slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
WHERE mean_time > 100
ORDER BY mean_time DESC
LIMIT 20;
```

### 3. User Analytics
```javascript
// Track user behavior
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      <EventsDashboard />
      <Analytics />
    </>
  );
}
```

## Scalability Metrics & Goals

### Current State
- Load time: 2-3 seconds
- Max concurrent users: ~100
- Events capacity: ~10,000

### Target State (After Implementation)
- Load time: <500ms
- Max concurrent users: 10,000+
- Events capacity: 1,000,000+
- API response time: <100ms p95

## Implementation Priority

1. **Week 1-2**: Component refactoring (biggest impact)
2. **Week 3**: Database optimization
3. **Week 4**: Caching implementation  
4. **Week 5**: Performance optimizations
5. **Week 6**: Monitoring setup

## Estimated Impact

- **Performance**: 5-10x faster load times
- **Capacity**: 100x more events/users
- **Developer Velocity**: 3x faster feature development
- **Reliability**: 99.9% uptime possible
- **Cost**: More efficient resource usage

## Next Steps

1. Start with component breakdown (highest ROI)
2. Implement React Query for better data management
3. Add database indexes immediately (quick win)
4. Set up basic monitoring to measure improvements
