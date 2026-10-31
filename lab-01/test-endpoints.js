const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const routesToTest = [
  { path: '/', expectedStatus: 200, label: 'Root Endpoint' },
  { path: '/about', expectedStatus: 200, label: 'About Endpoint' },
  { path: '/time', expectedStatus: 200, label: 'Time Endpoint' },
  { path: '/unknown-route', expectedStatus: 404, label: '404 Fallback Handler' }
];

async function runTests() {
  console.log('='.repeat(60));
  console.log(`🧪 Automated Route Tester - Target: ${BASE_URL}`);
  console.log('='.repeat(60));

  let allPassed = true;

  for (const route of routesToTest) {
    try {
      const url = new URL(route.path, BASE_URL);
      const res = await fetch(url.href);
      const isExpected = res.status === route.expectedStatus;
      const statusIcon = isExpected ? '✅ PASS' : '❌ FAIL';

      let body = '';
      try {
        const text = await res.text();
        body = text.length > 70 ? text.substring(0, 67) + '...' : text;
      } catch (e) {
        body = '[Could not read response body]';
      }

      console.log(`[${statusIcon}] ${route.label}`);
      console.log(`       Method: GET | Path: ${route.path}`);
      console.log(`       Status: ${res.status} (Expected: ${route.expectedStatus})`);
      console.log(`       Payload: ${body}\n`);

      if (!isExpected) allPassed = false;
    } catch (err) {
      console.error(`[❌ FAIL] ${route.label} - Connection Error: ${err.message}`);
      console.error(`       Ensure the server is running on ${BASE_URL} before testing (e.g. npm start)\n`);
      allPassed = false;
    }
  }

  console.log('='.repeat(60));
  if (allPassed) {
    console.log('🎉 All endpoint tests passed successfully!');
  } else {
    console.log('⚠️ Some tests failed or server was not reachable.');
  }
  console.log('='.repeat(60));
}

runTests();

