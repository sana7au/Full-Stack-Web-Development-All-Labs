const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { validateRegistration, EMAIL_REGEX } = require('../utils/validators');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const error = validateRegistration({ fullName, email, password });
    if (error) {
      return res.status(400).json({ message: error });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Role is always 'student'; any role sent by the client is ignored.
    await pool.execute(
      'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
      [fullName.trim(), cleanEmail, hashedPassword, 'student']
    );

    res.status(201).json({ message: 'Registration successful. You can now log in.' });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim()) || typeof password !== 'string' || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const [rows] = await pool.execute(
      'SELECT id, full_name, email, password, role FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    const user = rows[0];
    const passwordMatches = user && (await bcrypt.compare(password, user.password));

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
