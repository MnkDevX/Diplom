const db = require('../config/db');

const create = async ({ company_name, number_of_employees, monthly_sales, expected_growth }) => {
  const result = await db.query(
    `INSERT INTO companies (company_name, number_of_employees, monthly_sales, expected_growth)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [company_name, number_of_employees, monthly_sales, expected_growth]
  );
  return result.rows[0];
};

module.exports = { create };
