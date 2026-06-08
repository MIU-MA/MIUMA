import { getDb } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const results: Array<{ id: number; title: string; filename: string; size: number }> = []

  const insert = getDb().prepare(`
    INSERT INTO music (title, artist, filename, mime_type, data, size)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  for (const part of formData) {
    if (!part.filename) continue

    const buffer = Buffer.from(part.data)
    const mimeType = part.type || 'audio/mpeg'
    const title = part.filename.replace(/\.[^.]+$/, '')

    try {
      const result = insert.run(title, '', part.filename, mimeType, buffer, buffer.length)
      results.push({
        id: Number(result.lastInsertRowid),
        title,
        filename: part.filename,
        size: buffer.length,
      })
    } catch {
      throw createError({ statusCode: 500, statusMessage: `Failed to save "${part.filename}"` })
    }
  }

  if (results.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid music files found in upload' })
  }

  return results
})
