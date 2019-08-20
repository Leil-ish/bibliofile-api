const xss = require('xss')

const BooksService = {
  getAllBooks(db) {
    return db
      .from('bibliofile_books AS book')
      .select(
        'book.libraryId',
        'book.title',
        'book.authors',
        'book.description',
        'book.categories',
        'book.imageLinks',
        'book.isEbook',
        'book.rating',
        'book.borrowed',
        'book.userId',
        db.raw(
          `count(DISTINCT note) AS number_of_notes`
        ),
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'userId', user.userId,
              'firstName', user.firstName,
              'lastName', user.lastName,
              'username', user.username,
              'date_created', user.date_created,
              'date_modified', user.date_modified
            )
          ) AS "user"`
        ),
      )
      .leftJoin(
        'bibliofile_notes AS note',
        'book.libraryId',
        'note.libraryId',
      )
      .leftJoin(
        'bibliofile_users AS user',
        'book.userId',
        'user.userId',
      )
      .groupBy('book.libraryId', 'user.userId')
  },

  getById(db, id) {
    return BooksService.getAllBooks(db)
      .where('book.libraryId', libraryId)
      .first()
  },

  getNotesForBook(db, libraryId) {
    return db
      .from('bibliofile_notes AS note')
      .select(
        'note.noteId',
        'note.content',
        'note.date_created',
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  user.userId,
                  user.firstName,
                  user.lastName,
                  user.username,
                  user.date_created,
                  user.date_modified
              ) tmp)
            )
          ) AS "user"`
        )
      )
      .where('note.libraryId', libraryId)
      .leftJoin(
        'bibliofile_users AS user',
        'note.userId',
        'user.userId',
      )
      .groupBy('note.libraryId', 'user.userId')
  },

  serializeBook(book) {
    const {user} = book
    return {
      id: book.libraryId,
      title: xss(book.title),
      authors: xss(book.authors),
      description: xss(book.description),
      categories: xss(book.categories),
      number_of_notes: Number(book.number_of_notes) || 0,
      user: {
        userId: user.userId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        date_created: new Date(author.date_created),
        date_modified: new Date(author.date_modified) || null
      },
    }
  },

  serializeBookNote(note) {
    const {user} = note
    return {
      noteId: note.noteId,
      content: xss(note.content),
      modified: new Date(note.date_modified),
      user: {
        userId: noteUser.userId,
        username: noteUser.username,
        firstName: noteUser.firstName,
        lastName: noteUser.lastName,
        date_created: new Date(user.date_created),
        date_modified: new Date(user.date_modified) || null
      },
    }
  },
}

module.exports = BooksService