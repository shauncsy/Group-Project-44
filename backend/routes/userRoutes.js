const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db'); // Database connection module

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user with hashed password
 */
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user into SQLite database
  const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  stmt.run(username, hashedPassword, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Username already exists or database error.' });
    }
    res.json({ message: `✅ User "${username}" registered successfully.` });
  });
});

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user and start session
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid username.' });
    }

    // Compare submitted password with hashed one
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    // Store user session
    req.session.user = user.username;
    res.json({ message: `✅ Welcome back, ${user.username}` });
  });
});

module.exports = router;

