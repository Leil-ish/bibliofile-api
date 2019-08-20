CREATE TABLE bibliofile_users (
  userId SERIAL PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT now(),
  date_modified TIMESTAMP
);

ALTER TABLE bibliofile_books
  ADD COLUMN
    userId INTEGER REFERENCES bibliofile_users(userId)
    ON DELETE SET NULL;