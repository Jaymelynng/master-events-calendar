// 🧪 FIRECRAWL TEST SCRIPT
// Test with single Houston Gymnastics Academy page first

const FIRECRAWL_API_KEY = 'fc-73ec5beef80242c89c923872e6f6eca5';

async function testFirecrawl() {
  console.log('🧪 Testing Firecrawl with Houston Gymnastics Academy...');
  
  const testUrl = 'https://portal.iclasspro.com/houstongymnastics/camps/7'; // Kids Night Out
  
  try {
    const response = await fetch('https://api.firecrawl.dev/v2/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: testUrl,
        formats: [{
          type: "json",
          prompt: "Extract all gymnastics events from this page. For each event, get the title, date, time, price, and registration URL. Return as an array called 'events'."
        }],
        actions: [
          { type: 'wait', milliseconds: 5000 } // Wait for page to fully load
        ],
        onlyMainContent: true
      })
    });
    
    const result = await response.json();
    
    console.log('📊 FIRECRAWL RESPONSE:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ FIRECRAWL SUCCESSFUL!');
      console.log('📝 Extracted data:', result.data?.json);
    } else {
      console.log('❌ FIRECRAWL FAILED:', result.error);
    }
    
  } catch (error) {
    console.error('❌ REQUEST FAILED:', error.message);
  }
}

// Run test
testFirecrawl();


