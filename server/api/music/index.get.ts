import { getDb } from '~~/server/utils/db'

export default defineEventHandler(() => {
  const db = getDb()
  const rows = db.prepare(`
    SELECT id, title, artist, filename, mime_type, size, created_at
    FROM music
    ORDER BY id ASC
  `).all()

  return rows
})
