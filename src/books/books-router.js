const express = require('express')
const path = require('path')
const BooksService = require('./books-service')
const {requireAuth} = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()
const booksRouter = express.Router()

booksRouter
  .route('/')
  .get((req, res, next) => {
    BooksService.getAllBooks(req.app.get('db'))
      .then(books => {
        res.json(books.map(BooksService.serializeBook))
      })
      .catch(next)
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const {title, authors, description, categories, image_links, is_ebook} = req.body
    const newBook = {title, authors, description, categories, image_links, is_ebook}

    for (const [key, value] of Object.entries(newBook))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    newBook.user_id = req.user.id

    BooksService.insertBook(
      req.app.get('db'),
      newBook
    )
      .then(book => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${book.id}`))
          .json(BooksService.serializeBook(book))
      })
      .catch(next)
    })

booksRouter
    .route('/add-book')
    .get((req, res, next) => {
      BooksService.getAllBooks(req.app.get('db'))
        .then(books => {
          res.json(books.map(BooksService.serializeBook))
        })
        .catch(next)
    })
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
      const {title, authors, description, categories} = req.body
      const newBook = {title, authors, description, categories}
  
      for (const [key, value] of Object.entries(newBook))
        if (value == null)
          return res.status(400).json({
            error: `Missing '${key}' in request body`
          })
  
      newBook.user_id = req.user.id
  
      BooksService.insertBook(
        req.app.get('db'),
        newBook
      )
        .then(book => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${book.id}`))
            .json(BooksService.serializeBook(book))
        })
        .catch(next)
      })

booksRouter
  .route('/:book_id')
  .all(requireAuth)
  .all(checkBookExists)
  .get((req, res) => {
    res.json(BooksService.serializeBook(res.book))
  })
  .delete((req, res, next) => {
    BooksService.deleteBook(
      req.app.get('db'),
      req.params.book_id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

booksRouter
  .route('/:book_id/notes/')
  .all(requireAuth)
  .all(checkBookExists)
  .get((req, res, next) => {
    BooksService.getNotesForBook(
      req.app.get('db'),
      req.params.book_id
    )
      .then(notes => {
        res.json(notes.map(BooksService.serializeBookNote))
      })
      .catch(next)
  })

booksRouter
  .route('/:book_id/add-note/')
  .all(requireAuth)
  .all(checkBookExists)
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { book_id, note_name, content } = req.body
    const newNote = { book_id, note_name, content }

    for (const [key, value] of Object.entries(newNote))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    newNote.user_id = req.user.id

    BooksService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.book_id}`))
          .json(BooksService.serializeBookNote(note))
      })
      .catch(next)
    })

  booksRouter
  .route('/:book_id')
  .all(requireAuth)
  .all(checkBookExists)
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const {rating, borrowed} = req.body
    const bookToUpdate = {rating, borrowed}

    const numberOfValues = Object.values(bookToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'borrowed' or 'rating'`
        }
      })
    }

    BooksService.updateBook(
      req.app.get('db'),
      req.params.book_id,
      bookToUpdate
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
    })

  booksRouter
  .route('/:book_id/notes/:note_id')
  .all(requireAuth)
  .all(checkNoteExists)
  .get((req, res, next) => {
    BooksService.getNoteById(
      req.app.get('db'),
      req.params.note_id
    )
      .then(notes => {
        res.json(notes.map(BooksService.serializeBookNote))
      })
      .catch(next)
  })

  booksRouter
  .route('/:book_id/notes/:note_id')
  .all(requireAuth)
  .all(checkNoteExists)
  .delete((req, res, next) => {
    BooksService.deleteNote(
      req.app.get('db'),
      req.params.note_id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

//Confirm that books and notes exist before they are acted upon
async function checkBookExists(req, res, next) {
  try {
    const book = await BooksService.getById(
      req.app.get('db'),
      req.params.book_id
    )

    if (!book)
      return res.status(404).json({
        error: `Book doesn't exist`
      })

    res.book = book
    next()
  } catch (error) {
    next(error)
  }
}

async function checkNoteExists(req, res, next) {
  try {
    const note = await BooksService.getNoteById(
      req.app.get('db'),
      req.params.note_id
    )

    if (!note)
      return res.status(404).json({
        error: `Note doesn't exist`
      })

    res.note = note
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = booksRouter
