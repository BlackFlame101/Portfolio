import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import { rateLimit } from 'express-rate-limit'

const port = Number(process.env.PORT ?? 3000)
const databasePath = process.env.SQLITE_PATH ?? './guestbook.sqlite'
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '').split(',').map((origin) => origin.trim()).filter(Boolean)
const database = new Database(databasePath)
const webOrigin = process.env.WEB_ORIGIN
database.pragma('journal_mode = WAL')
database.exec(`
  CREATE TABLE IF NOT EXISTS guestbook_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 40),
    note TEXT NOT NULL CHECK(length(note) BETWEEN 1 AND 280),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )
`)

const app = express()
app.disable('x-powered-by')
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : webOrigin || false }))
app.use(express.json({ limit: '4kb' }))

const writeLimit = rateLimit({ windowMs: 60_000, limit: 5, standardHeaders: true, legacyHeaders: false })
const getNotes = database.prepare('SELECT id, name, note, created_at FROM guestbook_notes ORDER BY id DESC LIMIT 100')
const addNote = database.prepare('INSERT INTO guestbook_notes (name, note) VALUES (?, ?)')
const findNote = database.prepare('SELECT id, name, note, created_at FROM guestbook_notes WHERE id = ?')

app.get('/api/health', (_request, response) => response.json({ ok: true }))
app.get('/api/notes', (_request, response) => response.json(getNotes.all()))
app.post('/api/notes', writeLimit, (request, response) => {
  const name = typeof request.body?.name === 'string' ? request.body.name.trim().slice(0, 40) : ''
  const note = typeof request.body?.note === 'string' ? request.body.note.trim().slice(0, 280) : ''
  if (!name || !note) return response.status(400).json({ error: 'Name and note are required.' })
  const result = addNote.run(name, note)
  return response.status(201).json(findNote.get(result.lastInsertRowid))
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Guestbook API listening on port ${port}`)
})
