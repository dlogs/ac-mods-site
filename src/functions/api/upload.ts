import { z } from 'zod'
import { parse } from 'superjson'
import { TokenUser, getUser } from '../../services/auth'

export const UploadModRequest = z.object({
  fileId: z.string(),
  category: z.string(),
  name: z.string(),
  acId: z.string(),
  version: z.string(),
  fileName: z.string(),
})

export type UploadModRequest = z.infer<typeof UploadModRequest>

const insertUploadsSql = `
INSERT INTO uploads (
  file_id,
  category,
  name,
  ac_id,
  version,
  file_name,
  uploaded_at,
  uploaded_by_id
) values (?, ?, ?, ?, ?, ?, ?, ?)
`

export const onRequestPost: PagesFunction<Env> = async ({ request, env }): Promise<Response> => {
  const tokenUser = getUser(request)
  insertUserIfNeeded(env.DB, tokenUser)

  const body = UploadModRequest.parse(parse(await request.text()))
  await env.DB.prepare(insertUploadsSql)
    .bind(body.fileId, body.category, body.name, body.acId, body.version, body.fileName, Date.now(), tokenUser.sub)
    .run()
  return new Response()
}

const insertUserIfNeeded = async (db: D1Database, user: TokenUser): Promise<void> => {
  await db.prepare(insertUserSql).bind(user.sub, user.email, Date.now()).run()
}

const insertUserSql = `
INSERT OR IGNORE INTO users (
  id,
  email,
  created_at
) values (?, ?, ?)
`
