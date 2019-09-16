const xss = require('xss')

const BooksService = {
  getAllBooks(db) {
    return db
      .from('bibliofile_books AS bib_book')
      .select(
        'bib_book.id',
        'bib_book.title',
        'bib_book.authors',
        'bib_book.description',
        'bib_book.categories',
        'bib_book.image_links',
        'bib_book.is_ebook',
        'bib_book.rating',
        'bib_book.borrowed',
        'bib_book.user_id',
        )
        .groupBy('bib_book.id')
      },
  
    getById(db, id) {
      return BooksService.getAllBooks(db)
        .where('bib_book.id', id)
        .first()
    },

    getNoteById(db, id) {
      return db
      .from('bibliofile_notes AS bib_note')
      .select(
        'bib_note.id',
        'bib_note.note_name',
        'bib_note.content',
      )
      .where('bib_note.id', id)
    },
  
    getNotesForBook(db, book_id) {
      return db
        .from('bibliofile_notes AS bib_note')
        .select(
          'bib_note.id',
          'bib_note.note_name',
          'bib_note.content',
        )
        .where('bib_note.book_id', book_id)
        .groupBy('bib_note.id')
    },

    deleteNote(db, id) {
      return db
      .from('bibliofile_notes AS bib_note')
      .select(
        'bib_note.id',
      )
      .where('bib_note.id', id)
      .delete()
    },

    deleteBook(db, id) {
      return db
      .from('bibliofile_books AS book')
      .select(
        'bib_book.id',
        'bib_book.title',
        'bib_book.authors',
        'bib_book.description',
        'bib_book.categories',
        'bib_book.image_links',
        'bib_book.is_ebook',
        'bib_book.rating',
        'bib_book.borrowed',
        'bib_book.user_id',
        )
      .where('bib_book.id', id)
      .delete()
    },

    insertNote(db, newNote) {
      return db
        .insert(newNote)
        .into('bibliofile_notes')
        .returning('*')
        .then(([note]) => note)
        .then(note =>
          BooksService.getNoteById(db, note.book_id)
        )
    },

    insertBook(db, newBook) {
      return db
        .insert(newBook)
        .into('bibliofile_books')
        .returning('*')
        .then(([book]) => book)
        .then(book =>
          BooksService.getById(db, book.id)
        )
    },

    updateBook(db, id, updatedBook) {
      return db
        .where({ id })
        .update(updatedBook)
        .into('bibliofile_books')
        .returning('*')
        .then(([book]) => book)
        .then(book =>
          BooksService.getById(db, book.id)
        )
    },
  
    serializeBook(book) {
      return {
        id: book.id,
        title: xss(book.title),
        authors: xss(book.authors),
        description: xss(book.description),
        categories: xss(book.categories),
        image_links: xss(book.image_links),
        is_ebook: book.is_ebook,
        rating: book.rating,
        borrowed: book.borrowed,
        user_id: book.user_id,
      }
    },
  
    serializeBookNote(note) {
      return {
        note_id: note.id,
        book_id: note.book_id,
        user_id: note.user_id,
        note_name: note.note_name,
        modified: new Date(note.modified),
        content: xss(note.content),
      }
    },
  }
  
  module.exports = BooksService