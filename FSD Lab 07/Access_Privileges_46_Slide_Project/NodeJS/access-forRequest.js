// ACCESS PRIVILEGES — Full Stack Web Development (46-slide lecture)
// Existing database: mydb8  |  Existing table: customers4
// Start with: npm install, then node access-forRequest.js
// This project only READS records. No database/table changes.

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

// Slides 2-7, 24: XAMPP and Node.js use different ports.
app.use(cors({
  origin: ['http://localhost', 'http://127.0.0.1'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));
app.use(express.json());

// Slide 8: These database settings are the SAME as the previous lab.
const DATABASE = 'mydb8';
const TABLE = 'customers4';

// Slide 20: Only the name and address columns are returned.
// Slides 26-28: Keep the search statement in two readable parts.
const SQL_ROWS = 'SELECT name, address FROM customers4';
const SQL_SEARCH = SQL_ROWS + ' WHERE name LIKE ? LIMIT ?';

// Existing local XAMPP MySQL connection. Change only if your PC differs.
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: DATABASE,
  connectionLimit: 10
});

// Slides 10-16 and 21-23: Permission checks happen before SQL.
function checkAccess(req, res, next) {
  const key = req.get('x-api-key');

  if (!key) {
    return res.status(401).json({
      message: 'Unauthorized: API key required'
    });
  }

  const sql = `
    SELECT *
    FROM api_access
    WHERE api_key = ? AND is_active = TRUE
    LIMIT 1
  `;

  db.query(sql, [key], function (err, rows) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({
        message: 'Database error while checking access'
      });
    }

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Unauthorized: invalid API key'
      });
    }

    const user = rows[0];
    const allowedDatabases = JSON.parse(user.allowed_databases);
    const allowedTables = JSON.parse(user.allowed_tables);

    if (!allowedDatabases.includes(DATABASE)) {
      return res.status(403).json({
        message: 'Forbidden: database access denied'
      });
    }

    if (!allowedTables.includes(TABLE)) {
      return res.status(403).json({
        message: 'Forbidden: table access denied'
      });
    }

    if (user.credits <= 0) {
      return res.status(429).json({
        message: 'API credits finished'
      });
    }

    db.query(
      'UPDATE api_access SET credits = credits - 1 WHERE id = ? AND credits > 0',
      [user.id],
      function (updateErr, result) {
        if (updateErr) {
          return res.status(500).json({
            message: 'Could not update API credits'
          });
        }

        if (result.affectedRows === 0) {
          return res.status(429).json({
            message: 'API credits finished'
          });
        }

        user.credits -= 1;
        user.allowedDatabases = allowedDatabases;
        user.allowedTables = allowedTables;

        req.currentUser = user;
        next();
      }
    );
  });
}

// Slide 18: The smaller value becomes the limit used by SQL.
function getAllowedRows(input, maxRows) {
  const maximum = Number(maxRows);
  if (!Number.isInteger(maximum) || maximum < 1) {
    return 3;
  }
  const requested = Number(input);
  if (!Number.isInteger(requested) || requested < 1) {
    return maximum;
  }
  return Math.min(requested, maximum);
}

// Server-running check (does not access the database).
app.get('/', function (req, res) {
  res.send('<h2>Access Privileges API is running</h2>' +
           '<p>Database: ' + DATABASE + ' | Table: ' + TABLE + '</p>' +
           '<p>Open the XAMPP client to send your API key.</p>');
});

// Slides 17-20 and 29: LOAD route -> requested rows are capped.
app.get('/api/customers', checkAccess, function (req, res) {
  const user = req.currentUser;
  const limit = getAllowedRows(req.query.limit, user.maxRows);

  db.query(SQL_ROWS + ' LIMIT ?', [limit], function (err, rows) {
    if (err) {
      console.error('MySQL load error:', err.message);
      return res.status(500).json({ message: 'Database error: check MySQL and customers4' });
    }

    res.json({
      meta: {
        role: user.role,
        allowedRows: limit,
        remainingCredits: user.credits,
        database: DATABASE,
        table: TABLE
      },
      data: rows
    });
  });
});

// Slides 25-29 and 38-39: SEARCH route -> role maximum (not Requested Rows).
app.get('/api/customers/search', checkAccess, function (req, res) {
  const user = req.currentUser;
  const name = String(req.query.name || '');
  const pattern = '%' + name + '%'; // Slide 26: Ali -> %Ali%
  const limit = user.maxRows;       // Slide 28: max 3 or 10

  // Slide 27: '?' values are supplied SEPARATELY from the SQL text.
  db.query(SQL_SEARCH, [pattern, limit], function (err, rows) {
    if (err) {
      console.error('MySQL search error:', err.message);
      return res.status(500).json({ message: 'Database error: check MySQL and customers4' });
    }

    res.json({
      meta: {
        role: user.role,
        allowedRows: limit,
        remainingCredits: user.credits,
        search: name,
        database: DATABASE,
        table: TABLE
      },
      data: rows
    });
  });
});

// Slide 40: Node API runs separately from Apache/XAMPP.
app.listen(3000, function () {
  console.log('Access Privileges API ready: http://localhost:3000');
  console.log('Database: ' + DATABASE + ' | Table: ' + TABLE);
  console.log('Student maxRows=3, credits=8 | Teacher maxRows=10, credits=30');
  console.log('Open XAMPP: http://localhost/ajaxdemo/access_ajaxRequest.php');
});
