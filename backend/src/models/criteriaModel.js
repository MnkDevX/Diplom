const db = require('../config/db');

const getAll = async () => {
  const result = await db.query('SELECT * FROM criteria ORDER BY id');
  return result.rows;
};

const create = async ({ name, weight, criterion_type, description }) => {
  const result = await db.query(
    `INSERT INTO criteria (name, weight, criterion_type, description)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, weight, criterion_type || null, description || null]
  );
  return result.rows[0];
};

const update = async (id, { name, weight, criterion_type, description }) => {
  const result = await db.query(
    `UPDATE criteria
     SET name = $1,
         weight = $2,
         criterion_type = $3,
         description = $4
     WHERE id = $5
     RETURNING *`,
    [name, weight, criterion_type || null, description || null, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await db.query('DELETE FROM criteria WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = { getAll, create, update, remove };
