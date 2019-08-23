CREATE TABLE bibliofile_users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT now(),
  date_modified TIMESTAMP
);

ALTER TABLE bibliofile_books
  ADD COLUMN
    user_id INTEGER REFERENCES bibliofile_users(id)
    ON DELETE SET NULL;