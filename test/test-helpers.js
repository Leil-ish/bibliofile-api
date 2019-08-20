const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
      {
        userId: 1,
        firstName: 'Test-1',
        lastName: 'User-1',
        username: 'TU1',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        date_modified: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        userId: 2,
        firstName: 'Test-2',
        lastName: 'User-2',
        username: 'TU2',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        date_modified: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        userId: 3,
        firstName: 'Test-3',
        lastName: 'User-3',
        username: 'TU3',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        date_modified: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        userId: 4,
        firstName: 'Test-4',
        lastName: 'User-4',
        username: 'TU4',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        date_modified: new Date('2029-01-22T16:28:32.615Z'),
      },
  ]
}

function makeBooksArray(users) {
  return [
    {
        libraryId: 1,
        title: 'Test Book 1',
        authors: 'John Smi',
        description: 'A super good book',
        categories: 'Fiction',
        imageLinks: 'http://books.google.com/books/content?id=A5RteM-rsycC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        isEbook:false,
        rating: 5,
        borrowed: false,
        userId: users[0].id,
      },
    {
        libraryId: 2,
        title: 'Test Book 2',
        authors: 'John Smit',
        description: 'A super good book',
        categories: 'Fiction',
        imageLinks: 'http://books.google.com/books/content?id=A5RteM-rsycC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        isEbook:false,
        rating: 5,
        borrowed: false,
        userId: users[1].id,
      },
      {
        libraryId: 3,
        title: 'Test Book 3',
        authors: 'John Smith',
        description: 'A super good book',
        categories: 'Fiction',
        imageLinks: 'http://books.google.com/books/content?id=A5RteM-rsycC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        isEbook:false,
        rating: 5,
        borrowed: false,
        userId: users[2].id,
      },
      {
        libraryId: 4,
        title: 'Test Book 4',
        authors: 'John Smithey',
        description: 'A super good book',
        categories: 'Fiction',
        imageLinks: 'http://books.google.com/books/content?id=A5RteM-rsycC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        isEbook:false,
        rating: 5,
        borrowed: false,
        userId: users[3].id,
      },
  ]
}

function makeNotesArray(users, books) {
  return [
      {
        libraryId: books[0].id,
        userId: users[0].id,
        noteId: 1,
        text: 'First test note!',
        modified: new Date('2029-01-22T16:28:32.615Z'),
        content: 'Test content 1',
      },
      {
        libraryId: books[1].id,
        userId: users[1].id,
        noteId: 2,
        text: 'First test note!',
        modified: new Date('2029-01-22T16:28:32.615Z'),
        content: 'Test content 2',
      },
      {
        libraryId: books[2].id,
        userId: users[2].id,
        noteId: 3,
        text: 'First test note!',
        modified: new Date('2029-01-22T16:28:32.615Z'),
        content: 'Test content 3',
      },
      {
        libraryId: books[3].id,
        userId: users[3].id,
        noteId: 4,
        text: 'First test note!',
        modified: new Date('2029-01-22T16:28:32.615Z'),
        content: 'Test content 4',
      },
  ];
}

function makeExpectedBook(users, book, notes=[]) {
  const author = users
    .find(user => user.userId === book.userId)

  const number_of_notes = notes
    .filter(note => note.libraryId === book.libraryId)
    .length

  return {
    libraryId: book.libraryId,
    title: book.title,
    authors: book.authors,
    description: book.description,
    categories: book.categories,
    number_of_notes,
    user: {
        userId: user.userId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        date_created: user.date_created.toISOString(),
        date_modified: user.date_modified || null,
      }
  }
}

function makeExpectedBookNotes(users, libraryId, notes) {
  const expectedNotes = notes
    .filter(note => note.libraryId === libraryId)

  return expectedNotes.map(note => {
    const noteUser = users.find(user => user.userId === note.userId)
    return {
      noteId: note.noteId,
      content: note.content,
      modified: note.modifed.toISOString(),
      user: {
        userId: noteUser.userId,
        username: noteUser.username,
        firstName: noteUser.firstName,
        lastName: noteUser.lastName,
        date_created: noteUser.date_created.toISOString(),
        date_modified: noteUser.date_modified || null,
      }
    }
  })
}

function makeMaliciousBook(user) {
  const maliciousBook = {
    libraryId: 911,
    title: 'Bad News Bears',
    authors: 'Bad News Folk',
    description: 'Naughty naughty very naughty <script>alert("xss");</script>',
    categories: 'Bad',
    imageLinks: 'https://url.to.file.which/does-not.exist',
    isEbook: false,
    rating: 1,
    borrowed: false,
    userId: user.userId,
  }
  const expectedBook = {
    ...makeExpectedBook([user], maliciousBook),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousBook,
    expectedBook,
  }
}

function makeBooksFixtures() {
  const testUsers = makeUsersArray()
  const testBooks = makeBooksArray(testUsers)
  const testNotes = makeNotesArray(testUsers, testBooks)
  return { testUsers, testBooks, testNotes }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        bibliofile_books,
        bibliofile_users,
        bibliofile_notes
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE bibliofile_books_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE bibliofile_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE bibliofile_notes_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('bibliofile_books_id_seq', 0)`),
        trx.raw(`SELECT setval('bibliofile_users_id_seq', 0)`),
        trx.raw(`SELECT setval('bibliofile_notes_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('bibliofile_users').insert(preppedUsers)
    .then(() =>
      db.raw(
        `SELECT setval('bibliofile_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedBooksTables(db, users, books, notes=[]) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('bibliofile_books').insert(books)
    await trx.raw(
      `SELECT setval('bibliofile_books_id_seq', ?)`,
      [books[books.length - 1].id],
    )
    if (notes.length) {
      await trx.into('bibliofile_notes').insert(notes)
      await trx.raw(
        `SELECT setval('bibliofile_notes_id_seq', ?)`,
        [notes[notes.length - 1].id],
      )
    }
  })
}

function seedMaliciousBook(db, user, book) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('bibliofile_books')
        .insert([book])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeBooksArray,
  makeExpectedBook,
  makeExpectedBookNotes,
  makeMaliciousBook,
  makeNotesArray,

  makeBooksFixtures,
  cleanTables,
  seedBooksTables,
  seedMaliciousBook,
  makeAuthHeader,
  seedUsers,
}
