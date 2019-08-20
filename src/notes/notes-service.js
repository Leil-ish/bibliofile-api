const xss = require('xss')

const NotesService = {
  getById(db, id) {
    return db
      .from('bibliofile_notes AS note')
      .select(
        'note.libraryId',
        'note.userId',
        'note.noteId',
        'note.noteName',
        'note.modified',
        'note.content',
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  user.userId,
                  user.username,
                  user.firstName,
                  user.lastName,
                  user.date_created,
                  user.date_modified
              ) tmp)
            )
          ) AS "user"`
        )
      )
      .leftJoin(
        'bibliofile_users AS user',
        'note.userId',
        'user.userId',
      )
      .where('note.libraryId', libraryId)
      .first()
  },

  insertNote(db, newNote) {
    return db
      .insert(newNote)
      .into('bibliofile_notes')
      .returning('*')
      .then(([note]) => note)
      .then(note =>
        NotesService.getById(db, note.libraryId)
      )
  },

  serializeNote(note) {
    const {user} = note
    return {
      libraryId: note.libraryId,
      userId: note.userId,
      noteId: note.noteId,
      noteName: xss(note.noteName),
      modified: new Date(note.modified),
      content: xss(note.content),
      user: {
        id: user.userId,
        user_name: user.username,
        full_name: user.firstName,
        nickname: user.lastName,
        date_created: new Date(user.date_created),
        date_modified: new Date(user.date_modified) || null
      },
    }
  }
}

module.exports = NotesService