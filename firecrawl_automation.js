// 🔥 FIRECRAWL AUTOMATION SCRIPT FOR JAYME'S EVENTS
// Automated event collection from all 10 gyms

const FIRECRAWL_API_KEY = 'fc-73ec5beef80242c89c923872e6f6eca5';
const FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v2/scrape'; // Correct v2 endpoint

// All gym event category URLs (customer portal - no login needed)
const GYM_EVENT_URLS = [
  // Houston Gymnastics Academy
  'https://portal.iclasspro.com/houstongymnastics/camps/2',  // Skill Clinics
  'https://portal.iclasspro.com/houstongymnastics/camps/7',  // Kids Night Out
  'https://portal.iclasspro.com/houstongymnastics/camps/15', // Open Gym
  
  // Capital Gymnastics Cedar Park
  'https://portal.iclasspro.com/capgymavery/camps/7',   // Skill Clinics  
  'https://portal.iclasspro.com/capgymavery/camps/13',  // Kids Night Out
  'https://portal.iclasspro.com/capgymavery/camps/17',  // Open Gym
  
  // Capital Gymnastics Pflugerville
  'https://portal.iclasspro.com/capgymhp/camps/31',     // Skill Clinics
  'https://portal.iclasspro.com/capgymhp/camps/2',      // Kids Night Out  
  'https://portal.iclasspro.com/capgymhp/camps/81',     // Open Gym
  
  // Capital Gymnastics Round Rock
  'https://portal.iclasspro.com/capgymroundrock/camps/28', // Skill Clinics
  'https://portal.iclasspro.com/capgymroundrock/camps/26', // Kids Night Out
  'https://portal.iclasspro.com/capgymroundrock/camps/35', // Open Gym
  
  // Rowland Ballard Atascocita
  'https://portal.iclasspro.com/rbatascocita/camps/33',     // Skill Clinics
  'https://portal.iclasspro.com/rbatascocita/camps/35',     // Kids Night Out
  'https://portal.iclasspro.com/rbatascocita/camps/76',     // Open Gym
  
  // Rowland Ballard Kingwood
  'https://portal.iclasspro.com/rbkingwood/camps/31',       // Skill Clinics
  'https://portal.iclasspro.com/rbkingwood/camps/26',       // Kids Night Out
  'https://portal.iclasspro.com/rbkingwood/camps/6',        // Open Gym
  
  // Estrella Gymnastics
  'https://portal.iclasspro.com/estrellagymnastics/camps/24', // Skill Clinics
  'https://portal.iclasspro.com/estrellagymnastics/camps/3',  // Kids Night Out
  'https://portal.iclasspro.com/estrellagymnastics/camps/12', // Open Gym
  
  // Oasis Gymnastics
  'https://portal.iclasspro.com/oasisgymnastics/camps/33',   // Skill Clinics
  'https://portal.iclasspro.com/oasisgymnastics/camps/27',   // Kids Night Out
  'https://portal.iclasspro.com/oasisgymnastics/camps/60',   // Open Gym
  
  // Scottsdale Gymnastics
  'https://portal.iclasspro.com/scottsdalegymnastics/camps/28', // Skill Clinics
  'https://portal.iclasspro.com/scottsdalegymnastics/camps/32', // Kids Night Out
  'https://portal.iclasspro.com/scottsdalegymnastics/camps/5',  // Open Gym
  
  // Tigar Gymnastics
  'https://portal.iclasspro.com/tigar/camps/2',   // Skill Clinics
  'https://portal.iclasspro.com/tigar/camps/8',   // Kids Night Out
  'https://portal.iclasspro.com/tigar/camps/22'   // Open Gym
];

// Event extraction schema
const eventExtractionSchema = {
  events: [{
    title: "Event title",
    date: "Event date", 
    time: "Event time",
    price: "Event price",
    registrationUrl: "Registration link URL",
    gymName: "Gym name"
  }]
};

// Main automation function
async function collectAllGymEvents() {
  console.log('🚀 Starting automated event collection...');
  
  const allEvents = [];
  
  // Process each gym page
  for (const url of GYM_EVENT_URLS) {
    try {
      console.log(`📄 Processing: ${url}`);
      
      const response = await fetch(FIRECRAWL_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          formats: [{
            type: "json",
            schema: eventExtractionSchema
          }],
          actions: [
            { type: 'wait', milliseconds: 3000 } // Wait for JavaScript to load
          ],
          onlyMainContent: true
        })
      });
      
      const result = await response.json();
      
      if (result.success && result.data?.json) {
        const extractedData = result.data.json;
        // Handle both array of events or single event object
        const events = Array.isArray(extractedData) ? extractedData : 
                      extractedData.events ? extractedData.events : [extractedData];
        
        const gymEvents = events.map(event => ({
          ...event,
          sourceUrl: url,
          collectedAt: new Date().toISOString()
        }));
        
        allEvents.push(...gymEvents);
        console.log(`✅ Found ${gymEvents.length} events from ${url}`);
      } else {
        console.log(`❌ Failed to scrape ${url}:`, result.error || 'Unknown error');
        console.log('Full response:', JSON.stringify(result, null, 2));
      }
      
      // Respectful delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ Error processing ${url}:`, error.message);
    }
  }
  
  console.log(`📊 Total events collected: ${allEvents.length}`);
  return allEvents;
}

// Change detection function
async function detectEventChanges(newEvents, existingEvents) {
  const changes = {
    new: [],
    changed: [],
    deleted: []
  };
  
  // Find new events
  newEvents.forEach(newEvent => {
    const existing = existingEvents.find(e => 
      e.title === newEvent.title && 
      e.date === newEvent.date
    );
    
    if (!existing) {
      changes.new.push(newEvent);
    } else if (
      existing.time !== newEvent.time ||
      existing.price !== newEvent.price
    ) {
      changes.changed.push({
        event: newEvent,
        changes: {
          time: existing.time !== newEvent.time ? {old: existing.time, new: newEvent.time} : null,
          price: existing.price !== newEvent.price ? {old: existing.price, new: newEvent.price} : null
        }
      });
    }
  });
  
  // Find deleted events
  existingEvents.forEach(existingEvent => {
    const stillExists = newEvents.find(e => 
      e.title === existingEvent.title && 
      e.date === existingEvent.date
    );
    
    if (!stillExists) {
      changes.deleted.push(existingEvent);
    }
  });
  
  return changes;
}

// Export functions for use in your app
module.exports = {
  collectAllGymEvents,
  detectEventChanges
};

// Test run (comment out for production)
if (require.main === module) {
  console.log('🧪 TESTING FIRECRAWL AUTOMATION...');
  collectAllGymEvents()
    .then(events => {
      console.log('✅ Test completed!');
      console.log('📊 Sample events:', events.slice(0, 3));
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
    });
}
