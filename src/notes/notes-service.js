const xss = require('xss')

const NotesService = {

  getAllNotes(db) {
    return db
    .from('bibliofile_notes AS bib_note')
    .select(
      'bib_note.id',
      'bib_note.book_id',
      'bib_note.user_id',
      'bib_note.note_name',
      'bib_note.modified',
      'bib_note.content',
    )
    .groupBy('bib_note.id')
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

  insertNote(db, newNote) {
    return db
      .insert(newNote)
      .into('bibliofile_notes')
      .returning('*')
      .then(([note]) => note)
      .then(note =>
        NotesService.getNoteById(db, note.book_id)
      )
  },

  serializeNote(note) {
    return {
      id: note.id,
      book_id: note.book_id,
      user_id: note.user_id,
      note_name: xss(note.note_name),
      content: xss(note.content),
      modified: new Date(note.modified),
    }
  }
}

module.exports = NotesService