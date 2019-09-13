const express = require('express')
const path = require('path')
const NotesService = require('./notes-service')
const { requireAuth } = require('../middleware/jwt-auth')
const notesRouter = express.Router()
const jsonBodyParser = express.json()

notesRouter
  .route('/')
  .get((req, res, next) => {
    NotesService.getAllNotes(req.app.get('db'))
      .then(notes => {
        res.json(notes.map(NotesService.serializeNote))
      })
      .catch(next)
  })

module.exports = notesRouter
