const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const storedHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !storedHash) {
      return res.status(500).json({ message: 'Admin credentials not configured' });
    }

    if (email !== adminEmail) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, storedHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
    );

    return res.json({ token });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
