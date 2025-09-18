import { supabase } from './supabase'

// Gyms API
export const gymsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('gyms')
      .select('*')
      .order('name')
    
    if (error) throw new Error(error.message)
    return data
  },

  async create(gym) {
    const { data, error } = await supabase
      .from('gyms')
      .insert([gym])
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('gyms')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('gyms')
      .delete()
      .eq('id', id)
    
    if (error) throw new Error(error.message)
  }
}

// Events API
export const eventsApi = {
  // Bulk import for admin workflow
  async bulkImport(events) {
    if (!events || !Array.isArray(events) || events.length === 0) {
      throw new Error('Invalid events data: must be non-empty array');
    }
    
    // Validate each event has required fields
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (!event.gym_id || !event.date || !event.type || !event.event_url || !event.title) {
        throw new Error(`Event ${i + 1} missing required fields (gym_id, title, date, type, event_url)`);
      }
      
      // Auto-populate start_date and end_date if missing
      if (!event.start_date) event.start_date = event.date;
      if (!event.end_date) event.end_date = event.date;
      
      // Validate date format
      const dateTest = new Date(event.date);
      if (isNaN(dateTest.getTime())) {
        throw new Error(`Event ${i + 1} has invalid date format: ${event.date}`);
      }
    }
    
    try {
      console.log('Sending to Supabase:', events);
      
      // Use simple insert instead of upsert to avoid constraint issues
      const { data, error } = await supabase
        .from('events')
        .insert(events)
        .select();
      
      if (error) {
        console.error('Supabase bulk import error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        console.warn('Bulk import returned no data');
      }
      
      return data || [];
    } catch (networkError) {
      console.error('Network error during bulk import:', networkError);
      throw new Error(`Failed to save events: ${networkError.message}`);
    }
  },

  async getAll(startDate, endDate) {
    let query = supabase
      .from('events_with_gym')
      .select('*')
      .order('date', { ascending: true })
    
    if (startDate) {
      query = query.gte('date', startDate)
    }
    if (endDate) {
      query = query.lte('date', endDate)
    }
    
    const { data, error } = await query
    
    if (error) throw new Error(error.message)
    return data
  },

  async create(event) {
    // First get the gym name for the event
    const { data: gym } = await supabase
      .from('gyms')
      .select('name')
      .eq('id', event.gym_id)
      .single()
    
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    
    // Add gym_name for frontend compatibility
    return {
      ...data,
      gym_name: gym?.name || 'Unknown'
    }
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    
    // Get gym name if gym_id was updated
    if (updates.gym_id) {
      const { data: gym } = await supabase
        .from('gyms')
        .select('name')
        .eq('id', updates.gym_id)
        .single()
      
      data.gym_name = gym?.name || 'Unknown'
    }
    
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    
    if (error) throw new Error(error.message)
  }
}

// Event Types API
export const eventTypesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('event_types')
      .select('*')
      .order('name')
    
    if (error) throw new Error(error.message)
    return data
  },

  async getTrackedTypes() {
    const { data, error } = await supabase
      .from('event_types')
      .select('*')
      .eq('is_tracked', true)
      .order('name')
    
    if (error) throw new Error(error.message)
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('event_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  }
} 

export const monthlyRequirementsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('monthly_requirements')
      .select('*')
      .order('event_type');
    if (error) throw new Error(error.message);
    return data || [];
  }
}; 