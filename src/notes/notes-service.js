const xss = require('xss')

const NotesService = {
  getById(db, id) {
    return db
      .from('bibliofile_notes AS note')
      .select(
        'note.id',
        'note.text',
        'note.date_created',
        'note.book_id',
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
      .leftJoin(
        'bibliofile_users AS usr',
        'note.user_id',
        'usr.id',
      )
      .where('note.id', id)
      .first()
  },

  insertNote(db, newNote) {
    return db
      .insert(newNote)
      .into('bibliofile_notes')
      .returning('*')
      .then(([note]) => note)
      .then(note =>
        NotesService.getById(db, note.id)
      )
  },

  serializeNote(note) {
    const { user } = note
    return {
      id: note.id,
      text: xss(note.text),
      book_id: note.book_id,
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
  }
}

module.exports = NotesService