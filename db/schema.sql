CREATE TABLE IF NOT EXISTS crm_systems (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  base_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  website_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS criteria (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  weight NUMERIC(8, 2) NOT NULL,
  criterion_type VARCHAR(80),
  description TEXT
);

CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  crm_id INT NOT NULL REFERENCES crm_systems(id) ON DELETE CASCADE,
  criterion_id INT NOT NULL REFERENCES criteria(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score BETWEEN 1 AND 10),
  comment TEXT,
  UNIQUE (crm_id, criterion_id)
);

CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(120) NOT NULL,
  number_of_employees INT NOT NULL,
  monthly_sales NUMERIC(14, 2) NOT NULL,
  expected_growth NUMERIC(6, 2) NOT NULL
);
