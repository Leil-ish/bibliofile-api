CREATE TABLE bibliofile_books (
    libraryId SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    authors TEXT,
    description TEXT,
    categories TEXT NOT NULL,
    imageLinks TEXT,
    isEbook BOOLEAN DEFAULT FALSE NOT NULL,
    rating INTEGER,
    borrowed BOOLEAN DEFAULT FALSE NOT NULL
);