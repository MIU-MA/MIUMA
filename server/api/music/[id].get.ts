import { getDb } from '~~/server/utils/db'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id || !Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid id' })
  }

  const db = getDb()
  const row = db.prepare('SELECT data, mime_type, filename FROM music WHERE id = ?').get(id) as
    | { data: Buffer; mime_type: string; filename: string }
    | undefined

  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Music not found' })
  }

  setHeader(event, 'Content-Type', row.mime_type)
  setHeader(event, 'Content-Length', row.data.length.toString())
  setHeader(event, 'Accept-Ranges', 'bytes')
  // filename 仅用扩展名，避免中文编码问题
  const ext = row.filename.includes('.') ? row.filename.split('.').pop() : 'mp3'
  setHeader(event, 'Content-Disposition', `inline; filename="audio.${ext}"`)

  return row.data
})
