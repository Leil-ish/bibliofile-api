const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Notes Endpoints', function() {
  let db

  const {
    testBooks,
    testUsers,
  } = helpers.makeBooksFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/notes`, () => {
    beforeEach('insert books', () =>
      helpers.seedBooksTables(
        db,
        testUsers,
        testBooks,
      )
    )

    it(`creates an note, responding with 201 and the new note`, function() {
      this.retries(3)
      const testBook = testBooks[0]
      const testUser = testUsers[0]
      const newNote = {
        note_name: 'Test new note',
        book_id: testBook.id,
      }
      return supertest(app)
        .post('/api/notes')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newNote)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.note_name).to.eql(newNote.note_name)
          expect(res.body.book_id).to.eql(newNote.book_id)
          expect(res.headers.location).to.eql(`/api/notes/${res.body.id}`)
          const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
          const actualDate = new Date(res.body.date_created).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        })
        .expect(res =>
          db
            .from('bibliofile_notes')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.note_name).to.eql(newNote.note_name)
              expect(row.book_id).to.eql(newNote.book_id)
              expect(row.user_id).to.eql(testUser.id)
              expect(row.modified).to.eql(testNote.modified)
              expect(row.content).to.eql(testNote.modified)
              const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
              const actualDate = new Date(row.date_created).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
            })
        )
    })

    const requiredFields = ['note_name', 'book_id']

    requiredFields.forEach(field => {
      const testBook = testBooks[0]
      const testUser = testUsers[0]
      const newNote = {
        note_name: 'Test new note',
        book_id: testBook.id,
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newNote[field]

        return supertest(app)
          .post('/api/notes')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(newNote)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })
  })
})