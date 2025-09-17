// Simple but effective caching layer for Supabase data
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
  }

  // Generate cache key
  getCacheKey(type, params = {}) {
    return `${type}:${JSON.stringify(params)}`;
  }

  // Set cache with TTL (time to live in ms)
  set(type, data, params = {}, ttl = 300000) { // Default 5 min
    const key = this.getCacheKey(type, params);
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now() + ttl);
  }

  // Get from cache if not expired
  get(type, params = {}) {
    const key = this.getCacheKey(type, params);
    const expiry = this.timestamps.get(key);
    
    if (!expiry || Date.now() > expiry) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    
    return this.cache.get(key);
  }

  // Clear specific cache
  clear(type, params = {}) {
    const key = this.getCacheKey(type, params);
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  // Clear all caches
  clearAll() {
    this.cache.clear();
    this.timestamps.clear();
  }

  // Clear expired entries
  cleanUp() {
    const now = Date.now();
    for (const [key, expiry] of this.timestamps.entries()) {
      if (now > expiry) {
        this.cache.delete(key);
        this.timestamps.delete(key);
      }
    }
  }
}

// Create singleton instance
export const cache = new CacheManager();

// Wrapped API functions with caching
export const cachedApi = {
  async getGyms() {
    const cached = cache.get('gyms');
    if (cached) return cached;
    
    const { gymsApi } = await import('./api');
    const data = await gymsApi.getAll();
    cache.set('gyms', data, {}, 600000); // 10 min cache
    return data;
  },

  async getEvents(startDate, endDate) {
    const params = { startDate, endDate };
    const cached = cache.get('events', params);
    if (cached) return cached;
    
    const { eventsApi } = await import('./api');
    const data = await eventsApi.getAll(startDate, endDate);
    cache.set('events', data, params, 300000); // 5 min cache
    return data;
  },

  async getEventTypes() {
    const cached = cache.get('eventTypes');
    if (cached) return cached;
    
    const { eventTypesApi } = await import('./api');
    const data = await eventTypesApi.getAll();
    cache.set('eventTypes', data, {}, 3600000); // 1 hour cache
    return data;
  },

  async getMonthlyRequirements() {
    const cached = cache.get('monthlyRequirements');
    if (cached) return cached;
    
    const { monthlyRequirementsApi } = await import('./api');
    const data = await monthlyRequirementsApi.getAll();
    cache.set('monthlyRequirements', data, {}, 3600000); // 1 hour cache
    return data;
  },

  async getGymLinks() {
    const cached = cache.get('gymLinks');
    if (cached) return cached;
    
    const { gymLinksApi } = await import('./gymLinksApi');
    const data = await gymLinksApi.getAllLinksDetailed();
    cache.set('gymLinks', data, {}, 600000); // 10 min cache
    return data;
  }
};

// Auto cleanup every 5 minutes
setInterval(() => cache.cleanUp(), 300000);

// Browser storage persistence (optional)
export const persistCache = {
  save() {
    const data = {
      cache: Array.from(cache.cache.entries()),
      timestamps: Array.from(cache.timestamps.entries())
    };
    localStorage.setItem('eventsCacheData', JSON.stringify(data));
  },

  load() {
    try {
      const stored = localStorage.getItem('eventsCacheData');
      if (!stored) return;
      
      const data = JSON.parse(stored);
      cache.cache = new Map(data.cache);
      cache.timestamps = new Map(data.timestamps);
      cache.cleanUp(); // Remove expired entries
    } catch (e) {
      console.warn('Failed to load cache from storage:', e);
    }
  }
};

// Load cache on startup
if (typeof window !== 'undefined') {
  persistCache.load();
  
  // Save cache before page unload
  window.addEventListener('beforeunload', () => {
    persistCache.save();
  });
}
