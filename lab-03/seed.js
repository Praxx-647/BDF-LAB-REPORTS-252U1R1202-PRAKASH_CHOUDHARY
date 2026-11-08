const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const books50 = [
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

async function seedDatabase() {
  const dbPath = path.join(__dirname, 'database.db');
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.run(`DROP TABLE IF EXISTS book;`);
  await db.run(`
    CREATE TABLE book (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      price INTEGER NOT NULL,
      pages INTEGER NOT NULL
    );
  `);

  console.log('Seeding 50 books into Lab 3 database...');
  for (const [title, author, price, pages] of books50) {
    await db.run(
      `INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?);`,
      [title, author, price, pages]
    );
  }

  const rows = await db.all(`SELECT * FROM book;`);
  console.log(`Successfully seeded ${rows.length} books into ${dbPath}`);
  await db.close();
}

seedDatabase().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});

