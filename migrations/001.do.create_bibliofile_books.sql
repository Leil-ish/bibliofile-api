CREATE TABLE bibliofile_books (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    authors TEXT,
    description TEXT,
    categories TEXT NOT NULL,
    image_links TEXT,
    is_ebook BOOLEAN DEFAULT FALSE NOT NULL,
    rating INTEGER,
    borrowed BOOLEAN DEFAULT FALSE NOT NULL
);