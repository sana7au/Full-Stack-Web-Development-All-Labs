const db = require('./db');

async function saveUsage(keyId, req, status, message) {
  try {
    await db.execute(
      'INSERT INTO api_usage (api_key_id, endpoint, http_method, status_code, message) VALUES (?, ?, ?, ?, ?)',
      [keyId || null, req.originalUrl, req.method, status, message]
    );
  } catch (error) {
    console.error('Usage log error:', error.message);
  }
}

function adminOnly(req, res, next) {
  const key = req.get('x-api-key');
  const adminKey = process.env.ADMIN_API_KEY || 'admin-secret-2026';

  if (!key || key !== adminKey) {
    return res.status(401).json({ message: 'Admin API key is missing or invalid.' });
  }
  next();
}

async function userOnly(req, res, next) {
  const key = req.get('x-api-key');

  if (!key) {
    await saveUsage(null, req, 401, 'API key missing');
    return res.status(401).json({ message: 'API key is required in the x-api-key header.' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM api_keys WHERE api_key = ? LIMIT 1', [key]);
    if (!rows.length) {
      await saveUsage(null, req, 401, 'Invalid API key');
      return res.status(401).json({ message: 'Invalid API key.' });
    }

    const user = rows[0];
    if (!user.is_active) {
      await saveUsage(user.id, req, 403, 'API key revoked or disabled');
      return res.status(403).json({ message: 'This API key is disabled or revoked.' });
    }

    if (user.request_count >= user.max_requests) {
      await saveUsage(user.id, req, 429, 'Request limit reached');
      return res.status(429).json({ message: 'Request limit reached for this API key.' });
    }

    await db.execute('UPDATE api_keys SET request_count = request_count + 1 WHERE id = ?', [user.id]);
    user.request_count += 1;
    req.apiUser = user;
    req.saveUsage = (status, message) => saveUsage(user.id, req, status, message);
    next();
  } catch (error) {
    console.error('API key check error:', error.message);
    return res.status(500).json({ message: 'Could not validate API key.' });
  }
}

module.exports = { adminOnly, userOnly, saveUsage };
