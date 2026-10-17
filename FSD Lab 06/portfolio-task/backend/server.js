const path = require('path');
const express = require('express');
require('./db');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/libs/jquery', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/api', routes);
app.use('/api', (req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, req, res, next) => {
  const status = err.status || (err.name === 'MulterError' ? 400 : 500);
  if (status === 500) console.error(err);
  res.status(status).json({ message: status === 500 ? 'Server error, please try again' : err.message });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
