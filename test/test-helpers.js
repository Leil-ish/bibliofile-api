const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
      {
        id: 1,
        first_name: 'Test-1',
        last_name: 'User-1',
        username: 'TU1',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        date_modified: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 2,
        first_name: 'Test-2',
        last_name: 'User-2',
        username: 'TU2',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        date_modified: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 3,
        first_name: 'Test-3',
        last_name: 'User-3',
        username: 'TU3',
        password: 'password',
        date_created: new Date('2029-01-22T16:28:32.615Z'),
        date_modified: new Date('2029-01-22T16:28:32.615Z'),
      },
      {
        id: 4,
        first_name: 'Test-4',
        last_name: 'User-4',
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
        id: 1,
        title: 'Test Book 1',
        authors: 'John Smi',
        description: 'A super good book',
        categories: 'Fiction',
        image_links: 'http://books.google.com/books/content?id=A5RteM-rsycC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        is_ebook:false,
        rating: 5,
        borrowed: false,
        user_id: users[0].id,
      },
    {
        id: 2,
        title: 'Test Book 2',
        authors: 'John Smit',
        description: 'A super good book',
        categories: 'Fiction',
        image_links: 'http://books.google.com/books/content?id=A5RteM-rsycC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        is_ebook:false,
        rating: 5,
        borrowed: false,
        user_id: users[1].id,
      },
      {
        id: 3,
        title: 'Test Book 3',
        authors: 'John Smith',
        description: 'A super good book',
        categories: 'Fiction',
        image_links: 'http://books.google.com/books/content?id=A5RteM-rsycC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        is_ebook:false,
        rating: 5,
        borrowed: false,
        user_id: users[2].id,
      },
      {
        id: 4,
        title: 'Test Book 4',
        authors: 'John Smithey',
        description: 'A super good book',
        categories: 'Fiction',
        image_links: 'http://books.google.com/books/content?id=A5RteM-rsycC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        is_ebook:false,
        rating: 5,
        borrowed: false,
        user_id: users[3].id,
      },
  ]
}

function makeNotesArray(users, books) {
  return [
      {
        id: books[0].id,
        user_id: users[0].id,
        book_id: 1,
        note_name: 'First test note!',
        modified: new Date('2029-01-22T16:28:32.615Z'),
        content: 'Test content 1',
      },
      {
        id: books[1].id,
        user_id: users[1].id,
        book_id: 2,
        note_name: 'First test note!',
        modified: new Date('2029-01-22T16:28:32.615Z'),
        content: 'Test content 2',
      },
      {
        id: books[2].id,
        user_id: users[2].id,
        book_id: 3,
        note_name: 'First test note!',
        modified: new Date('2029-01-22T16:28:32.615Z'),
        content: 'Test content 3',
      },
      {
        id: books[3].id,
        user_id: users[3].id,
        book_id: 4,
        note_name: 'First test note!',
        modified: new Date('2029-01-22T16:28:32.615Z'),
        content: 'Test content 4',
      },
  ];
}

function makeExpectedBook(book, notes=[]) {

  return {
    id: book.id,
    title: book.title,
    authors: book.authors,
    description: book.description,
    categories: book.categories,
    image_links: book.image_links,
    is_ebook: book.is_ebook,
    rating: book.rating,
    borrowed: book.borrowed, 
    user_id: book.user_id,
  }
}

function makeExpectedBookNotes(bookId, notes) {
  const expectedNotes = notes
    .filter(note => note.book_id === bookId)

  return expectedNotes.map(note => {
    return {
      id: note.id,
      book_id: note.book_id,
      note_name: note.note_name,
      content: note.content,
      modified: note.modifed.toISOString(),

    }
  })
}

function makeMaliciousBook(user) {
  const maliciousBook = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    authors: 'Bad News Folk',
    description: 'Naughty naughty very naughty <script>alert("xss");</script>',
    categories: 'Bad',
    image_links: 'https://url.to.file.which/does-not.exist',
    is_ebook: false,
    rating: 1,
    borrowed: false,
    user_id: user.user_id,
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
  return {testUsers, testBooks, testNotes}
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
    subject: user.username,
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
