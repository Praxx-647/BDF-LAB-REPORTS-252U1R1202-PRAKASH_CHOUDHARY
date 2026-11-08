const express = require('express');
const path = require('path');
const fs = require('fs');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
let dbPath = path.join(__dirname, 'database.db');

// In serverless environments (Vercel / Lambda), copy database to writable /tmp
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  const tmpDbPath = path.join('/tmp', 'database.db');
  try {
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, tmpDbPath);
    }
    dbPath = tmpDbPath;
  } catch (err) {
    console.error('Error copying SQLite database to /tmp:', err.message);
  }
}

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    await db.run(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER NOT NULL
      );
    `);

    // Fallback seed if table is empty
    const countResult = await db.get(`SELECT COUNT(*) as count FROM book;`);
    if (countResult.count === 0) {
      const initialBooks = [
        ['The Great Gatsby', 'F. Scott Fitzgerald', 399, 180],
        ['To Kill a Mockingbird', 'Harper Lee', 450, 281],
        ['1984', 'George Orwell', 299, 328],
        ['Pride and Prejudice', 'Jane Austen', 350, 279],
        ['The Catcher in the Rye', 'J.D. Salinger', 420, 214],
        ['The Hobbit', 'J.R.R. Tolkien', 499, 310],
        ['Brave New World', 'Aldous Huxley', 380, 268],
        ['Crime and Punishment', 'Fyodor Dostoevsky', 550, 430],
        ['The Alchemist', 'Paulo Coelho', 299, 208],
        ['Clean Code', 'Robert C. Martin', 899, 464]
      ];
      for (const [title, author, price, pages] of initialBooks) {
        await db.run(
          `INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?);`,
          [title, author, price, pages]
        );
      }
    }

    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/`);
      });
    }
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// 1. GET / -> Root documentation endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Lab 3: RESTful API, Query Parameters, Validation & Debugging',
    endpoints: {
      getAllBooks: 'GET /books (supports ?search_q, ?min_price, ?max_price, ?order_by, ?order, ?limit, ?offset)',
      getSingleBook: 'GET /books/:bookId',
      createBook: 'POST /books',
      updateBook: 'PUT /books/:bookId',
      deleteBook: 'DELETE /books/:bookId'
    }
  });
});

// 2. GET /books -> Query parameters (search_q, min_price, max_price, order_by, order, limit, offset)
app.get('/books', async (req, res) => {
  try {
    const {
      search_q = '',
      min_price,
      max_price,
      order_by = 'id',
      order = 'ASC',
      limit = 10,
      offset = 0
    } = req.query;

    const conditions = [];
    const params = [];

    // Filter 1: Partial title search
    if (search_q.trim() !== '') {
      conditions.push('title LIKE ?');
      params.push(`%${search_q.trim()}%`);
    }

    // Filter 2: Price range filter (BETWEEN or min/max)
    if (min_price !== undefined && max_price !== undefined) {
      const minP = Number(min_price);
      const maxP = Number(max_price);
      if (isNaN(minP) || isNaN(maxP)) {
        return res.status(400).json({ message: 'Validation Error: min_price and max_price must be numeric' });
      }
      conditions.push('price BETWEEN ? AND ?');
      params.push(minP, maxP);
    } else if (min_price !== undefined) {
      const minP = Number(min_price);
      if (isNaN(minP)) {
        return res.status(400).json({ message: 'Validation Error: min_price must be numeric' });
      }
      conditions.push('price >= ?');
      params.push(minP);
    } else if (max_price !== undefined) {
      const maxP = Number(max_price);
      if (isNaN(maxP)) {
        return res.status(400).json({ message: 'Validation Error: max_price must be numeric' });
      }
      conditions.push('price <= ?');
      params.push(maxP);
    }

    // Whitelist order_by column to prevent SQL Injection
    const allowedColumns = ['id', 'title', 'author', 'price', 'pages'];
    const safeOrderBy = allowedColumns.includes(order_by.toLowerCase())
      ? order_by.toLowerCase()
      : 'id';

    // Whitelist order direction
    const safeOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // Parse limit and offset safely
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
    const parsedOffset = Math.max(0, parseInt(offset, 10) || 0);

    let query = 'SELECT * FROM book';
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    query += ` ORDER BY ${safeOrderBy} ${safeOrder} LIMIT ? OFFSET ?;`;
    params.push(parsedLimit, parsedOffset);

    const books = await db.all(query, params);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});

// 3. GET /books/:bookId -> Single book by ID
app.get('/books/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const query = `SELECT * FROM book WHERE id = ?;`;
    const book = await db.get(query, [bookId]);

    if (!book) {
      return res.status(404).json({ message: `Book with ID ${bookId} not found` });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});

// 4. POST /books -> Add new book with strict payload validation
app.post('/books', async (req, res) => {
  try {
    const { title, author, price, pages } = req.body;

    // Validation rules
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Validation Error: Title is required and must be a non-empty string' });
    }
    if (!author || typeof author !== 'string' || author.trim() === '') {
      return res.status(400).json({ message: 'Validation Error: Author is required and must be a non-empty string' });
    }
    if (price === undefined || typeof price !== 'number' || isNaN(price) || price < 0) {
      return res.status(400).json({ message: 'Validation Error: Price is required and must be a non-negative number' });
    }
    if (pages === undefined || typeof pages !== 'number' || !Number.isInteger(pages) || pages <= 0) {
      return res.status(400).json({ message: 'Validation Error: Pages is required and must be a positive integer' });
    }

    const insertQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;
    const result = await db.run(insertQuery, [title.trim(), author.trim(), price, pages]);

    res.status(201).json({
      message: 'Book Added Successfully',
      bookId: result.lastID
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});

// 5. PUT /books/:bookId -> Update book with validation & existence check
app.put('/books/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, price, pages } = req.body;

    const checkQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkQuery, [bookId]);

    if (!existingBook) {
      return res.status(404).json({ message: `Book with ID ${bookId} not found` });
    }

    // Validate optional updates
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({ message: 'Validation Error: Title must be a non-empty string' });
    }
    if (author !== undefined && (typeof author !== 'string' || author.trim() === '')) {
      return res.status(400).json({ message: 'Validation Error: Author must be a non-empty string' });
    }
    if (price !== undefined && (typeof price !== 'number' || isNaN(price) || price < 0)) {
      return res.status(400).json({ message: 'Validation Error: Price must be a non-negative number' });
    }
    if (pages !== undefined && (typeof pages !== 'number' || !Number.isInteger(pages) || pages <= 0)) {
      return res.status(400).json({ message: 'Validation Error: Pages must be a positive integer' });
    }

    const updateQuery = `
      UPDATE book
      SET
        title = COALESCE(?, title),
        author = COALESCE(?, author),
        price = COALESCE(?, price),
        pages = COALESCE(?, pages)
      WHERE id = ?;
    `;
    await db.run(updateQuery, [
      title !== undefined ? title.trim() : null,
      author !== undefined ? author.trim() : null,
      price !== undefined ? price : null,
      pages !== undefined ? pages : null,
      bookId
    ]);

    res.status(200).json({ message: 'Book Updated Successfully' });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});

// 6. DELETE /books/:bookId -> Delete book with existence check
app.delete('/books/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;

    const checkQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkQuery, [bookId]);

    if (!existingBook) {
      return res.status(404).json({ message: `Book with ID ${bookId} not found` });
    }

    const deleteQuery = `DELETE FROM book WHERE id = ?;`;
    await db.run(deleteQuery, [bookId]);

    res.status(200).json({ message: 'Book Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
});

// 7. Catch-all 404 route
app.use((req, res) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

module.exports = app;
