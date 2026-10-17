const { pool } = require('./db');

function createModel(table, fields) {
  const placeholders = fields.map(() => '?').join(', ');
  const setters = fields.map((f) => `${f} = ?`).join(', ');
  const pick = (data) => fields.map((f) => data[f] ?? null);

  return {
    async getAll() {
      const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY id ASC`);
      return rows;
    },

    async create(data) {
      const sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`;
      const [result] = await pool.query(sql, pick(data));
      return result.insertId;
    },

    async update(id, data) {
      const [result] = await pool.query(`UPDATE ${table} SET ${setters} WHERE id = ?`, [...pick(data), id]);
      return result.affectedRows;
    },

    async remove(id) {
      const [result] = await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
      return result.affectedRows;
    }
  };
}

const profile = {
  async get() {
    const [rows] = await pool.query('SELECT * FROM profile WHERE id = 1');
    return rows[0] || null;
  },

  async save(data) {
    const existing = await this.get();
    const values = [data.name, data.title, data.email, data.phone, data.location, data.about];

    if (!existing) {
      await pool.query(
        'INSERT INTO profile (id, name, title, email, phone, location, about, image) VALUES (1, ?, ?, ?, ?, ?, ?, ?)',
        [...values, data.image || null]
      );
      return;
    }

    await pool.query(
      'UPDATE profile SET name = ?, title = ?, email = ?, phone = ?, location = ?, about = ?, image = ? WHERE id = 1',
      [...values, data.image || existing.image]
    );
  }
};

module.exports = {
  profile,
  skills: createModel('skills', ['name', 'level']),
  education: createModel('education', ['degree', 'institute', 'start_year', 'end_year']),
  experience: createModel('experience', ['role', 'company', 'start_date', 'end_date', 'description']),
  projects: createModel('projects', ['title', 'description', 'tech', 'link'])
};
