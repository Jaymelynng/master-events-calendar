// URL Processing Script for Jayme's Workflow
// Run this after collecting URLs with browser extension

const collectedUrls = [
  'https://portal.iclasspro.com/capgymhp/camp-details/2478?typeId=81&filters=%7B%22sorting%22:%22name%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
  'https://portal.iclasspro.com/capgymhp/camp-details/2479?typeId=81&filters=%7B%22sorting%22:%22name%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
  'https://portal.iclasspro.com/capgymhp/camp-details/2480?typeId=81&filters=%7B%22sorting%22:%22name%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
  'https://portal.iclasspro.com/capgymhp/camp-details/2477?typeId=81&filters=%7B%22sorting%22:%22name%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
  'https://portal.iclasspro.com/capgymhp/camp-details/2481?typeId=81&filters=%7B%22sorting%22:%22name%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
  'https://portal.iclasspro.com/capgymhp/camp-details/2482?typeId=81&filters=%7B%22sorting%22:%22name%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM',
  'https://portal.iclasspro.com/capgymhp/camp-details/2483?typeId=81&filters=%7B%22sorting%22:%22name%22%7D&campTypeName=OPEN%20GYM&campTypeNamePlural=OPEN%20GYM'
];

console.log(`🎯 PROCESSING ${collectedUrls.length} COLLECTED URLS`);
console.log(`🏢 Detected Gym: Capital Gymnastics Pflugerville (CGP)`);
console.log(`📅 Detected Type: OPEN GYM`);
console.log('');

console.log('📋 STEP 1: Copy this list and visit each URL to collect details:');
console.log('');

collectedUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
  console.log(`   📝 TODO: Get date, time, title from this page`);
  console.log('');
});

console.log('📋 STEP 2: Use this template and fill in the collected details:');
console.log('');

const template = `[
${collectedUrls.map((url, index) => `  {
    "gym_id": "CGP",
    "title": "REPLACE_WITH_ACTUAL_TITLE_${index + 1}",
    "date": "REPLACE_WITH_ACTUAL_DATE_${index + 1}",
    "time": "REPLACE_WITH_ACTUAL_TIME_${index + 1}",
    "price": null,
    "type": "OPEN GYM",
    "event_url": "${url}"
  }`).join(',\n')}
]`;

console.log(template);

console.log('');
console.log('📋 STEP 3: Replace the placeholder values with actual data from each URL');
console.log('📋 STEP 4: Copy the completed JSON into your bulk import tool');
