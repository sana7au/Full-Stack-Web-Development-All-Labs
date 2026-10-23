const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { adminOnly, saveUsage } = require('../middleware');
const router = express.Router();

router.use(adminOnly);

router.get('/people', async (req, res) => {
  try {
    const [students] = await db.execute('SELECT id, student_code AS code, full_name, email, department, semester FROM students ORDER BY id');
    const [teachers] = await db.execute('SELECT id, teacher_code AS code, full_name, email, department FROM teachers ORDER BY id');
    res.json({ students, teachers });
  } catch (error) {
    res.status(500).json({ message: 'Could not load university people.' });
  }
});

router.get('/keys', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT k.id, k.api_key, k.owner_type, k.student_id, k.teacher_id,
      k.max_rows, k.max_requests, k.request_count, k.is_active, k.created_at,
      COALESCE(s.full_name, t.full_name) AS owner_name,
      COALESCE(s.student_code, t.teacher_code) AS owner_code
      FROM api_keys k
      LEFT JOIN students s ON k.student_id = s.id
      LEFT JOIN teachers t ON k.teacher_id = t.id
      ORDER BY k.id DESC`);
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ message: 'Could not load API keys.' });
  }
});

router.post('/keys', async (req, res) => {
  const { ownerType, ownerId, maxRows, maxRequests } = req.body;
  const rows = Number(maxRows);
  const requests = Number(maxRequests);

  if (!['student', 'teacher'].includes(ownerType) || !Number.isInteger(Number(ownerId)) ||
      !Number.isInteger(rows) || rows < 1 || rows > 100 ||
      !Number.isInteger(requests) || requests < 1 || requests > 100000) {
    return res.status(400).json({ message: 'Choose a valid owner and positive row/request limits.' });
  }

  try {
    const apiKey = 'uni_' + crypto.randomBytes(24).toString('hex');
    let studentId = null;
    let teacherId = null;

    if (ownerType === 'student') {
      const [owner] = await db.execute('SELECT id FROM students WHERE id = ?', [Number(ownerId)]);
      if (!owner.length) return res.status(404).json({ message: 'Student not found.' });
      studentId = Number(ownerId);
    } else {
      const [owner] = await db.execute('SELECT id FROM teachers WHERE id = ?', [Number(ownerId)]);
      if (!owner.length) return res.status(404).json({ message: 'Teacher not found.' });
      teacherId = Number(ownerId);
    }

    const [result] = await db.execute(
      'INSERT INTO api_keys (api_key, owner_type, student_id, teacher_id, max_rows, max_requests) VALUES (?, ?, ?, ?, ?, ?)',
      [apiKey, ownerType, studentId, teacherId, rows, requests]
    );
    res.status(201).json({ message: 'API key created.', id: result.insertId, apiKey });
  } catch (error) {
    console.error('Create key error:', error.message);
    res.status(500).json({ message: 'Could not create API key.' });
  }
});

router.patch('/keys/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { maxRows, maxRequests, isActive } = req.body;

  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: 'Invalid key ID.' });
  if (maxRows !== undefined && (!Number.isInteger(Number(maxRows)) || Number(maxRows) < 1 || Number(maxRows) > 100)) {
    return res.status(400).json({ message: 'maxRows must be from 1 to 100.' });
  }
  if (maxRequests !== undefined && (!Number.isInteger(Number(maxRequests)) || Number(maxRequests) < 1)) {
    return res.status(400).json({ message: 'maxRequests must be a positive integer.' });
  }

  try {
    const [existing] = await db.execute('SELECT id FROM api_keys WHERE id = ?', [id]);
    if (!existing.length) return res.status(404).json({ message: 'API key not found.' });

    if (maxRows !== undefined) await db.execute('UPDATE api_keys SET max_rows = ? WHERE id = ?', [Number(maxRows), id]);
    if (maxRequests !== undefined) await db.execute('UPDATE api_keys SET max_requests = ? WHERE id = ?', [Number(maxRequests), id]);
    if (isActive !== undefined) await db.execute('UPDATE api_keys SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, id]);

    res.json({ message: 'API key settings updated.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not update API key.' });
  }
});

router.delete('/keys/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: 'Invalid key ID.' });
  try {
    const [result] = await db.execute('UPDATE api_keys SET is_active = 0 WHERE id = ?', [id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'API key not found.' });
    res.json({ message: 'API key revoked.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not revoke API key.' });
  }
});

router.get('/usage', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT u.id, u.endpoint, u.http_method, u.status_code, u.message, u.created_at,
      k.owner_type, k.api_key
      FROM api_usage u LEFT JOIN api_keys k ON u.api_key_id = k.id
      ORDER BY u.id DESC LIMIT 200`);
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ message: 'Could not load usage history.' });
  }
});

module.exports = router;
