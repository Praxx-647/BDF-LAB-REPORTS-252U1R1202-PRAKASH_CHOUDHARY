const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function runTests() {
  console.log('='.repeat(65));
  console.log(`🧪 Lab 2 CRUD Route Tester - Target: ${BASE_URL}`);
  console.log('='.repeat(65));

  let passed = 0;
  let total = 0;

  async function test(label, fn) {
    total++;
    try {
      await fn();
      console.log(`[✅ PASS] ${label}`);
      passed++;
    } catch (err) {
      console.error(`[❌ FAIL] ${label}: ${err.message}`);
    }
  }

  // 1. GET /books/
  let initialCount = 0;
  await test('GET /books/ -> Returns all books', async () => {
    const res = await fetch(`${BASE_URL}/books/`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Response is not an array');
    if (data.length < 10) throw new Error(`Expected at least 10 books, found ${data.length}`);
    initialCount = data.length;
    console.log(`       Found ${initialCount} books in database.`);
  });

  // 2. GET /books/1
  await test('GET /books/1 -> Returns single book by ID', async () => {
    const res = await fetch(`${BASE_URL}/books/1`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const book = await res.json();
    if (book.id !== 1) throw new Error(`Expected ID 1, got ${book.id}`);
    console.log(`       Fetched book: "${book.title}" by ${book.author}`);
  });

  // 3. POST /books/
  let createdBookId = null;
  await test('POST /books/ -> Adds a new book', async () => {
    const payload = {
      title: 'Automated Test Book',
      author: 'QA Engineer',
      price: 250,
      pages: 150
    };
    const res = await fetch(`${BASE_URL}/books/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    const result = await res.json();
    if (!result.bookId) throw new Error('No bookId in response');
    createdBookId = result.bookId;
    console.log(`       Created new book with ID: ${createdBookId}`);
  });

  // 4. PUT /books/:bookId/
  await test(`PUT /books/${createdBookId}/ -> Updates the newly added book`, async () => {
    if (!createdBookId) throw new Error('Skipping: bookId was not captured');
    const updatePayload = {
      title: 'Automated Test Book (Updated)',
      price: 399
    };
    const res = await fetch(`${BASE_URL}/books/${createdBookId}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const result = await res.json();
    console.log(`       Update response: "${result.message}"`);
  });

  // 5. Verify update with GET /books/:bookId
  await test(`GET /books/${createdBookId}/ -> Verifies updated values in DB`, async () => {
    if (!createdBookId) throw new Error('Skipping');
    const res = await fetch(`${BASE_URL}/books/${createdBookId}/`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const book = await res.json();
    if (book.title !== 'Automated Test Book (Updated)' || book.price !== 399) {
      throw new Error(`Book was not updated correctly: ${JSON.stringify(book)}`);
    }
    console.log(`       Verified updated book title: "${book.title}", price: ${book.price}`);
  });

  // 6. DELETE /books/:bookId/
  await test(`DELETE /books/${createdBookId}/ -> Deletes the book from DB`, async () => {
    if (!createdBookId) throw new Error('Skipping');
    const res = await fetch(`${BASE_URL}/books/${createdBookId}/`, {
      method: 'DELETE'
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const result = await res.json();
    console.log(`       Delete response: "${result.message}"`);
  });

  // 7. Verify deletion with GET -> 404
  await test(`GET /books/${createdBookId}/ -> Expects 404 Not Found after deletion`, async () => {
    if (!createdBookId) throw new Error('Skipping');
    const res = await fetch(`${BASE_URL}/books/${createdBookId}/`);
    if (res.status !== 404) throw new Error(`Expected status 404, got ${res.status}`);
    console.log(`       Successfully confirmed book ${createdBookId} is deleted.`);
  });

  // 8. 404 Fallback
  await test('GET /unknown-route -> Returns 404 for undefined routes', async () => {
    const res = await fetch(`${BASE_URL}/unknown-route`);
    if (res.status !== 404) throw new Error(`Expected status 404, got ${res.status}`);
  });

  console.log('='.repeat(65));
  console.log(`Summary: ${passed}/${total} tests passed!`);
  console.log('='.repeat(65));
}

runTests();
