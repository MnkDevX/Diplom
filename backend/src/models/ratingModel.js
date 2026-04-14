const db = require('../config/db');

const upsert = async ({ crm_id, criterion_id, score, comment }) => {
  // Повторное сохранение оценки обновляет существующую запись по паре crm+критерий.
  const result = await db.query(
    `INSERT INTO ratings (crm_id, criterion_id, score, comment)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (crm_id, criterion_id)
     DO UPDATE SET score = EXCLUDED.score,
                   comment = EXCLUDED.comment
     RETURNING *`,
    [crm_id, criterion_id, score, comment || null]
  );
  return result.rows[0];
};

const getSummary = async () => {
  // Итоговый рейтинг рассчитывается по формуле R = Σ (Wi * Si).
  const query = `
    SELECT
      c.id,
      c.name,
      c.base_price,
      COALESCE(SUM(cr.weight * r.score), 0) AS rating,
      COALESCE(SUM(cr.weight * 10), 0) AS max_rating,
      COALESCE(
        ROUND((SUM(cr.weight * r.score) / NULLIF(SUM(cr.weight * 10), 0)) * 100, 2),
        0
      ) AS percent_of_max
    FROM crm_systems c
    LEFT JOIN ratings r ON c.id = r.crm_id
    LEFT JOIN criteria cr ON r.criterion_id = cr.id
    GROUP BY c.id
    ORDER BY rating DESC;
  `;

  const result = await db.query(query);
  return result.rows;
};

const getMatrix = async () => {
  const result = await db.query(
    `SELECT
      c.id as crm_id,
      c.name as crm_name,
      cr.id as criterion_id,
      cr.name as criterion_name,
      cr.weight,
      r.score,
      r.comment
     FROM crm_systems c
     CROSS JOIN criteria cr
     LEFT JOIN ratings r
       ON r.crm_id = c.id AND r.criterion_id = cr.id
     ORDER BY c.id, cr.id`
  );
  return result.rows;
};

module.exports = { upsert, getSummary, getMatrix };
