const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON payloads if needed
app.use(express.json());

// 1. GET / -> Welcome text with status 200
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Node.js & Express Server');
});

// 2. GET /about -> JSON object with name and section with status 200
app.get('/about', (req, res) => {
  res.status(200).json({
    name: 'Prakash Choudhary',
    section: 'CSE-2D / 214'
  });
});

// 3. GET /time -> Current date and time using new Date() with status 200
app.get('/time', (req, res) => {
  res.status(200).json({
    currentTime: new Date().toISOString()
  });
});

// 4. Catch-all route -> 404 handler for unknown paths
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    statusCode: 404
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});

