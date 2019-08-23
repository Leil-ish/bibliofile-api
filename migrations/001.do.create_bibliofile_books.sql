CREATE TABLE bibliofile_books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    authors TEXT,
    description TEXT,
    categories TEXT NOT NULL,
    image_links TEXT,
    is_ebook BOOLEAN DEFAULT FALSE NOT NULL,
    rating INTEGER,
    borrowed BOOLEAN DEFAULT FALSE NOT NULL
);