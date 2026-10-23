const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db');
const adminRoutes = require('./routes/admin');
const academicRoutes = require('./routes/academic');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));
app.get('/student', (req, res) => res.sendFile(path.join(__dirname, '../frontend/student.html')));
app.get('/teacher', (req, res) => res.sendFile(path.join(__dirname, '../frontend/teacher.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '../frontend/admin.html')));

app.use('/api/admin', adminRoutes);
app.use('/api', academicRoutes);

app.use((req, res) => res.status(404).json({ message: 'Endpoint not found.' }));
app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(500).json({ message: 'Unexpected server error.' });
});

async function start() {
  try {
    await db.query('SELECT 1');
    app.listen(PORT, () => {
      console.log(`University API server running at http://localhost:${PORT}`);
      console.log(`Admin panel: http://localhost:${PORT}/admin`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Start XAMPP MySQL and check backend/.env and database.sql.');
    process.exit(1);
  }
}

start();
