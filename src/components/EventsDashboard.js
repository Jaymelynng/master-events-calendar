import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Calendar, Clock, DollarSign, MapPin, Filter, Search, Grid, List, Plus, 
  ChevronUp, ChevronLeft, ChevronRight, AlertCircle, Loader, Copy, CheckCircle
} from 'lucide-react';

// Import real API functions
import { gymsApi, eventsApi, eventTypesApi, monthlyRequirementsApi } from '../lib/api';
import { gymLinksApi } from '../lib/gymLinksApi';

// Exact Color Theme from user's specification
const theme = {
  colors: {
    primary: '#b48f8f',        // Blush pink - primary brand highlight
    secondary: '#cec4c1',      // Neutral gray-beige - cards, secondary elements
    accent: '#8f93a0',         // Gray-blue - subtle highlights
    textPrimary: '#4a4a4a',    // Dark gray - main text (enhanced)
    textSecondary: '#8f93a0',  // Medium gray - secondary text (enhanced)
    success: '#22c55e',        // Green - success states
    warning: '#f59e0b',        // Orange - warnings
    error: '#ef4444',          // Red - errors
    background: '#f9fafb',     // Light background (enhanced)
  },
  gradients: {
    background: 'linear-gradient(135deg, #fdf7f7 0%, #f5f1f1 50%, #f0ebeb 100%)',
    card: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
  }
};

// Event types and requirements will be loaded from database

// Safely parse a 'YYYY-MM-DD' date string in LOCAL time to avoid UTC shifts
const parseYmdLocal = (ymd) => {
  if (!ymd || typeof ymd !== 'string') return new Date(ymd);
  const parts = ymd.split('-');
  if (parts.length !== 3) return new Date(ymd);
  const [y, m, d] = parts.map(Number);
  if (!y || !m || !d) return new Date(ymd);
  return new Date(y, m - 1, d);
};

// Utility function to convert 24-hour time to 12-hour format
const formatTime = (timeString) => {
  if (!timeString) return 'No time set';
  
  // If it's already in 12-hour format (contains AM/PM), return as is
  if (timeString.includes('AM') || timeString.includes('PM')) {
    return timeString;
  }
  
  // Handle 24-hour format (HH:MM)
  const [hours, minutes] = timeString.split(':');
  const hour24 = parseInt(hours);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  
  return `${hour12}:${minutes} ${ampm}`;
};

// Static source of truth for gym event page links
const GYM_EVENT_LINKS = {
  "Capital Gymnastics Cedar Park": {
    "CLINIC": "https://portal.iclasspro.com/capgymavery/camps/7?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/capgymavery/camps/13?sortBy=time", 
    "OPEN GYM": "https://portal.iclasspro.com/capgymavery/camps/17?sortBy=time",
    "BOOKING": "https://portal.iclasspro.com/capgymavery/booking"
  },
  "Capital Gymnastics Pflugerville": {
    "CLINIC": "https://portal.iclasspro.com/capgymhp/camps/31?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/capgymhp/camps/2?sortBy=time",
    "OPEN GYM": "https://portal.iclasspro.com/capgymhp/camps/81?sortBy=name",
    "BOOKING": "https://portal.iclasspro.com/capgymhp/booking"
  },
  "Capital Gymnastics Round Rock": {
    "CLINIC": "https://portal.iclasspro.com/capgymroundrock/camps/28?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/capgymroundrock/camps/26?sortBy=time",
    "OPEN GYM": "https://portal.iclasspro.com/capgymroundrock/camps/35?sortBy=time", 
    "BOOKING": "https://portal.iclasspro.com/capgymroundrock/booking"
  },
  "Rowland Ballard Atascocita": {
    "CLINIC": "https://portal.iclasspro.com/rbatascocita/camps/33?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/rbatascocita/camps/35?sortBy=time",
    "OPEN GYM": "https://portal.iclasspro.com/rbatascocita/camps/76?sortBy=name",
    "BOOKING": "https://portal.iclasspro.com/rbatascocita/booking"
  },
  "Rowland Ballard Kingwood": {
    "CLINIC": "https://portal.iclasspro.com/rbkingwood/camps/31?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/rbkingwood/camps/26?sortBy=time", 
    "OPEN GYM": "https://portal.iclasspro.com/rbkingwood/camps/6?sortBy=time",
    "BOOKING": "https://portal.iclasspro.com/rbkingwood/booking"
  },
  "Houston Gymnastics Academy": {
    "CLINIC": "https://portal.iclasspro.com/houstongymnastics/camps/2?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/houstongymnastics/camps/7?sortBy=time",
    "OPEN GYM": "https://portal.iclasspro.com/houstongymnastics/camps/15?sortBy=time",
    "BOOKING": "https://portal.iclasspro.com/houstongymnastics/booking"
  },
  "Estrella Gymnastics": {
    "CLINIC": "https://portal.iclasspro.com/estrellagymnastics/camps/24?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/estrellagymnastics/camps/3?sortBy=time",
    "OPEN GYM": "https://portal.iclasspro.com/estrellagymnastics/camps/12?sortBy=time", 
    "BOOKING": "https://portal.iclasspro.com/estrellagymnastics/booking"
  },
  "Oasis Gymnastics": {
    "CLINIC": "https://portal.iclasspro.com/oasisgymnastics/camps/33?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/oasisgymnastics/camps/27?sortBy=time",
    "OPEN GYM": "https://portal.iclasspro.com/oasisgymnastics/camps/60?sortBy=time",
    "BOOKING": "https://portal.iclasspro.com/oasisgymnastics/booking"
  },
  "Scottsdale Gymnastics": {
    "CLINIC": "https://portal.iclasspro.com/scottsdalegymnastics/camps/28?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/scottsdalegymnastics/camps/32?sortBy=time", 
    "OPEN GYM": "https://portal.iclasspro.com/scottsdalegymnastics/camps/88?sortBy=time",
    "BOOKING": "https://portal.iclasspro.com/scottsdalegymnastics/booking"
  },
  "Tigar Gymnastics": {
    "CLINIC": "https://portal.iclasspro.com/tigar/camps/2?sortBy=time",
    "KIDS NIGHT OUT": "https://portal.iclasspro.com/tigar/camps/8?sortBy=time",
    "OPEN GYM": "https://portal.iclasspro.com/tigar/camps/22?sortBy=name",
    "BOOKING": "https://portal.iclasspro.com/tigar/booking"
  }
};

