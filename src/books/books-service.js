const xss = require('xss')

const BooksService = {
  getAllBooks(db) {
    return db
      .from('bibliofile_books AS book')
      .select(
        'book.id',
        'book.title',
        'book.authors',
        'book.description',
        'book.categories',
        'book.image_links',
        'book.is_ebook',
        'book.rating',
        'book.borrowed',
        db.raw(
          `count(DISTINCT note) AS number_of_notes`
        ),
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', usr.id,
              'username', usr.username,
              'first_name', usr.first_name,
              'last_name', usr.last_name,
              'date_created', usr.date_created,
              'date_modified', usr.date_modified
            )
          ) AS "user"`
        ),
      )
      .leftJoin(
        'bibliofile_notes AS note',
        'book.id',
        'note.book_id',
      )
      .leftJoin(
        'bibliofile_users AS usr',
        'book.user_id',
        'usr.id',
      )
      .groupBy('book.id', 'usr.id')
  },

  getById(db, id) {
    return BooksService.getAllBooks(db)
      .where('book.id', id)
      .first()
  },

  getNotesForBook(db, book_id) {
    return db
      .from('bibliofile_notes AS note')
      .select(
        'note.id',
        'note.text',
        'note.date_created',
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  usr.id,
                  usr.username,
                  usr.first_name,
                  usr.last_name,
                  usr.date_created,
                  usr.date_modified
              ) tmp)
            )
          ) AS "user"`
        )
      )
      .where('note.book_id', book_id)
      .leftJoin(
        'bibliofile_users AS usr',
        'note.user_id',
        'usr.id',
      )
      .groupBy('note.id', 'usr.id')
  },

  serializeBook(book) {
    const { author } = book
    return {
      id: book.id,
      title: xss(book.title),
      authors: xss(book.authors),
      description: xss(book.description),
      categories: xss(book.categories),
      image_links: xss(book.image_links),
      is_ebook: xss(book.is_ebook),
      rating: xss(book.rating),
      borrowed: xss(book.borrowed),
      number_of_notes: Number(book.number_of_notes) || 0,
      author: {
        id: author.id,
        username: author.username,
        first_name: author.first_name,
        last_name: author.last_name,
        date_created: new Date(author.date_created),
        date_modified: new Date(author.date_modified) || null
      },
    }
  },

  serializeBookNote(note) {
    const { user } = note
    return {
      id: note.id,
      book_id: note.book_id,
      text: xss(note.text),
      date_created: new Date(note.date_created),
      user: {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        date_created: new Date(user.date_created),
        date_modified: new Date(user.date_modified) || null
      },
    }
  },
}

module.exports = BooksService