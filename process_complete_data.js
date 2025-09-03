// COMPLETE DATA PROCESSING - Jayme's Full Workflow
// Combines event listing data + collected URLs

// STEP 1: Event details from listing page
const eventListingData = `
Gym Fun Fridays | Sept 12 | 10:00-11:30am | $10
Sep 12th, 2025 - Sep 12th, 2025

Gym Fun Fridays | Sept 19 | 10:00-11:30am | $10
Sep 19th, 2025 - Sep 19th, 2025

Gym Fun Fridays | Sept 26 | 10:00-11:30am | $10
Sep 26th, 2025 - Sep 26th, 2025

Gym Fun Fridays | Sept 5 | 10:00-11:30am | $10
Sep 5th, 2025 - Sep 5th, 2025

Homeschool Free Play| September 10 |10:00-11:30am |$10
Sep 10th, 2025 - Sep 10th, 2025

Homeschool Free Play| September 17 |10:00-11:30am |$10
Sep 17th, 2025 - Sep 17th, 2025

Homeschool Free Play| September 24 |10:00-11:30am |$10
Sep 24th, 2025 - Sep 24th, 2025
`;

// STEP 2: URLs collected from browser extension
const collectedUrls = [
  'https://portal.iclasspro.com/capgymhp/camp-details/2478?typeId=81',
  'https://portal.iclasspro.com/capgymhp/camp-details/2479?typeId=81', 
  'https://portal.iclasspro.com/capgymhp/camp-details/2480?typeId=81',
  'https://portal.iclasspro.com/capgymhp/camp-details/2477?typeId=81',
  'https://portal.iclasspro.com/capgymhp/camp-details/2481?typeId=81',
  'https://portal.iclasspro.com/capgymhp/camp-details/2482?typeId=81',
  'https://portal.iclasspro.com/capgymhp/camp-details/2483?typeId=81'
];

// STEP 3: Parse event details
const events = [
  {
    title: "Gym Fun Fridays",
    date: "2025-09-12", 
    time: "10:00 AM - 11:30 AM",
    price: "10"
  },
  {
    title: "Gym Fun Fridays", 
    date: "2025-09-19",
    time: "10:00 AM - 11:30 AM", 
    price: "10"
  },
  {
    title: "Gym Fun Fridays",
    date: "2025-09-26",
    time: "10:00 AM - 11:30 AM",
    price: "10" 
  },
  {
    title: "Gym Fun Fridays",
    date: "2025-09-05", 
    time: "10:00 AM - 11:30 AM",
    price: "10"
  },
  {
    title: "Homeschool Free Play",
    date: "2025-09-10",
    time: "10:00 AM - 11:30 AM",
    price: "10"
  },
  {
    title: "Homeschool Free Play", 
    date: "2025-09-17",
    time: "10:00 AM - 11:30 AM",
    price: "10"
  },
  {
    title: "Homeschool Free Play",
    date: "2025-09-24", 
    time: "10:00 AM - 11:30 AM",
    price: "10"
  }
];

// STEP 4: Combine into final JSON for bulk import
const finalJson = events.map((event, index) => ({
  gym_id: "CGP",
  title: event.title,
  date: event.date,
  time: event.time, 
  price: parseFloat(event.price),
  type: "OPEN GYM",
  event_url: collectedUrls[index] || ""
}));

console.log('🎯 COMPLETE BULK IMPORT DATA READY:');
console.log('');
console.log(JSON.stringify(finalJson, null, 2));
console.log('');
console.log('📋 READY TO PASTE INTO YOUR BULK IMPORT MODAL!');