// Monthly requirements will now be fetched live from Supabase

// Custom hooks
const useGyms = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const data = await gymsApi.getAll();
        setGyms(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

  return { gyms, loading, error };
};

const useGymLinks = () => {
  const [gymLinks, setGymLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGymLinks = async () => {
      try {
        const data = await gymLinksApi.getAllLinksDetailed();
        setGymLinks(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGymLinks();
  }, []);

  return { gymLinks, loading, error };
};

const useEventTypes = () => {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const data = await eventTypesApi.getAll();
        setEventTypes(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventTypes();
  }, []);

  return { eventTypes, loading, error };
};

const useEvents = (startDate, endDate) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventsApi.getAll(startDate, endDate);
        setEvents(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchEvents();
    }
  }, [startDate, endDate]);

  const refetch = async () => {
    try {
      setLoading(true);
      const data = await eventsApi.getAll(startDate, endDate);
      setEvents(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { events, loading, error, refetch };
};

const useMonthlyRequirements = () => {
  const [requirements, setRequirements] = useState({});
  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const data = await monthlyRequirementsApi.getAll();
        const map = {};
        (data || []).forEach((row) => {
          map[row.event_type] = row.required_count;
        });
        setRequirements(map);
      } catch (err) {
        console.error('Error fetching monthly requirements:', err.message);
      }
    };
    fetchRequirements();
  }, []);
  return requirements;
};

