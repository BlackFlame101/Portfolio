import Database from 'better-sqlite3'

const databasePath = process.env.SQLITE_PATH ?? './guestbook.sqlite'
const database = new Database(databasePath)
database.pragma('journal_mode = WAL')
database.exec(`
  CREATE TABLE IF NOT EXISTS guestbook_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 40),
    note TEXT NOT NULL CHECK(length(note) BETWEEN 1 AND 280),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  )
`)
database.close()
console.log(`SQLite guestbook ready at ${databasePath}`)
