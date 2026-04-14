const db = require('../config/db');

const getAll = async () => {
  const result = await db.query('SELECT * FROM crm_systems ORDER BY id');
  return result.rows;
};

const create = async ({ name, description, base_price, website_url }) => {
  const result = await db.query(
    `INSERT INTO crm_systems (name, description, base_price, website_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description || null, base_price || 0, website_url || null]
  );
  return result.rows[0];
};

const update = async (id, { name, description, base_price, website_url }) => {
  const result = await db.query(
    `UPDATE crm_systems
     SET name = $1,
         description = $2,
         base_price = $3,
         website_url = $4
     WHERE id = $5
     RETURNING *`,
    [name, description || null, base_price || 0, website_url || null, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await db.query('DELETE FROM crm_systems WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = { getAll, create, update, remove };
