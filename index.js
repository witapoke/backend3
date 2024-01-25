const express = require('express')
const logger = require('./loggerMiddleware')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.use(logger)

let notes = [
  {
    id: 1,
    content: 'Primera nota',
    date: new Date(),
    important: true
  },
  {
    id: 2,
    content: 'Segunda nota',
    date: new Date(),
    important: true
  },
  {
    id: 3,
    content: 'Tercera nota',
    date: new Date(),
    important: false
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find((note) => note.id == id)
  if (note) {
    return response.json(note)
  } else {
    return response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((note) => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note content is missing'
    })
  }

  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    date: new Date().toISOString(),
    important: note.important
  }

  notes = [...notes, newNote]
  response.json(newNote)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log('Server running on Port 3001')
})
