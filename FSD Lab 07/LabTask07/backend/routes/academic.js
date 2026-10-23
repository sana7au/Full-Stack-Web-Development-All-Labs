const express = require('express');
const db = require('../db');
const { userOnly } = require('../middleware');
const router = express.Router();

router.use(userOnly);

router.get('/me', async (req, res) => {
  const user = req.apiUser;
  try {
    let person;
    if (user.owner_type === 'student') {
      const [rows] = await db.execute(
        'SELECT id, student_code AS code, full_name, email, department, semester FROM students WHERE id = ?',
        [user.student_id]);
      person = rows[0];
    } else {
      const [rows] = await db.execute(
        'SELECT id, teacher_code AS code, full_name, email, department FROM teachers WHERE id = ?',
        [user.teacher_id]);
      person = rows[0];
    }
    await req.saveUsage(200, 'Identity loaded');
    res.json({
      role: user.owner_type,
      person,
      limits: {
        maxRows: user.max_rows,
        maxRequests: user.max_requests,
        requestsUsed: user.request_count,
        requestsRemaining: Math.max(0, user.max_requests - user.request_count)
      }
    });
  } catch (error) {
    await req.saveUsage(500, 'Identity database error');
    res.status(500).json({ message: 'Could not load account information.' });
  }
});

router.get('/student/me', async (req, res) => {
  const user = req.apiUser;
  if (user.owner_type !== 'student') {
    await req.saveUsage(403, 'Student endpoint requires student key');
    return res.status(403).json({ message: 'This endpoint requires a student API key.' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT id, student_code AS code, full_name, email, department, semester FROM students WHERE id = ?',
      [user.student_id]);
    await req.saveUsage(200, 'Own student profile loaded');
    res.json({ data: rows[0] || null });
  } catch (error) {
    await req.saveUsage(500, 'Student profile database error');
    res.status(500).json({ message: 'Could not load student profile.' });
  }
});

router.get('/student/marks', async (req, res) => {
  const user = req.apiUser;
  if (user.owner_type !== 'student') {
    await req.saveUsage(403, 'Student marks endpoint requires student key');
    return res.status(403).json({ message: 'This endpoint requires a student API key.' });
  }

  try {
    const [rows] = await db.execute(
      `SELECT subject_name, marks_obtained, total_marks, semester
       FROM academic_marks WHERE student_id = ? ORDER BY semester, subject_name LIMIT ?`,
      [user.student_id, user.max_rows]);
    await req.saveUsage(200, 'Own academic marks loaded');
    res.json({ data: rows, meta: { allowedRows: user.max_rows } });
  } catch (error) {
    await req.saveUsage(500, 'Student marks database error');
    res.status(500).json({ message: 'Could not load academic marks.' });
  }
});

router.get('/teacher/students', async (req, res) => {
  const user = req.apiUser;
  if (user.owner_type !== 'teacher') {
    await req.saveUsage(403, 'Teacher endpoint requires teacher key');
    return res.status(403).json({ message: 'Only teachers can view all students.' });
  }

  let requested = Number(req.query.limit);
  if (!Number.isInteger(requested) || requested < 1) requested = user.max_rows;
  const limit = Math.min(requested, user.max_rows);

  try {
    const [students] = await db.execute(
      `SELECT id, student_code AS code, full_name, email, department, semester
       FROM students ORDER BY student_code LIMIT ?`, [limit]);
    const ids = students.map(s => s.id);
    let marks = [];
    if (ids.length) {
      const placeholders = ids.map(() => '?').join(',');
      const [markRows] = await db.execute(
        `SELECT student_id, subject_name, marks_obtained, total_marks, semester
         FROM academic_marks WHERE student_id IN (${placeholders}) ORDER BY student_id, semester, subject_name`,
        ids);
      marks = markRows;
    }
    const result = students.map(student => ({
      ...student,
      marks: marks.filter(mark => mark.student_id === student.id)
    }));
    await req.saveUsage(200, 'Teacher loaded student records');
    res.json({ data: result, meta: { allowedRows: limit } });
  } catch (error) {
    console.error('Teacher records error:', error.message);
    await req.saveUsage(500, 'Teacher records database error');
    res.status(500).json({ message: 'Could not load student records.' });
  }
});

module.exports = router;
