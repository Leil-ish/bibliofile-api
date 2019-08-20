CREATE TABLE bibliofile_notes (
    libraryId INTEGER NOT NULL
        REFERENCES bibliofile_books(libraryId) ON DELETE CASCADE NOT NULL,
    userId INTEGER NOT NULL
        REFERENCES bibliofile_users(userId) ON DELETE CASCADE NOT NULL,
    noteId SERIAL PRIMARY KEY,
    noteName TEXT NOT NULL,
    modified TIMESTAMP DEFAULT now() NOT NULL,
    content TEXT NOT NULL
);