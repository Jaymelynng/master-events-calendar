const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xftiwouxpefchwoxxgpf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdGl3b3V4cGVmY2h3b3h4Z3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODc1MjUsImV4cCI6MjA2NjI2MzUyNX0.jQReOgyjYxOaig_IoJv3jhhPzlfumUcn-vkS1yF9hY4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getEventsData() {
  try {
    console.log('=== EXTRACTING EVENTS DATA ===\n');
    
    // Get all events
    const { data: events, error: eventsError } = await supabase.from('events').select('*').order('date', { ascending: true });
    if (eventsError) throw eventsError;
    
    console.log(`Found ${events.length} events in database:`);
    console.log(JSON.stringify(events, null, 2));
    
    // Get gym brand colors that might have been missed
    console.log('\n=== GYM BRAND COLORS ===');
    const { data: colors, error: colorsError } = await supabase.from('gym_brand_colors').select('*');
    if (colorsError) throw colorsError;
    console.log(JSON.stringify(colors, null, 2));
    
    console.log('\n=== GYMS LIST ===');
    const { data: gyms, error: gymsError } = await supabase.from('gyms').select('*');
    if (gymsError) throw gymsError;
    console.log(JSON.stringify(gyms, null, 2));
    
  } catch (error) {
    console.error('Error extracting events data:', error);
  }
}

getEventsData();