const EventsDashboard = () => {
  // State management
  const [selectedGym, setSelectedGym] = useState('all');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('calendar');
  // Set to August 2025 where your events are
  const [currentMonth, setCurrentMonth] = useState(8); // September (0-indexed)  
  const [currentYear, setCurrentYear] = useState(2025); // 2025
  const [calendarView, setCalendarView] = useState('full'); // Start with full month view
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [copiedUrl, setCopiedUrl] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    gym_id: '',
    title: '',
    date: '',
    time: '',
    price: '',
    type: '',
    event_url: ''
  });
  
  // Refs
  const topRef = useRef(null);
  const calendarRef = useRef(null);
  const gymRefs = useRef({});
  const monthNavRef = useRef(null);
  const hidePopoverTimeoutRef = useRef(null);

  // Fetch data
  const { gyms: gymsList, loading: gymsLoading, error: gymsError } = useGyms();
  const { gymLinks, loading: gymLinksLoading, error: gymLinksError } = useGymLinks();
  const { eventTypes, loading: eventTypesLoading, error: eventTypesError } = useEventTypes();
  
  const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
  const endDate = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
  const { events, loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useEvents(startDate, endDate);

  const monthlyRequirements = useMonthlyRequirements();

  // Helper function to get URLs from real Supabase data
  const getGymLinkUrl = (gymName, linkTypeLabel) => {
    const link = gymLinks.find(gl => 
      gl.gym_name === gymName && 
      (gl.link_type_label === linkTypeLabel || gl.link_type_name === linkTypeLabel)
    );
    return link?.url;
  };

  // Helper function to get all URLs for a specific event type from Supabase links data
  const getAllUrlsForEventType = (eventType) => {
    const urls = [];
    Object.keys(GYM_EVENT_LINKS).forEach(gymName => {
      const url = GYM_EVENT_LINKS[gymName][eventType];
      if (url) urls.push(url);
    });
    console.log(`Getting URLs for ${eventType}:`, urls);
    return urls;
  };

  // Helper to open multiple tabs with best compatibility (avoids pop-up blockers)
  const openMultipleTabs = (urls, startingMessage, doneMessage) => {
    if (!urls || urls.length === 0) {
      setCopySuccess('No links found.');
      setTimeout(() => setCopySuccess(''), 2500);
      return;
    }

    setCopySuccess(startingMessage);

    // Open blank tabs synchronously on user gesture to avoid blockers
    const windows = urls.map(() => window.open('', '_blank'));

    // If nothing opened, likely blocked – show guidance and stop
    if (!windows || windows.every(w => w == null)) {
      setCopySuccess('Please allow pop-ups to open multiple tabs.');
      setTimeout(() => setCopySuccess(''), 4000);
      return;
    }

    // Navigate each opened window to the target URL with slight stagger
    urls.forEach((url, idx) => {
      setTimeout(() => {
        const w = windows[idx];
        if (w && !w.closed) {
          try {
            w.location = url;
          } catch (_) {}
        }
      }, idx * 300);
    });

    // Completion toast
    setTimeout(() => {
      setCopySuccess(doneMessage);
      setTimeout(() => setCopySuccess(''), 4000);
    }, urls.length * 300 + 150);
  };

  // Helper functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const displayDates = useMemo(() => {
    const totalDays = getDaysInMonth(currentYear, currentMonth);
    
    switch (calendarView) {
      case 'firstHalf':
        return Array.from({ length: 15 }, (_, i) => i + 1);
      case 'secondHalf':
        return Array.from({ length: totalDays - 15 }, (_, i) => i + 16);
      case 'full':
        return Array.from({ length: totalDays }, (_, i) => i + 1);
      case 'week1':
        return Array.from({ length: 7 }, (_, i) => i + 1);
      case 'week2':
        return Array.from({ length: 7 }, (_, i) => i + 8);
      case 'week3':
        return Array.from({ length: 7 }, (_, i) => i + 15);
      case 'week4':
        return Array.from({ length: Math.min(7, totalDays - 21) }, (_, i) => i + 22);
      default:
        return Array.from({ length: 15 }, (_, i) => i + 1);
    }
  }, [calendarView, currentYear, currentMonth]);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setCalendarView('firstHalf');
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setCalendarView('firstHalf');
  };

  const scrollToGym = (gym) => {
    const gymElement = gymRefs.current[gym];
    if (gymElement) {
      gymElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      // Add a visual highlight effect
      gymElement.style.backgroundColor = theme.colors.secondary;
      setTimeout(() => {
        gymElement.style.backgroundColor = '';
      }, 2000);
    }
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Calendar view change handler
  const handleCalendarViewChange = (newView) => {
    setCalendarView(newView);
  };

  // Scroll listener for back to top button and calendar view detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowBackToTop(scrollY > 400);
      
      // Calendar view detection removed since it was unused
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Data processing - event types from events for dropdown
  const eventTypesFromEvents = useMemo(() => {
    const types = [...new Set(events.map(event => event.type))];
    return types.filter(Boolean).sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesGym = selectedGym === 'all' || 
        event.gym_code === selectedGym || 
        event.gym_id === selectedGym ||
        event.gym_name === selectedGym;
      const matchesType = selectedEventType === 'all' || event.type === selectedEventType;
      const matchesSearch = searchTerm === '' || 
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.type?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesGym && matchesType && matchesSearch;
    });
  }, [events, selectedGym, selectedEventType, searchTerm]);

  const uniqueGymsWithEvents = useMemo(() => {
    const gymCodes = [...new Set(filteredEvents.map(event => event.gym_code))];
    return gymCodes.sort();
  }, [filteredEvents]);

  // Get all gyms (from gymsList) for calendar display, or gyms with events for statistics
  const allGymsFromList = useMemo(() => gymsList.map(gym => gym.name).sort(), [gymsList]);
  const allGyms = useMemo(() => {
    const gymsWithEvents = [...new Set(filteredEvents.map(event => event.gym_name || event.gym_code).filter(Boolean))];
    // For calendar display, show all gyms; for statistics, show only gyms with events
    return allGymsFromList.length > 0 ? allGymsFromList : gymsWithEvents;
  }, [filteredEvents, allGymsFromList]);

  // Statistics calculation functions - COUNT ONLY EVENTS IN CURRENT MONTH
  const getEventCounts = () => {
    const counts = {};
    // Get tracked event types from database
    const trackedTypes = eventTypes.filter(et => et.is_tracked).map(et => et.name);
    
    // Filter events to current month/year being viewed
    const currentMonthEvents = events.filter(event => {
      if (!event.date) return false;
      const eventDate = parseYmdLocal(event.date);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });
    
    allGyms.forEach(gym => {
      counts[gym] = {};
      trackedTypes.forEach(type => {
        counts[gym][type] = currentMonthEvents.filter(
          event => (event.gym_name || event.gym_code) === gym && event.type === type
        ).length;
      });
      
      counts[gym].total = currentMonthEvents.filter(
        event => (event.gym_name || event.gym_code) === gym && trackedTypes.includes(event.type)
      ).length;
    });
    
    return counts;
  };



  const getMissingEventTypes = (gym) => {
    const missing = [];
    const counts = getEventCounts(); // Gets counts for CURRENT MONTH only
    
    // Use source of truth requirements
    Object.keys(monthlyRequirements).forEach(eventType => {
      const requiredCount = monthlyRequirements[eventType];
      const currentCount = counts[gym]?.[eventType] || 0;
      const deficit = requiredCount - currentCount;
      
      if (deficit > 0) {
        const shortLabel = eventType === 'KIDS NIGHT OUT' ? 'KNO' : eventType;
        missing.push(`+${deficit} ${shortLabel}`);
      }
    });
    
    return missing;
  };

  const getEventTypeColor = (eventType) => {
    const colors = {
      // Required Events (Tracked) - Light background colors
      'CLINIC': '#F3E8FF',                    // Light lavender
      'KIDS NIGHT OUT': '#FFCCCB',           // Coral rose  
      'OPEN GYM': '#C8E6C9',                 // Sage green
      
      // Summer Camps (Optional) - Light background colors
      'SUMMER CAMP': '#E1F5FE',              // Ice blue
      'SUMMER CAMP - GYMNASTICS': '#B2DFDB', // Seafoam
      'SUMMER CAMP - NINJA': '#DCEDC8',      // Light lime
      
      // Other event types
      'BIRTHDAY PARTY': '#fce7f3',           // Light pink background
      'SPECIAL EVENT': '#fef2f2',            // Light red background
      'WORKSHOP': '#eef2ff',                 // Light indigo background
    };
    return colors[eventType] || '#f5f1f1'; // Default to light blush background
  };

  const copyToClipboard = async (text, eventId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(eventId);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Loading states
  if (gymsLoading || eventsLoading || gymLinksLoading || eventTypesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.colors.background }}>
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: theme.colors.primary }} />
          <p style={{ color: theme.colors.textSecondary }}>Loading events data...</p>
        </div>
      </div>
    );
  }

  if (gymsError || eventsError || gymLinksError || eventTypesError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <AlertCircle className="w-8 h-8 mx-auto mb-4" />
          <p>Error loading data: {gymsError || eventsError || gymLinksError || eventTypesError}</p>
        </div>
      </div>
    );
  }

  // Add Event Function
  const handleAddEvent = async () => {
    try {
      // Calculate day of week
      const eventDate = new Date(newEvent.date);
      const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
      
      const eventData = {
        ...newEvent,
        day_of_week: dayOfWeek,
        price: newEvent.price ? parseFloat(newEvent.price) : null
      };
      
      await eventsApi.create(eventData);
      
      // Refresh events list
      await refetchEvents();
      
      // Close modal and reset form
      setShowAddEventModal(false);
      setNewEvent({
        gym_id: '',
        title: '',
        date: '',
        time: '',
        price: '',
        type: '',
        event_url: ''
      });
      
      setCopySuccess('✅ Event added successfully!');
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (error) {
      console.error('Error adding event:', error);
      setCopySuccess('❌ Error adding event');
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };

  // Open Edit Modal for Event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({
      gym_id: event.gym_id,
      title: event.title,
      date: event.date,
      time: event.time,
      price: event.price || '',
      type: event.type,
      event_url: event.event_url
    });
    setShowAddEventModal(true);
  };

  // Delete Event Function with Logging
  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      // Log the deletion
      const deleteLog = {
        action: 'DELETE_EVENT',
        event_id: eventId,
        event_title: eventTitle,
        deleted_by: 'Admin User', // You can make this dynamic later
        deleted_at: new Date().toISOString(),
        timestamp: new Date().toLocaleString(),
        user_agent: navigator.userAgent.substring(0, 100) // Truncate for readability
      };
      
      console.log('🗑️ EVENT DELETION LOG:', deleteLog);
      
      // You could also save this to a separate audit_log table in Supabase later
      // await supabase.from('audit_log').insert([deleteLog]);
      
      await eventsApi.delete(eventId);
      
      // Refresh events list
      await refetchEvents();
      
      // Close modal
      setShowAddEventModal(false);
      setEditingEvent(null);
      
      setCopySuccess(`✅ "${eventTitle}" deleted successfully!`);
      setTimeout(() => setCopySuccess(''), 4000);
    } catch (error) {
      console.error('Error deleting event:', error);
      setCopySuccess('❌ Error deleting event');
      setTimeout(() => setCopySuccess(''), 3000);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      
      {/* Copy Success Notification */}
      {copySuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {copySuccess}
        </div>
      )}
      
      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">
                <strong>All fields marked with * are required.</strong> The URL is especially important - this is the whole purpose of tracking events!
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Gym Selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Gym <span className="text-red-500">*</span></label>
                <select
                  value={newEvent.gym_id}
                  onChange={(e) => setNewEvent({...newEvent, gym_id: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-300"
                  required
                >
                  <option value="">Select Gym</option>
                  {gymsList.map(gym => (
                    <option key={gym.id} value={gym.id}>{gym.name}</option>
                  ))}
                </select>
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium mb-1">Event Category <span className="text-red-500">*</span></label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-300"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="CLINIC">Clinic</option>
                  <option value="KIDS NIGHT OUT">Kids Night Out</option>
                  <option value="OPEN GYM">Open Gym</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Event Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-300"
                  placeholder="e.g., Ninja Night Out"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-1">Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-300"
                  required
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium mb-1">Time <span className="text-red-500">*</span></label>
                <select
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-300"
                  required
                >
                  <option value="">Select Time</option>
                  <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                  <option value="9:00 AM - 3:00 PM">9:00 AM - 3:00 PM</option>
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                  <option value="1:00 PM - 3:00 PM">1:00 PM - 3:00 PM</option>
                  <option value="3:00 PM - 5:00 PM">3:00 PM - 5:00 PM</option>
                  <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                  <option value="5:00 PM - 7:00 PM">5:00 PM - 7:00 PM</option>
                  <option value="5:30 PM - 7:30 PM">5:30 PM - 7:30 PM</option>
                  <option value="5:30 PM - 8:00 PM">5:30 PM - 8:00 PM</option>
                  <option value="5:30 PM - 8:30 PM">5:30 PM - 8:30 PM</option>
                  <option value="5:30 PM - 9:00 PM">5:30 PM - 9:00 PM</option>
                  <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
                  <option value="6:00 PM - 8:30 PM">6:00 PM - 8:30 PM</option>
                  <option value="6:00 PM - 9:00 PM">6:00 PM - 9:00 PM</option>
                  <option value="6:00 PM - 9:30 PM">6:00 PM - 9:30 PM</option>
                  <option value="6:00 PM - 10:00 PM">6:00 PM - 10:00 PM</option>
                  <option value="6:30 PM - 8:30 PM">6:30 PM - 8:30 PM</option>
                  <option value="6:30 PM - 9:00 PM">6:30 PM - 9:00 PM</option>
                  <option value="6:30 PM - 9:30 PM">6:30 PM - 9:30 PM</option>
                  <option value="6:30 PM - 10:00 PM">6:30 PM - 10:00 PM</option>
                  <option value="7:00 PM - 9:00 PM">7:00 PM - 9:00 PM</option>
                  <option value="7:00 PM - 10:00 PM">7:00 PM - 10:00 PM</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">If you need a different time, contact the admin</p>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-1">Price (optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                    min="0"
                  value={newEvent.price}
                    onChange={(e) => {
                      // Remove any non-numeric characters except decimal
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      setNewEvent({...newEvent, price: value});
                    }}
                    className="w-full pl-8 pr-2 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300"
                  placeholder="0.00"
                />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter numbers only (e.g., 35 or 35.00)</p>
              </div>

              {/* Event URL - MOST IMPORTANT */}
              <div>
                <label className="block text-sm font-medium mb-1">Registration URL <span className="text-red-500">* REQUIRED</span></label>
                <input
                  type="url"
                  value={newEvent.event_url}
                  onChange={(e) => setNewEvent({...newEvent, event_url: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-300 border-red-300"
                  placeholder="https://portal.iclasspro.com/..."
                  required
                />
                <p className="text-xs text-red-600 mt-1">This is the most important field - the whole purpose is to collect the URL!</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
                <button
                onClick={() => {
                  setShowAddEventModal(false);
                  setEditingEvent(null);
                  setNewEvent({
                    gym_id: '',
                    title: '',
                    date: '',
                    time: '',
                    price: '',
                    type: '',
                    event_url: ''
                  });
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!newEvent.gym_id || !newEvent.type || !newEvent.title || !newEvent.date || !newEvent.time || !newEvent.event_url}
                className="flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: theme.colors.primary,
                    color: 'white'
                  }}
                >
                {editingEvent ? 'Update Event' : 'Add Event'}
                </button>
              
              {editingEvent && (
                <button
                  onClick={() => handleDeleteEvent(editingEvent.id, editingEvent.title)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Event
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div ref={topRef} className="relative z-10 p-4">
        <div className="max-w-full mx-auto px-2">
          {/* Dashboard Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              ✨ Master Events Calendar ✨
            </h1>
            <p className="text-gray-600">All gyms special events in one place</p>
          </div>

          {/* Dashboard Stats Cards - Now Clickable! */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 max-w-6xl w-full">
            <button 
              onClick={() => setViewMode('calendar')}
              className="bg-white rounded-lg shadow-lg p-4 border-l-4 hover:shadow-xl hover:scale-105 transition-all duration-200 text-center"
              style={{ borderColor: theme.colors.primary }}
            >
              <div className="text-3xl font-bold" style={{ color: theme.colors.textPrimary }}>
                {filteredEvents.length}
              </div>
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                Total Events
              </div>
              <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                This Month • Click to view calendar
              </div>
            </button>
            
            <button 
              onClick={() => {
                setSelectedGym('all');
                setSelectedEventType('all');
                setViewMode('calendar');
              }}
              className="bg-white rounded-lg shadow-lg p-4 border-l-4 hover:shadow-xl hover:scale-105 transition-all duration-200 text-center"
              style={{ borderColor: theme.colors.accent }}
            >
              <div className="text-3xl font-bold" style={{ color: theme.colors.textPrimary }}>
                {uniqueGymsWithEvents.length}
              </div>
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                Active Gyms
              </div>
              <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                Click to view all gym events
              </div>
            </button>

            <button 
              onClick={() => {
                setSelectedEventType('all');
                setViewMode('table');
              }}
              className="bg-white rounded-lg shadow-lg p-4 border-l-4 hover:shadow-xl hover:scale-105 transition-all duration-200 text-center"
              style={{ borderColor: theme.colors.success }}
            >
              <div className="text-3xl font-bold" style={{ color: theme.colors.textPrimary }}>
                {eventTypesFromEvents.length}
              </div>
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                Event Types
              </div>
              <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                Click to view all types
              </div>
            </button>

            <button 
              onClick={() => {
                setSelectedEventType('CLINIC');
                setViewMode('calendar');
              }}
              className="bg-white rounded-lg shadow-lg p-4 border-l-4 hover:shadow-xl hover:scale-105 transition-all duration-200 text-center"
              style={{ borderColor: theme.colors.warning }}
            >
              <div className="text-3xl font-bold" style={{ color: theme.colors.textPrimary }}>
                {filteredEvents.filter(e => e.type === 'CLINIC').length}
              </div>
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                Clinics
              </div>
              <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                Click to filter clinics
              </div>
            </button>



            <button 
              onClick={() => {
                setViewMode('table');
              }}
              className="bg-white rounded-lg shadow-lg p-4 border-l-4 hover:shadow-xl hover:scale-105 transition-all duration-200 text-center"
              style={{ borderColor: theme.colors.success }}
            >
              <div className="text-3xl font-bold" style={{ color: theme.colors.textPrimary }}>
                {allGyms.filter(gym => getMissingEventTypes(gym).length === 0).length}/{allGyms.length}
              </div>
              <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                All Events In
              </div>
              <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                Monthly requirements met
              </div>
            </button>
            </div>
          </div>

          {/* 🚀 BULK ACTION BUTTONS - Open All Gyms for Each Event Type */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8" style={{ borderColor: '#cec4c1', borderWidth: '1px' }}>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                🚀 Bulk Actions - Open All Gyms
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">One-Click Access</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    const clinicUrls = getAllUrlsForEventType('CLINIC');
                    openMultipleTabs(
                      clinicUrls,
                      `🚀 Opening ${clinicUrls.length} clinic pages... (allow pop-ups!)`,
                      `✨ Successfully opened all ${clinicUrls.length} clinic pages!`
                    );
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">⭐</span>
                  <div className="text-left">
                    <div className="font-semibold text-purple-800">All Clinics</div>
                    <div className="text-xs text-purple-600">Open all skill clinic pages</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    const knoUrls = getAllUrlsForEventType('KIDS NIGHT OUT');
                    openMultipleTabs(
                      knoUrls,
                      `🌙 Opening ${knoUrls.length} Kids Night Out pages... (allow pop-ups!)`,
                      `✨ Successfully opened all ${knoUrls.length} Kids Night Out pages!`
                    );
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border-2 border-pink-200 hover:border-pink-400 hover:bg-pink-50 transition-all duration-200 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">🌙</span>
                  <div className="text-left">
                    <div className="font-semibold text-pink-800">All Kids Night Out</div>
                    <div className="text-xs text-pink-600">Open all KNO pages</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    const openGymUrls = getAllUrlsForEventType('OPEN GYM');
                    openMultipleTabs(
                      openGymUrls,
                      `🎯 Opening ${openGymUrls.length} open gym pages... (allow pop-ups!)`,
                      `✨ Successfully opened all ${openGymUrls.length} open gym pages!`
                    );
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">🎯</span>
                  <div className="text-left">
                    <div className="font-semibold text-green-800">All Open Gym</div>
                    <div className="text-xs text-green-600">Open all open gym pages</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    const bookingUrls = getAllUrlsForEventType('BOOKING');
                    openMultipleTabs(
                      bookingUrls,
                      `🌐 Opening ${bookingUrls.length} gym booking pages... (allow pop-ups!)`,
                      `✨ Successfully opened all ${bookingUrls.length} gym booking pages!`
                    );
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">🌐</span>
                  <div className="text-left">
                    <div className="font-semibold text-orange-800">All Booking</div>
                    <div className="text-xs text-orange-600">Open all gym booking pages</div>
                  </div>
                </button>
              </div>
              
              <div className="mt-3 text-xs text-gray-600 flex items-center gap-1">
                <span>💡</span>
                <span>Pro tip: Each button opens multiple tabs - make sure your browser allows pop-ups!</span>
              </div>
            </div>
          </div>

          {/* Special Event Statistics by Gym */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8" style={{ borderColor: '#cec4c1', borderWidth: '1px' }}>
            {/* Table Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: theme.colors.textPrimary }}>
                Special Event Statistics by Gym
                <span className="text-sm font-normal ml-2" style={{ color: theme.colors.textSecondary }}>
                  (Click counts to view event pages)
                </span>
              </h2>
              <div className="flex items-center justify-between">
                <div className="text-xs bg-gray-50 px-2 py-1 rounded border">
                  <span className="font-semibold text-gray-700">Monthly: </span>
                  <span className="text-gray-600">
                    {monthlyRequirements['CLINIC']} Clinic • {monthlyRequirements['KIDS NIGHT OUT']} KNO • {monthlyRequirements['OPEN GYM']} Open Gym
                  </span>
                </div>
                <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border" style={{ color: theme.colors.textPrimary }}>Gym</th>
                    {eventTypes.filter(et => et.is_tracked).map((eventType, i) => (
                      <th key={i} className="p-2 border" style={{ color: theme.colors.textPrimary }}>
                        {eventType.display_name || eventType.name}
                      </th>
                    ))}
                    <th className="p-2 border" style={{ color: theme.colors.textPrimary }}>Total Tracked</th>
                    <th className="p-2 border" style={{ color: theme.colors.textPrimary }}>Missing</th>
                  </tr>
                </thead>
                <tbody>
                  {allGyms.map((gym, i) => {
                    const counts = getEventCounts();
                    
                    return (
                      <tr key={i} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-2 border font-medium" style={{ color: theme.colors.textPrimary }}>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => scrollToGym(gym)}
                              className="hover:underline inline-flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors font-medium cursor-pointer"
                              style={{ color: theme.colors.primary }}
                              title={`Jump to ${gym} in calendar`}
                            >
                              {gym}
                              <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </svg>
                            </button>
                            {getGymLinkUrl(gym, 'Booking (Special Events)') && (
                              <a 
                                href={getGymLinkUrl(gym, 'Booking (Special Events)')} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 hover:bg-rose-50 px-1 py-1 rounded transition-colors text-xs"
                                style={{ color: theme.colors.accent }}
                                title={`View all special events at ${gym}`}
                              >
                                <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </td>
                        {Object.keys(monthlyRequirements).map((eventType, j) => {
                          const count = counts[gym]?.[eventType] || 0;
                          const requiredCount = monthlyRequirements[eventType];
                          const isDeficient = count < requiredCount;
                          
                          // Use static source of truth for URLs
                          const url = GYM_EVENT_LINKS[gym]?.[eventType] || GYM_EVENT_LINKS[gym]?.['BOOKING'] || '#';
                          const backgroundColor = getEventTypeColor(eventType);
                          
                          // Adjust background opacity for deficient counts
                          let adjustedBackgroundColor = backgroundColor;
                          if (isDeficient) {
                            // Make deficient counts lighter/more transparent
                            if (backgroundColor.startsWith('#')) {
                              // Convert hex to lighter version
                              const hex = backgroundColor.replace('#', '');
                              const r = parseInt(hex.substr(0, 2), 16);
                              const g = parseInt(hex.substr(2, 2), 16);
                              const b = parseInt(hex.substr(4, 2), 16);
                              adjustedBackgroundColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
                            } else {
                              adjustedBackgroundColor = backgroundColor.replace(')', ', 0.3)').replace('rgb', 'rgba');
                            }
                          }
                          
                          return (
                            <td key={j} className="p-2 border text-center" style={{ color: theme.colors.textPrimary }}>
                              <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="font-bold inline-flex items-center justify-center gap-1 px-3 py-2 rounded transition-all duration-200 hover:scale-105 hover:shadow-md text-gray-700 min-w-[48px] h-[40px]"
                                style={{ backgroundColor: adjustedBackgroundColor }}
                                title={`View ${eventType} page at ${gym} (${count}/${requiredCount})`}
                              >
                                <span className="text-lg font-bold">{count}</span>
                                <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </td>
                          );
                        })}
                        <td className="p-2 border text-center" style={{ color: theme.colors.textPrimary }}>
                          {(() => {
                            const totalCount = counts[gym]?.total || 0;
                            const classesUrl = getGymLinkUrl(gym, 'Classes') || getGymLinkUrl(gym, 'Programs') || getGymLinkUrl(gym, 'Booking (Special Events)');
                            
                            // Calculate if gym meets total monthly requirements
                            const totalRequired = Object.values(monthlyRequirements).reduce((sum, req) => sum + req, 0);
                            const isDeficient = totalCount < totalRequired;
                            
                            // Use booking page from static source
                            const finalUrl = classesUrl || GYM_EVENT_LINKS[gym]?.['BOOKING'] || '#';
                            
                            return (
                              <a 
                                href={finalUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`font-bold inline-flex items-center justify-center gap-1 px-3 py-2 rounded transition-all duration-200 hover:scale-105 hover:shadow-md min-w-[48px] h-[40px] ${
                                  isDeficient ? 'text-red-700' : 'text-gray-700'
                                }`}
                                style={{ backgroundColor: isDeficient ? 'transparent' : 'transparent' }}
                                title={`View all programs at ${gym} (${totalCount}/${totalRequired})`}
                              >
                                <span className="text-lg font-bold">{totalCount}</span>
                                <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            );
                          })()}
                        </td>
                        <td className="p-2 border text-xs">
                          {getMissingEventTypes(gym).length > 0 ? (
                            <span style={{ color: theme.colors.error }}>
                              {getMissingEventTypes(gym).join(', ')}
                            </span>
                          ) : (
                            <span style={{ color: theme.colors.success }}>
                              ✅ All events in
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2 flex items-center gap-1" style={{ color: theme.colors.textSecondary }}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Click gym names or event counts to view their special event pages • ☀️ Summer camps are shown for reference but not required
            </p>


          </div>

          {/* Controls */}
          <div className="mb-6 space-y-4">
            {/* Month Navigation */}
            <div ref={monthNavRef} className="flex justify-center items-center gap-4 mb-4">
              <button
                onClick={goToPreviousMonth}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <h2 className="text-2xl font-bold px-6 py-2 rounded-full text-white shadow-md"
                  style={{ backgroundColor: theme.colors.accent }}>
                {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
              
              <button
                onClick={goToNextMonth}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedGym}
                  onChange={(e) => setSelectedGym(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white shadow-sm"
                >
                  <option value="all">All Gyms</option>
                  {gymsList.map(gym => (
                    <option key={gym.id} value={gym.name}>{gym.name}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white shadow-sm"
                >
                  <option value="all">All Event Types</option>
                  {eventTypesFromEvents.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white shadow-sm"
                />
              </div>

              <button
                onClick={() => setViewMode(viewMode === 'calendar' ? 'table' : 'calendar')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border hover:bg-gray-50 transition-colors shadow-sm"
              >
                {viewMode === 'calendar' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                {viewMode === 'calendar' ? 'Table View' : 'Calendar View'}
              </button>

              <button
                onClick={() => setShowAddEventModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:scale-105 shadow-sm"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  color: 'white',
                  borderColor: theme.colors.primary
                }}
              >
                <Plus className="w-4 h-4" />
                Add Event
              </button>
            </div>
          </div>

        

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold" style={{ color: theme.colors.textPrimary }}>
                Events Table View ({filteredEvents.length} events)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gym</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="text-4xl mb-4">📅</div>
                          <div className="text-lg font-medium">No events found</div>
                          <div className="text-sm">Try adjusting your filters or check the database connection</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(event.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{event.title || 'Untitled Event'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: getEventTypeColor(event.type || event.event_type),
                              color: '#374151'
                            }}
                          >
                            {event.type || event.event_type || 'No Type'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {event.gym_name || event.gym_code || 'Unknown Gym'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(event.time || event.event_time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event.price || ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {event.event_url && (
                              <button
                                onClick={() => window.open(event.event_url, '_blank')}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View
                              </button>
                            )}
                            {event.registration_url && (
                              <button
                                onClick={() => window.open(event.registration_url, '_blank')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Register
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
            <div className="space-y-6">
              {/* Calendar Info Panel */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold" style={{ color: theme.colors.textPrimary }}>
                      Calendar View
                    </h3>
                    <div className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: theme.colors.secondary, color: theme.colors.textPrimary }}>
                      {calendarView === 'firstHalf' && `Days 1-15`}
                      {calendarView === 'secondHalf' && `Days 16-${getDaysInMonth(currentYear, currentMonth)}`}
                      {calendarView === 'full' && `Full Month (1-${getDaysInMonth(currentYear, currentMonth)})`}
                      {calendarView === 'week1' && `Week 1 (Days 1-7)`}
                      {calendarView === 'week2' && `Week 2 (Days 8-14)`}
                      {calendarView === 'week3' && `Week 3 (Days 15-21)`}
                      {calendarView === 'week4' && `Week 4+ (Days 22-${getDaysInMonth(currentYear, currentMonth)})`}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-0">
                        <button
                          onClick={() => handleCalendarViewChange('firstHalf')}
                          className={`px-3 py-1 rounded-l-full text-sm font-medium transition-all duration-200 ${
                            calendarView === 'firstHalf'
                              ? 'text-white shadow-lg'
                              : 'text-gray-600 bg-white border hover:shadow-md'
                          }`}
                          style={calendarView === 'firstHalf' ? { backgroundColor: theme.colors.primary } : {}}
                        >
                          Days 1-15
                        </button>
                        <button
                          onClick={() => handleCalendarViewChange('secondHalf')}
                          className={`px-3 py-1 rounded-r-full text-sm font-medium transition-all duration-200 ${
                            calendarView === 'secondHalf'
                              ? 'text-white shadow-lg'
                              : 'text-gray-600 bg-white border hover:shadow-md'
                          }`}
                          style={calendarView === 'secondHalf' ? { backgroundColor: theme.colors.primary } : {}}
                        >
                          Days 16-{getDaysInMonth(currentYear, currentMonth)}
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleCalendarViewChange('full')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                          calendarView === 'full'
                            ? 'text-white shadow-lg'
                            : 'text-gray-600 bg-white border hover:shadow-md'
                        }`}
                        style={calendarView === 'full' ? { backgroundColor: theme.colors.primary } : {}}
                      >
                        Full Month
                      </button>

                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 mr-1">Quick:</span>
                        <button
                          onClick={() => handleCalendarViewChange('week1')}
                          className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                            calendarView === 'week1'
                              ? 'text-white shadow-md'
                              : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                          }`}
                          style={calendarView === 'week1' ? { backgroundColor: theme.colors.accent } : {}}
                        >
                          Week 1
                        </button>
                        <button
                          onClick={() => handleCalendarViewChange('week2')}
                          className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                            calendarView === 'week2'
                              ? 'text-white shadow-md'
                              : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                          }`}
                          style={calendarView === 'week2' ? { backgroundColor: theme.colors.accent } : {}}
                        >
                          Week 2
                        </button>
                        <button
                          onClick={() => handleCalendarViewChange('week3')}
                          className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                            calendarView === 'week3'
                              ? 'text-white shadow-md'
                              : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                          }`}
                          style={calendarView === 'week3' ? { backgroundColor: theme.colors.accent } : {}}
                        >
                          Week 3
                        </button>
                        <button
                          onClick={() => handleCalendarViewChange('week4')}
                          className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                            calendarView === 'week4'
                              ? 'text-white shadow-md'
                              : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                          }`}
                          style={calendarView === 'week4' ? { backgroundColor: theme.colors.accent } : {}}
                        >
                          Week 4+
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" style={{ color: theme.colors.primary }} />
                    <button 
                      className="px-4 py-2 rounded-lg text-white font-medium hover:scale-105 transition-transform"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      Add Event
                    </button>
                  </div>
                </div>

                {/* Event Type Legend - Horizontal and Compact */}
                <div className="mt-6 border-t pt-4 text-center" style={{ borderColor: theme.colors.secondary }}>
                  <h4 className="text-sm font-semibold mb-3" style={{ color: theme.colors.textPrimary }}>
                    Event Type Legend
                  </h4>
                  
                  {/* Tracked Events in one row */}
                  <div className="mb-3 flex justify-center items-center flex-wrap">
                    <span className="text-xs font-medium mr-3" style={{ color: theme.colors.textSecondary }}>
                      Required Events:
                    </span>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {eventTypes.filter(et => et.is_tracked).map((eventTypeData, index) => {
                        const eventType = eventTypeData.name;
                        return (
                        <div key={index} className="flex items-center">
                          <div
                            className="w-3 h-3 rounded mr-1 border"
                              style={{ 
                              backgroundColor: getEventTypeColor(eventType),
                                borderColor: 'rgba(0,0,0,0.1)'
                              }}
                            />
                          <span className="text-xs">{eventTypeData.display_name || eventType}</span>
                          </div>
                        );
                      })}
                      </div>
                    </div>


                </div>

                <div className="mt-4 text-xs" style={{ color: theme.colors.textSecondary }}>
                  <p>• Hover over event cards to see details and copy registration URLs</p>
                  <p>• Click gym buttons above to quickly jump to that gym's calendar section</p>
                </div>
              </div>

              {/* Calendar Grid - FULL WIDTH */}

              <div ref={calendarRef} className="w-full overflow-x-auto rounded-xl shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
                <div className="min-w-full">
                  {/* Calendar Header */}
                  <div className="grid sticky top-0 z-30 border-b-2" 
                       style={{ 
                         gridTemplateColumns: `200px repeat(${displayDates.length}, 1fr)`,
                         backgroundColor: theme.colors.secondary,
                         borderColor: theme.colors.primary
                       }}>
                    {/* Gym Header */}
                    <div className="p-3 font-bold text-center border-r-2" style={{ borderColor: theme.colors.primary }}>
                      Gym
                    </div>
                    
                    {/* Date Headers */}
                    {displayDates.map(date => (
                      <div key={date} className="p-2 text-center font-medium border-r border-gray-200 min-w-0">
                        <div className="text-sm font-bold">{date}</div>
                        <div className="text-xs text-gray-600">
                          {new Date(currentYear, currentMonth, date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Body */}
                  <div className="divide-y divide-gray-200">
                    {allGymsFromList.map(gym => {
                      const gymEvents = filteredEvents.filter(e => (e.gym_name || e.gym_code) === gym);
                      
                      return (
                        <div
                          key={gym}
                          ref={el => gymRefs.current[gym] = el}
                          className="grid hover:bg-gray-50 transition-colors"
                          style={{ gridTemplateColumns: `200px repeat(${displayDates.length}, 1fr)` }}
                        >
                          {/* Gym Name Column */}
                          <div className="p-4 font-medium border-r-2 bg-gray-50 flex items-center justify-center"
                               style={{ borderColor: theme.colors.primary }}>
                            <div className="text-center">
                              <div className="font-bold text-sm">{gym}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                {gymEvents.length} event{gymEvents.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                          
                          {/* Date Columns */}
                          {displayDates.map(date => {
                            const dateEvents = gymEvents.filter(event => {
                              if (!event.date) return false;
                              const eventDate = parseYmdLocal(event.date);
                              // Check if event is in current month/year and on the specific date
                              return eventDate.getFullYear() === currentYear && 
                                     eventDate.getMonth() === currentMonth && 
                                     eventDate.getDate() === date;
                            });
                            
                            // Debug: Log events for first gym to see what's happening
                            if (gym === allGymsFromList[0] && dateEvents.length > 0) {
                              console.log(`Date ${date}: Found ${dateEvents.length} events`, dateEvents);
                            }
                            
                            return (
                              <div key={`${gym}-${date}`} className="p-1 border-r border-gray-200 min-h-[100px] relative">
                                <div className="space-y-1">
                                  {dateEvents.length > 0 ? (
                                    dateEvents.map(event => (
                                      <div
                                        key={event.id}
                                        className="relative group cursor-pointer"
                                        onMouseEnter={(e) => {
                                          if (hidePopoverTimeoutRef.current) clearTimeout(hidePopoverTimeoutRef.current);
                                          setHoveredEvent({ event, position: { x: e.clientX, y: e.clientY } });
                                        }}
                                        onMouseLeave={() => {
                                          if (hidePopoverTimeoutRef.current) clearTimeout(hidePopoverTimeoutRef.current);
                                          hidePopoverTimeoutRef.current = setTimeout(() => setHoveredEvent(null), 200);
                                        }}
                                      >
                                                                              <div
                                        className="text-xs p-2 rounded text-gray-700 text-center font-medium hover:scale-105 transition-transform duration-150 border"
                                        style={{ 
                                          backgroundColor: getEventTypeColor(event.type || event.event_type),
                                          borderColor: 'rgba(0,0,0,0.1)'
                                        }}
                                      >
                                        <div className="font-semibold text-xs leading-tight">
                                          {event.title || event.type || event.event_type || 'Event'}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-0.5 leading-tight">
                                          {formatTime(event.time || event.event_time) || ''}
                                        </div>
                                      </div>
                                        
                                        {/* Edit Button - Click to open edit modal */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditEvent(event);
                                          }}
                                          className="absolute top-0 right-0 w-4 h-4 bg-blue-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-blue-600 text-xs"
                                          title="Edit event"
                                        >
                                          ✎
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    // Show placeholder for debugging
                                    <div className="text-xs text-gray-400 p-1">
                                      {/* Empty */}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Event Hover Popover */}
              {hoveredEvent && (
                <div
                  className="fixed z-50 pointer-events-auto"
                  style={{
                    left: hoveredEvent.position.x + 10,
                    top: hoveredEvent.position.y - 120,
                  }}
                  onMouseEnter={() => {
                    if (hidePopoverTimeoutRef.current) clearTimeout(hidePopoverTimeoutRef.current);
                  }}
                  onMouseLeave={() => {
                    if (hidePopoverTimeoutRef.current) clearTimeout(hidePopoverTimeoutRef.current);
                    hidePopoverTimeoutRef.current = setTimeout(() => setHoveredEvent(null), 150);
                  }}
                >
                  <div className="bg-white rounded-xl shadow-lg border p-4 w-72 relative" style={{
                    borderColor: '#e5e7eb',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}>
                                         {/* Event Type Badge */}
                     <div className="flex items-center justify-between mb-3">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-700 border"
                             style={{ 
                               backgroundColor: getEventTypeColor(hoveredEvent.event.type || hoveredEvent.event.event_type),
                               borderColor: 'rgba(0,0,0,0.1)'
                             }}>
                         {hoveredEvent.event.type || hoveredEvent.event.event_type || 'EVENT'}
                       </span>
                     </div>
                    
                    {/* Event Title */}
                    <h4 className="font-semibold text-base mb-3 text-gray-800">
                      {hoveredEvent.event.title || `${hoveredEvent.event.type || hoveredEvent.event.event_type} Event`}
                    </h4>
                    
                    {/* Event Details */}
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{gymsList.find(g => g.gym_code === hoveredEvent.event.gym_code)?.name || 
                               gymsList.find(g => g.name === hoveredEvent.event.gym_name)?.name || 
                               hoveredEvent.event.gym_name || hoveredEvent.event.gym_code}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{parseYmdLocal(hoveredEvent.event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{formatTime(hoveredEvent.event.time || hoveredEvent.event.event_time) || ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-800">{hoveredEvent.event.price || ''}</span>
                      </div>
                    </div>
                    
                                         {/* Action Buttons */}
                     <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                       <button
                         onClick={() => {
                           const url = hoveredEvent.event.event_url || hoveredEvent.event.registration_url;
                           if (url) {
                             window.open(url, '_blank');
                           }
                         }}
                         className="flex-1 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all hover:scale-105 hover:shadow-lg pointer-events-auto flex items-center justify-center gap-1.5"
                         style={{ backgroundColor: theme.colors.primary }}
                       >
                         ✨ View Details
                       </button>
                      <button
                        onClick={() => {
                          const url = hoveredEvent.event.event_url || hoveredEvent.event.registration_url;
                          if (url) {
                            copyToClipboard(url, hoveredEvent.event.id);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all pointer-events-auto ${
                          copiedUrl === hoveredEvent.event.id 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                        }`}
                        title="Copy registration URL"
                      >
                        {copiedUrl === hoveredEvent.event.id ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copiedUrl === hoveredEvent.event.id ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Removed floating left calendar nav (redundant after relocating the panel above the grid) */}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 z-40"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <ChevronUp className="w-6 h-6 text-white mx-auto" />
        </button>
      )}
    </div>
  );
};

export default EventsDashboard; 