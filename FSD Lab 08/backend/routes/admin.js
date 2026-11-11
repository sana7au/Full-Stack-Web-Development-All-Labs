const express = require('express');
const pool = require('../config/db');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { validateCourse } = require('../utils/validators');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard', async (req, res, next) => {
  try {
    const [[{ students }]] = await pool.execute("SELECT COUNT(*) AS students FROM users WHERE role = 'student'");
    const [[{ courses }]] = await pool.execute('SELECT COUNT(*) AS courses FROM courses');
    const [[admin]] = await pool.execute('SELECT full_name, email FROM users WHERE id = ?', [req.user.id]);

    res.json({
      admin: { fullName: admin.full_name, email: admin.email },
      totals: { students, courses }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/courses', async (req, res, next) => {
  try {
    const [courses] = await pool.execute(
      'SELECT id, course_code, title, description, credit_hours FROM courses ORDER BY course_code'
    );
    res.json({ courses });
  } catch (err) {
    next(err);
  }
});

router.post('/courses', async (req, res, next) => {
  try {
    const error = validateCourse(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const { courseCode, title, description, creditHours } = req.body;
    const code = courseCode.trim().toUpperCase();

    const [existing] = await pool.execute('SELECT id FROM courses WHERE course_code = ?', [code]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'A course with this code already exists.' });
    }

    await pool.execute(
      'INSERT INTO courses (course_code, title, description, credit_hours) VALUES (?, ?, ?, ?)',
      [code, title.trim(), (description || '').trim(), Number(creditHours)]
    );

    res.status(201).json({ message: 'Course added successfully.' });
  } catch (err) {
    next(err);
  }
});

router.put('/courses/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: 'Invalid course id.' });
    }

    const error = validateCourse(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const { courseCode, title, description, creditHours } = req.body;
    const code = courseCode.trim().toUpperCase();

    const [duplicate] = await pool.execute(
      'SELECT id FROM courses WHERE course_code = ? AND id <> ?',
      [code, id]
    );
    if (duplicate.length > 0) {
      return res.status(409).json({ message: 'Another course already uses this code.' });
    }

    const [result] = await pool.execute(
      'UPDATE courses SET course_code = ?, title = ?, description = ?, credit_hours = ? WHERE id = ?',
      [code, title.trim(), (description || '').trim(), Number(creditHours), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    res.json({ message: 'Course updated successfully.' });
  } catch (err) {
    next(err);
  }
});

router.delete('/courses/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: 'Invalid course id.' });
    }

    const [result] = await pool.execute('DELETE FROM courses WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    res.json({ message: 'Course deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
