const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xftiwouxpefchwoxxgpf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdGl3b3V4cGVmY2h3b3h4Z3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODc1MjUsImV4cCI6MjA2NjI2MzUyNX0.jQReOgyjYxOaig_IoJv3jhhPzlfumUcn-vkS1yF9hY4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getAllData() {
  try {
    console.log('=== EXTRACTING ALL DATABASE DATA FOR EMAIL VERIFICATION ===\n');
    
    // Get gyms data
    console.log('=== GYMS DATA ===');
    const { data: gyms, error: gymsError } = await supabase.from('gyms').select('*');
    if (gymsError) throw gymsError;
    console.log(JSON.stringify(gyms, null, 2));
    
    // Get events data
    console.log('\n=== EVENTS DATA ===');
    const { data: events, error: eventsError } = await supabase.from('events').select('*');
    if (eventsError) throw eventsError;
    console.log(JSON.stringify(events, null, 2));
    
    // Get gym brand colors
    console.log('\n=== GYM BRAND COLORS ===');
    const { data: colors, error: colorsError } = await supabase.from('gym_brand_colors').select('*');
    if (colorsError) throw colorsError;
    console.log(JSON.stringify(colors, null, 2));
    
    // Get gym links detailed
    console.log('\n=== GYM LINKS DETAILED ===');
    const { data: links, error: linksError } = await supabase.from('gym_links_detailed').select('*');
    if (linksError) throw linksError;
    console.log(JSON.stringify(links, null, 2));
    
    // Get event types
    console.log('\n=== EVENT TYPES ===');
    const { data: eventTypes, error: eventTypesError } = await supabase.from('event_types').select('*');
    if (eventTypesError) throw eventTypesError;
    console.log(JSON.stringify(eventTypes, null, 2));
    
    console.log('\n=== DATA EXTRACTION COMPLETE ===');
    
  } catch (error) {
    console.error('Error extracting data:', error);
  }
}

getAllData();


