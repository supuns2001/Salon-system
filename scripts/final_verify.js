
require('dotenv').config();

const BASE_URL = 'http://localhost:3000';

async function testAPIs() {
  console.log('--- Starting API Verification ---');

  try {
    // 1. Test Working Hours
    console.log('\nTesting Working Hours API...');
    const whRes = await fetch(`${BASE_URL}/api/working-hours`);
    console.log('GET /api/working-hours:', whRes.status === 200 ? 'SUCCESS' : 'FAILED');

    // 2. Test Staff Schedule
    console.log('\nTesting Staff Schedule API...');
    const ssRes = await fetch(`${BASE_URL}/api/staff-schedule`);
    console.log('GET /api/staff-schedule:', ssRes.status === 200 ? 'SUCCESS' : 'FAILED');

    // 3. Test Availability
    const today = new Date().toISOString().split('T')[0];
    console.log(`\nTesting Booking Availability for ${today}...`);
    const avRes = await fetch(`${BASE_URL}/api/booking/availability?date=${today}`);
    console.log('GET /api/booking/availability:', avRes.status === 200 ? 'SUCCESS' : 'FAILED');
    const avData = await avRes.json();
    console.log('Result:', JSON.stringify(avData).substring(0, 100) + '...');

    // 4. Test Reports Dashboard
    console.log('\nTesting Reports Dashboard API...');
    const repRes = await fetch(`${BASE_URL}/api/reports/dashboard`);
    console.log('GET /api/reports/dashboard:', repRes.status === 200 ? 'SUCCESS' : 'FAILED');
    const repData = await repRes.json();
    console.log('Totals:', repData.summary);

    // 5. Test Appointments Filter
    console.log('\nTesting Appointments Filter...');
    const aptRes = await fetch(`${BASE_URL}/api/appointments?filter=upcoming`);
    console.log('GET /api/appointments?filter=upcoming:', aptRes.status === 200 ? 'SUCCESS' : 'FAILED');

    console.log('\n--- Verification Completed ---');
  } catch (error) {
    console.error('\nVerification FAILED:', error.message);
  }
}

testAPIs();
