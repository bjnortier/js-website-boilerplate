CREATE TABLE people (
  id serial PRIMARY KEY,
  contact VARCHAR(36) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);