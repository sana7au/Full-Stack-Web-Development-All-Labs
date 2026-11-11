const express = require('express');
const pool = require('../config/db');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.use(authenticate, authorize('student'));

router.get('/dashboard', async (req, res, next) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, full_name, email, role FROM users WHERE id = ?',
      [req.user.id]
    );
    if (users.length === 0) {
      return res.status(401).json({ message: 'Account no longer exists.' });
    }

    const [courses] = await pool.execute(
      'SELECT id, course_code, title, description, credit_hours FROM courses ORDER BY course_code'
    );

    res.json({
      student: { fullName: users[0].full_name, email: users[0].email },
      courses
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
