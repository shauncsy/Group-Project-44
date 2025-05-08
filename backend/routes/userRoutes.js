const express = require('express');
const router = express.Router();


router.post('/register', (req, res) => {
  const { username, password } = req.body;
 
  res.json({ message: `Registration successful: ${username}` });
});


router.post('/login', (req, res) => {
  const { username } = req.body;
  
  req.session.user = username;
  res.json({ message: `Welcome back, ${username}` });
});

module.exports = router;
