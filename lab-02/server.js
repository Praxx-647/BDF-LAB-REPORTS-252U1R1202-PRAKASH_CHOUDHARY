const express = require('express');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'database.db');

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Create table if it doesn't exist
    await db.run(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER NOT NULL
      );
    `);

    // Seed 50 initial rows if table is empty
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
        ['Clean Code', 'Robert C. Martin', 899, 464],
        ['The Pragmatic Programmer', 'Andrew Hunt & David Thomas', 950, 352],
        ['Introduction to Algorithms', 'Thomas H. Cormen', 1499, 1312],
        ['Design Patterns', 'Erich Gamma et al.', 1100, 395],
        ['Refactoring', 'Martin Fowler', 999, 448],
        ['You Don\'t Know JS', 'Kyle Simpson', 450, 278],
        ['Eloquent JavaScript', 'Marijn Haverbeke', 550, 472],
        ['JavaScript: The Good Parts', 'Douglas Crockford', 399, 172],
        ['Node.js Design Patterns', 'Mario Casciaro', 850, 520],
        ['Database System Concepts', 'Abraham Silberschatz', 1250, 1376],
        ['Designing Data-Intensive Applications', 'Martin Kleppmann', 1150, 616],
        ['Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 499, 443],
        ['Atomic Habits', 'James Clear', 450, 320],
        ['Thinking, Fast and Slow', 'Daniel Kahneman', 520, 499],
        ['Deep Work', 'Cal Newport', 399, 304],
        ['Zero to One', 'Peter Thiel', 350, 224],
        ['The Lean Startup', 'Eric Ries', 420, 336],
        ['Good to Great', 'Jim Collins', 499, 320],
        ['Start with Why', 'Simon Sinek', 380, 256],
        ['Dune', 'Frank Herbert', 599, 412],
        ['Neuromancer', 'William Gibson', 399, 271],
        ['Foundation', 'Isaac Asimov', 450, 255],
        ['Fahrenheit 451', 'Ray Bradbury', 320, 249],
        ['Animal Farm', 'George Orwell', 199, 112],
        ['The Lord of the Rings', 'J.R.R. Tolkien', 1299, 1178],
        ['Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', 499, 309],
        ['The Da Vinci Code', 'Dan Brown', 399, 454],
        ['The Shining', 'Stephen King', 450, 447],
        ['A Game of Thrones', 'George R.R. Martin', 699, 694],
        ['Cosmos', 'Carl Sagan', 599, 365],
        ['A Brief History of Time', 'Stephen Hawking', 420, 256],
        ['The Selfish Gene', 'Richard Dawkins', 480, 360],
        ['Guns, Germs, and Steel', 'Jared Diamond', 550, 480],
        ['Man\'s Search for Meaning', 'Viktor E. Frankl', 299, 165],
        ['Meditations', 'Marcus Aurelius', 250, 256],
        ['The Republic', 'Plato', 299, 416],
        ['Beyond Good and Evil', 'Friedrich Nietzsche', 320, 240],
        ['The Art of War', 'Sun Tzu', 199, 96],
        ['Structure and Interpretation of Computer Programs', 'Harold Abelson', 1350, 657],
        ['Computer Systems: A Programmer\'s Perspective', 'Randal E. Bryant', 1400, 1072],
        ['Operating System Concepts', 'Abraham Silberschatz', 1199, 976]
      ];

      for (const [title, author, price, pages] of initialBooks) {
        await db.run(
          `INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?);`,
          [title, author, price, pages]
        );
      }
      console.log('Database seeded with 50 initial books.');
    }

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// 1. GET / -> Welcome info
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Lab 2: SQLite database and CRUD routes API',
    endpoints: {
      getAllBooks: 'GET /books/',
      getSingleBook: 'GET /books/:bookId/',
      addBook: 'POST /books/',
      updateBook: 'PUT /books/:bookId/',
      deleteBook: 'DELETE /books/:bookId/'
    }
  });
});

// 2. GET /books/ -> Get all books
app.get('/books/', async (req, res) => {
  try {
    const getBooksQuery = `SELECT * FROM book ORDER BY id;`;
    const booksArray = await db.all(getBooksQuery);
    res.status(200).json(booksArray);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// 3. GET /books/:bookId/ -> Get single book by ID
app.get('/books/:bookId/', async (req, res) => {
  try {
    const { bookId } = req.params;
    const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const book = await db.get(getBookQuery, [bookId]);

    if (!book) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Book with id ${bookId} not found`
      });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// 4. POST /books/ -> Add a new book
app.post('/books/', async (req, res) => {
  try {
    const { title, author, price, pages } = req.body;

    if (!title || !author || price === undefined || pages === undefined) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'All fields (title, author, price, pages) are required'
      });
    }

    const addBookQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;
    const result = await db.run(addBookQuery, [title, author, price, pages]);

    res.status(201).json({
      message: 'Book Added Successfully',
      bookId: result.lastID
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// 5. PUT /books/:bookId/ -> Update a book by ID
app.put('/books/:bookId/', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, price, pages } = req.body;

    const checkBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Book with id ${bookId} not found`
      });
    }

    const updateBookQuery = `
      UPDATE book
      SET
        title = COALESCE(?, title),
        author = COALESCE(?, author),
        price = COALESCE(?, price),
        pages = COALESCE(?, pages)
      WHERE id = ?;
    `;
    await db.run(updateBookQuery, [
      title !== undefined ? title : null,
      author !== undefined ? author : null,
      price !== undefined ? price : null,
      pages !== undefined ? pages : null,
      bookId
    ]);

    res.status(200).json({
      message: 'Book Updated Successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// 6. DELETE /books/:bookId/ -> Delete a book by ID
app.delete('/books/:bookId/', async (req, res) => {
  try {
    const { bookId } = req.params;

    const checkBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Book with id ${bookId} not found`
      });
    }

    const deleteBookQuery = `DELETE FROM book WHERE id = ?;`;
    await db.run(deleteBookQuery, [bookId]);

    res.status(200).json({
      message: 'Book Deleted Successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// 7. Catch-all route -> 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    statusCode: 404
  });
});

module.exports = app;

