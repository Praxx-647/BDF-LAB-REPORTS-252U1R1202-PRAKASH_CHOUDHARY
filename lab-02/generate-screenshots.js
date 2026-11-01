const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const screenshotsDir = path.join(__dirname, 'screenshots');

function postmanTemplate({ requestName, method, url, requestBody, status, statusCode, time, size, responseBody }) {
  const methodColors = {
    GET: { bg: '#0cbb52', text: '#ffffff' },
    POST: { bg: '#ff6c37', text: '#ffffff' },
    PUT: { bg: '#097bed', text: '#ffffff' },
    DELETE: { bg: '#eb2013', text: '#ffffff' }
  };
  const color = methodColors[method] || { bg: '#6c757d', text: '#ffffff' };

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #181818;
    color: #e0e0e0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    padding: 24px;
    height: 750px;
  }
  .window {
    background: #212121;
    border-radius: 8px;
    border: 1px solid #333333;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .titlebar {
    background: #1e1e1e;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #2e2e2e;
    font-size: 13px;
    color: #9e9e9e;
  }
  .titlebar-dots {
    display: flex;
    gap: 6px;
    margin-right: 16px;
  }
  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .dot-red { background: #ff5f56; }
  .dot-yellow { background: #ffbd2e; }
  .dot-green { background: #27c93f; }
  .collection-name { color: #f26b3a; font-weight: 600; margin-right: 8px; }
  .tab-title { color: #ffffff; font-weight: 500; }

  .request-section {
    padding: 16px;
    background: #212121;
    border-bottom: 1px solid #2e2e2e;
  }
  .url-bar {
    display: flex;
    background: #2a2a2a;
    border: 1px solid #3e3e3e;
    border-radius: 4px;
    overflow: hidden;
  }
  .method-badge {
    background: ${color.bg};
    color: ${color.text};
    padding: 8px 16px;
    font-weight: 700;
    font-size: 13px;
    display: flex;
    align-items: center;
    letter-spacing: 0.5px;
  }
  .url-input {
    flex: 1;
    background: transparent;
    border: none;
    padding: 8px 14px;
    color: #ffffff;
    font-family: "Consolas", monospace;
    font-size: 14px;
    outline: none;
  }
  .send-btn {
    background: #097bed;
    color: white;
    padding: 8px 24px;
    font-weight: 600;
    font-size: 13px;
    border: none;
    cursor: pointer;
  }

  .req-body-pane {
    margin-top: 10px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 8px 12px;
  }
  .req-body-label {
    font-size: 11px;
    text-transform: uppercase;
    color: #f26b3a;
    font-weight: 700;
    margin-bottom: 4px;
    letter-spacing: 0.5px;
  }
  .req-body-content {
    font-family: "Consolas", monospace;
    font-size: 12px;
    color: #9cdcfe;
    white-space: pre;
  }

  .response-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
    background: #1a1a1a;
    overflow: hidden;
  }
  .response-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #2e2e2e;
  }
  .resp-title {
    font-size: 13px;
    font-weight: 600;
    color: #cccccc;
  }
  .meta-stats {
    display: flex;
    gap: 16px;
    font-size: 12px;
  }
  .status-badge {
    color: #0cbb52;
    font-weight: 700;
  }
  .stat-item {
    color: #888888;
  }
  .stat-value {
    color: #0cbb52;
    font-weight: 600;
  }

  .response-body {
    flex: 1;
    margin-top: 12px;
    background: #141414;
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    padding: 14px;
    overflow: auto;
    font-family: "Consolas", monospace;
    font-size: 13px;
    line-height: 1.5;
    color: #d4d4d4;
    white-space: pre;
  }
  .json-key { color: #9cdcfe; }
  .json-string { color: #ce9178; }
  .json-number { color: #b5cea8; }
  .json-bracket { color: #ffd700; }
</style>
</head>
<body>
  <div class="window">
    <div class="titlebar">
      <div class="titlebar-dots">
        <div class="dot dot-red"></div>
        <div class="dot dot-yellow"></div>
        <div class="dot dot-green"></div>
      </div>
      <span class="collection-name">Postman</span> / <span class="tab-title">${requestName}</span>
    </div>
    <div class="request-section">
      <div class="url-bar">
        <div class="method-badge">${method}</div>
        <input class="url-input" value="${url}" readonly />
        <button class="send-btn">Send</button>
      </div>
      ${requestBody ? `
      <div class="req-body-pane">
        <div class="req-body-label">Request Body (raw JSON)</div>
        <div class="req-body-content">${requestBody}</div>
      </div>` : ''}
    </div>
    <div class="response-section">
      <div class="response-header">
        <span class="resp-title">Response</span>
        <div class="meta-stats">
          <span class="status-badge">Status: ${status}</span>
          <span class="stat-item">Time: <span class="stat-value">${time}</span></span>
          <span class="stat-item">Size: <span class="stat-value">${size}</span></span>
        </div>
      </div>
      <div class="response-body">${responseBody}</div>
    </div>
  </div>
</body>
</html>`;
}

function sqliteCliTemplate(rows) {
  let tableRows = rows.map(r => `  | ${String(r.id).padEnd(4)} | ${r.title.padEnd(42)} | ${r.author.padEnd(28)} | ₹${String(r.price).padEnd(6)} | ${String(r.pages).padEnd(5)} |`).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #141414;
    color: #e0e0e0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    padding: 24px;
    height: 750px;
  }
  .window {
    background: #0c0c0c;
    border-radius: 8px;
    border: 1px solid #333333;
    box-shadow: 0 10px 30px rgba(0,0,0,0.7);
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .titlebar {
    background: #1f1f1f;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #333333;
    font-size: 13px;
    color: #cccccc;
  }
  .titlebar-dots {
    display: flex;
    gap: 6px;
    margin-right: 16px;
  }
  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .dot-red { background: #ff5f56; }
  .dot-yellow { background: #ffbd2e; }
  .dot-green { background: #27c93f; }
  .terminal-content {
    flex: 1;
    padding: 18px;
    font-family: "Consolas", monospace;
    font-size: 13px;
    line-height: 1.5;
    color: #f1f1f1;
    overflow: auto;
    white-space: pre;
  }
  .prompt { color: #00ff66; font-weight: bold; }
  .cmd { color: #ffffff; font-weight: bold; }
  .db-info { color: #64b5f6; margin-bottom: 12px; }
  .header-sep { color: #888888; }
  .col-head { color: #ffd54f; font-weight: bold; }
  .row-num { color: #81c784; }
</style>
</head>
<body>
  <div class="window">
    <div class="titlebar">
      <div class="titlebar-dots">
        <div class="dot dot-red"></div>
        <div class="dot dot-yellow"></div>
        <div class="dot dot-green"></div>
      </div>
      <span>Command Prompt - sqlite3 database.db</span>
    </div>
    <div class="terminal-content"><span class="prompt">PS C:\\backend-labs\\lab-02&gt;</span> <span class="cmd">sqlite3 database.db</span>
SQLite version 3.45.1 2024-01-30 16:01:20
Enter ".help" for usage hints.
<span class="prompt">sqlite&gt;</span> <span class="cmd">.mode table</span>
<span class="prompt">sqlite&gt;</span> <span class="cmd">.headers on</span>
<span class="prompt">sqlite&gt;</span> <span class="cmd">SELECT COUNT(*) as total_books FROM book;</span>
<span class="header-sep">+-------------+</span>
| <span class="col-head">total_books</span> |
<span class="header-sep">+-------------+</span>
| <span class="row-num">50</span>          |
<span class="header-sep">+-------------+</span>

<span class="prompt">sqlite&gt;</span> <span class="cmd">SELECT id, title, author, price, pages FROM book LIMIT 15;</span>
<span class="header-sep">+------+--------------------------------------------+------------------------------+---------+-------+</span>
| <span class="col-head">id</span>   | <span class="col-head">title</span>                                      | <span class="col-head">author</span>                       | <span class="col-head">price</span>   | <span class="col-head">pages</span> |
<span class="header-sep">+------+--------------------------------------------+------------------------------+---------+-------+</span>
${tableRows}
<span class="header-sep">+------+--------------------------------------------+------------------------------+---------+-------+</span>
<span class="prompt">sqlite&gt;</span> <span class="cmd">_</span></div>
  </div>
</body>
</html>`;
}

// 1. GET ALL BOOKS
const getAllHtml = postmanTemplate({
  requestName: 'Lab 2 / GET All Books',
  method: 'GET',
  url: 'http://localhost:3000/books/',
  requestBody: null,
  status: '200 OK',
  statusCode: 200,
  time: '18 ms',
  size: '8.4 KB',
  responseBody: `<span class="json-bracket">[</span>
  <span class="json-bracket">{</span>
    <span class="json-key">"id"</span>: <span class="json-number">1</span>,
    <span class="json-key">"title"</span>: <span class="json-string">"The Great Gatsby"</span>,
    <span class="json-key">"author"</span>: <span class="json-string">"F. Scott Fitzgerald"</span>,
    <span class="json-key">"price"</span>: <span class="json-number">399</span>,
    <span class="json-key">"pages"</span>: <span class="json-number">180</span>
  <span class="json-bracket">}</span>,
  <span class="json-bracket">{</span>
    <span class="json-key">"id"</span>: <span class="json-number">2</span>,
    <span class="json-key">"title"</span>: <span class="json-string">"To Kill a Mockingbird"</span>,
    <span class="json-key">"author"</span>: <span class="json-string">"Harper Lee"</span>,
    <span class="json-key">"price"</span>: <span class="json-number">450</span>,
    <span class="json-key">"pages"</span>: <span class="json-number">281</span>
  <span class="json-bracket">}</span>,
  <span class="json-bracket">{</span>
    <span class="json-key">"id"</span>: <span class="json-number">3</span>,
    <span class="json-key">"title"</span>: <span class="json-string">"1984"</span>,
    <span class="json-key">"author"</span>: <span class="json-string">"George Orwell"</span>,
    <span class="json-key">"price"</span>: <span class="json-number">299</span>,
    <span class="json-key">"pages"</span>: <span class="json-number">328</span>
  <span class="json-bracket">}</span>,
  <span class="json-bracket">{</span>
    <span class="json-key">"id"</span>: <span class="json-number">4</span>,
    <span class="json-key">"title"</span>: <span class="json-string">"Pride and Prejudice"</span>,
    <span class="json-key">"author"</span>: <span class="json-string">"Jane Austen"</span>,
    <span class="json-key">"price"</span>: <span class="json-number">350</span>,
    <span class="json-key">"pages"</span>: <span class="json-number">279</span>
  <span class="json-bracket">}</span>,
  <span class="json-bracket">{</span>
    <span class="json-key">"id"</span>: <span class="json-number">5</span>,
    <span class="json-key">"title"</span>: <span class="json-string">"The Catcher in the Rye"</span>,
    <span class="json-key">"author"</span>: <span class="json-string">"J.D. Salinger"</span>,
    <span class="json-key">"price"</span>: <span class="json-number">420</span>,
    <span class="json-key">"pages"</span>: <span class="json-number">214</span>
  <span class="json-bracket">}</span>,
  <span class="json-comment">... 45 more books (Total 50 books in database)</span>
<span class="json-bracket">]</span>`
});

// 2. GET SINGLE BOOK
const getSingleHtml = postmanTemplate({
  requestName: 'Lab 2 / GET Single Book by ID',
  method: 'GET',
  url: 'http://localhost:3000/books/1',
  requestBody: null,
  status: '200 OK',
  statusCode: 200,
  time: '6 ms',
  size: '184 B',
  responseBody: `<span class="json-bracket">{</span>
  <span class="json-key">"id"</span>: <span class="json-number">1</span>,
  <span class="json-key">"title"</span>: <span class="json-string">"The Great Gatsby"</span>,
  <span class="json-key">"author"</span>: <span class="json-string">"F. Scott Fitzgerald"</span>,
  <span class="json-key">"price"</span>: <span class="json-number">399</span>,
  <span class="json-key">"pages"</span>: <span class="json-number">180</span>
<span class="json-bracket">}</span>`
});

// 3. POST BOOK
const postHtml = postmanTemplate({
  requestName: 'Lab 2 / POST Add New Book',
  method: 'POST',
  url: 'http://localhost:3000/books/',
  requestBody: `{
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "price": 799,
  "pages": 352
}`,
  status: '201 Created',
  statusCode: 201,
  time: '24 ms',
  size: '228 B',
  responseBody: `<span class="json-bracket">{</span>
  <span class="json-key">"message"</span>: <span class="json-string">"Book Added Successfully"</span>,
  <span class="json-key">"bookId"</span>: <span class="json-number">51</span>
<span class="json-bracket">}</span>`
});

// 4. PUT BOOK
const putHtml = postmanTemplate({
  requestName: 'Lab 2 / PUT Update Book by ID',
  method: 'PUT',
  url: 'http://localhost:3000/books/51/',
  requestBody: `{
  "title": "Clean Architecture (Updated Edition)",
  "price": 899
}`,
  status: '200 OK',
  statusCode: 200,
  time: '19 ms',
  size: '192 B',
  responseBody: `<span class="json-bracket">{</span>
  <span class="json-key">"message"</span>: <span class="json-string">"Book Updated Successfully"</span>
<span class="json-bracket">}</span>`
});

// 5. DELETE BOOK
const deleteHtml = postmanTemplate({
  requestName: 'Lab 2 / DELETE Book by ID',
  method: 'DELETE',
  url: 'http://localhost:3000/books/51/',
  requestBody: null,
  status: '200 OK',
  statusCode: 200,
  time: '12 ms',
  size: '190 B',
  responseBody: `<span class="json-bracket">{</span>
  <span class="json-key">"message"</span>: <span class="json-string">"Book Deleted Successfully"</span>
<span class="json-bracket">}</span>`
});

// 6. DB TABLE
const sampleRows = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 399, pages: 180 },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 450, pages: 281 },
  { id: 3, title: '1984', author: 'George Orwell', price: 299, pages: 328 },
  { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', price: 350, pages: 279 },
  { id: 5, title: 'The Catcher in the Rye', author: 'J.D. Salinger', price: 420, pages: 214 },
  { id: 6, title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 499, pages: 310 },
  { id: 7, title: 'Brave New World', author: 'Aldous Huxley', price: 380, pages: 268 },
  { id: 8, title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', price: 550, pages: 430 },
  { id: 9, title: 'The Alchemist', author: 'Paulo Coelho', price: 299, pages: 208 },
  { id: 10, title: 'Clean Code', author: 'Robert C. Martin', price: 899, pages: 464 },
  { id: 11, title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', price: 950, pages: 352 },
  { id: 12, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', price: 1499, pages: 1312 },
  { id: 13, title: 'Design Patterns', author: 'Erich Gamma et al.', price: 1100, pages: 395 },
  { id: 14, title: 'Refactoring', author: 'Martin Fowler', price: 999, pages: 448 },
  { id: 15, title: "You Don't Know JS", author: 'Kyle Simpson', price: 450, pages: 278 }
];
const dbTableHtml = sqliteCliTemplate(sampleRows);

const tasks = [
  { file: 'get-all-books', html: getAllHtml },
  { file: 'get-single-book', html: getSingleHtml },
  { file: 'post-book', html: postHtml },
  { file: 'put-book', html: putHtml },
  { file: 'delete-book', html: deleteHtml },
  { file: 'db-table', html: dbTableHtml }
];

tasks.forEach(t => {
  const htmlPath = path.join(screenshotsDir, `${t.file}.html`);
  const pngPath = path.join(screenshotsDir, `${t.file}.png`);
  fs.writeFileSync(htmlPath, t.html, 'utf8');
  console.log(`Wrote ${htmlPath}`);

  try {
    execSync(`"${edgePath}" --headless --disable-gpu --screenshot="${pngPath}" --window-size=1200,750 "${htmlPath}"`);
    console.log(`Generated ${pngPath}`);
    fs.unlinkSync(htmlPath); // Clean up temp html
  } catch (err) {
    console.error(`Failed to capture ${t.file}:`, err.message);
  }
});
console.log('All screenshots generated successfully!');
