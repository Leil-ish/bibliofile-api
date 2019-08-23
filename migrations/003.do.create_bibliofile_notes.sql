CREATE TABLE bibliofile_notes (
    id SERIAL PRIMARY KEY,
    book_id INTEGER NOT NULL
        REFERENCES bibliofile_books(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER NOT NULL
        REFERENCES bibliofile_users(id) ON DELETE CASCADE NOT NULL,
    note_name TEXT NOT NULL,
    modified TIMESTAMP DEFAULT now() NOT NULL,
    content TEXT NOT NULL
);