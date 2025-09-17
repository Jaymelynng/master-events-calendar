// Custom hook to manage all event data fetching
import { useState, useEffect } from 'react';
import { gymsApi, eventsApi, eventTypesApi, monthlyRequirementsApi } from '../../../lib/api';
import { gymLinksApi } from '../../../lib/gymLinksApi';

export const useEventData = (startDate, endDate) => {
  const [data, setData] = useState({
    gyms: [],
    events: [],
    eventTypes: [],
    gymLinks: [],
    monthlyRequirements: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Parallel fetch all data
        const [gyms, events, eventTypes, gymLinks, requirements] = await Promise.all([
          gymsApi.getAll(),
          eventsApi.getAll(startDate, endDate),
          eventTypesApi.getAll(),
          gymLinksApi.getAllLinksDetailed(),
          monthlyRequirementsApi.getAll()
        ]);

        setData({
          gyms: gyms || [],
          events: events || [],
          eventTypes: eventTypes || [],
          gymLinks: gymLinks || [],
          monthlyRequirements: requirements || []
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [startDate, endDate]);

  return { ...data, loading, error, refetch: () => fetchAllData() };
};
