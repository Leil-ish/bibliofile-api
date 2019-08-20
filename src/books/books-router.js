const express = require('express')
const BooksService = require('./books-service')
const { requireAuth } = require('../middleware/jwt-auth')

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

booksRouter
  .route('/:libraryId')
  .all(requireAuth)
  .all(checkBookExists)
  .get((req, res) => {
    res.json(BooksService.serializeBook(res.book))
  })

booksRouter.route('/:libraryId/comments/')
  .all(requireAuth)
  .all(checkBookExists)
  .get((req, res, next) => {
    BooksService.getCommentsForBook(
      req.app.get('db'),
      req.params.libraryId
    )
      .then(comments => {
        res.json(comments.map(BooksService.serializeBookComment))
      })
      .catch(next)
  })

async function checkBookExists(req, res, next) {
  try {
    const book = await BooksService.getById(
      req.app.get('db'),
      req.params.libraryId
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

module.exports = booksRouter
