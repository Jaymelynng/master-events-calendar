// JSON Import Handler for iClassPro API responses
export const parseIClassProJSON = (jsonString, gymSlug) => {
  try {
    const data = JSON.parse(jsonString);
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid JSON structure - missing data array');
    }
    
    const events = data.data.map(event => {
      // Extract time from schedule
      const schedule = event.schedule?.[0] || {};
      const timeString = schedule.startTime && schedule.endTime 
        ? `${schedule.startTime} - ${schedule.endTime}`
        : '6:30 PM - 9:30 PM'; // default
      
      // Build the portal URL
      const eventUrl = `https://portal.iclasspro.com/${gymSlug}/camp-details/${event.id}`;
      
      // Extract price from name if present
      let price = null;
      const priceMatch = event.name.match(/\$(\d+)/);
      if (priceMatch) {
        price = parseInt(priceMatch[1]);
      }
      
      return {
        title: event.name,
        date: event.startDate,
        time: timeString,
        type: data.campTypeName || 'KIDS NIGHT OUT',
        age_min: event.minAge,
        age_max: event.maxAge,
        price: price,
        event_url: eventUrl,
        hasOpenings: event.hasOpenings
      };
    });
    
    return {
      success: true,
      gymSlug: gymSlug,
      eventType: data.campTypeName,
      totalRecords: data.totalRecords,
      events: events
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Detect gym from API URL
export const detectGymFromApiUrl = (url) => {
  const match = url.match(/\/api\/open\/v1\/([^\/]+)\//);
  if (match) {
    return match[1]; // e.g., 'capgymroundrock'
  }
  return null;
};
