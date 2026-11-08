const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function runTests() {
  console.log('='.repeat(70));
  console.log(`🧪 Lab 3 REST API & Validation Tester - Target: ${BASE_URL}`);
  console.log('='.repeat(70));

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

  // 1. Default GET /books (10 items)
  await test('GET /books -> Default pagination (10 books)', async () => {
    const res = await fetch(`${BASE_URL}/books`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length !== 10) {
      throw new Error(`Expected array of 10 books, received ${Array.isArray(data) ? data.length : typeof data}`);
    }
    console.log(`       Received ${data.length} books (default limit=10).`);
  });

  // 2. Search query parameter
  await test('GET /books?search_q=Clean -> Search filter (partial match)', async () => {
    const res = await fetch(`${BASE_URL}/books?search_q=Clean`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.some(b => b.title.includes('Clean'))) {
      throw new Error('Search did not return books matching "Clean"');
    }
    console.log(`       Matched ${data.length} book(s): "${data[0].title}"`);
  });

  // 3. Price range filter (min_price & max_price)
  await test('GET /books?min_price=300&max_price=400 -> Price range filter', async () => {
    const res = await fetch(`${BASE_URL}/books?min_price=300&max_price=400`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.length === 0) throw new Error('Expected books in price range 300-400');
    const allInRange = data.every(b => b.price >= 300 && b.price <= 400);
    if (!allInRange) throw new Error('Returned books outside price range 300-400');
    console.log(`       Found ${data.length} books with price between ₹300 and ₹400.`);
  });

  // 4. Sorting & Pagination (order_by=price, order=DESC, limit=5, offset=0)
  await test('GET /books?order_by=price&order=DESC&limit=5 -> Sort & Pagination', async () => {
    const res = await fetch(`${BASE_URL}/books?order_by=price&order=DESC&limit=5`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.length !== 5) throw new Error(`Expected limit=5, got ${data.length}`);
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i].price < data[i + 1].price) {
        throw new Error('Books are not sorted by price descending');
      }
    }
    console.log(`       Top price: ₹${data[0].price} ("${data[0].title}")`);
  });

  // 5. Validation Error: Missing required title
  await test('POST /books (missing title) -> Rejects with 400 Bad Request', async () => {
    const res = await fetch(`${BASE_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: 'Author Only', price: 299, pages: 150 })
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    if (!data.message || !data.message.includes('Validation Error')) {
      throw new Error(`Unexpected message: ${JSON.stringify(data)}`);
    }
    console.log(`       Correctly rejected with: "${data.message}"`);
  });

  // 6. Validation Error: Non-numeric price
  await test('POST /books (string price) -> Rejects with 400 Bad Request', async () => {
    const res = await fetch(`${BASE_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Book', author: 'Author', price: 'free', pages: 100 })
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
    const data = await res.json();
    console.log(`       Correctly rejected with: "${data.message}"`);
  });

  // 7. Successful POST /books -> 201 Created
  let newBookId = null;
  await test('POST /books (valid body) -> Returns 201 Created & bookId', async () => {
    const res = await fetch(`${BASE_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'REST API Design Handbook',
        author: 'Backend Pro',
        price: 499,
        pages: 280
      })
    });
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    const data = await res.json();
    if (!data.bookId) throw new Error('No bookId in response');
    newBookId = data.bookId;
    console.log(`       Created book with ID: ${newBookId}`);
  });

  // 8. PUT /books/:id -> 200 OK
  await test(`PUT /books/${newBookId} -> Updates book successfully`, async () => {
    if (!newBookId) throw new Error('No bookId');
    const res = await fetch(`${BASE_URL}/books/${newBookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 549 })
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    console.log(`       Response: "${data.message}"`);
  });

  // 9. GET /books/999 -> 404 Not Found
  await test('GET /books/9999 -> Returns 404 for non-existent ID', async () => {
    const res = await fetch(`${BASE_URL}/books/9999`);
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    const data = await res.json();
    console.log(`       Response: "${data.message}"`);
  });

  // 10. DELETE /books/:id -> 200 OK & 404 confirmation
  await test(`DELETE /books/${newBookId} -> Deletes book & verifies 404`, async () => {
    if (!newBookId) throw new Error('No bookId');
    const delRes = await fetch(`${BASE_URL}/books/${newBookId}`, { method: 'DELETE' });
    if (delRes.status !== 200) throw new Error(`Expected 200, got ${delRes.status}`);

    const verifyRes = await fetch(`${BASE_URL}/books/${newBookId}`);
    if (verifyRes.status !== 404) throw new Error(`Expected 404 after delete, got ${verifyRes.status}`);
    console.log(`       Book ${newBookId} successfully deleted.`);
  });

  console.log('='.repeat(70));
  console.log(`Summary: ${passed}/${total} tests passed!`);
  console.log('='.repeat(70));
}

runTests();
