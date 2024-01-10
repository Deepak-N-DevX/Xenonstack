const express = require('express');
const path = require('path');
const app = express();
const db = require('./database');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Root endpoint to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Here you would normally check the credentials against the database
  // For demonstration purposes, we'll just send a success response
  res.json({ message: 'Login successful' });
});

// Contact endpoint
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const stmt = db.prepare('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)');
  stmt.run(name, email, message, function(err) {
    if (err) {
      res.status(500).json({ message: 'Failed to save contact information', error: err.message });
    } else {
      res.json({ message: 'Contact information saved', id: this.lastID });
    }
  });
  stmt.finalize();
});

// Server listening on port 5500
const port = 5500;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});