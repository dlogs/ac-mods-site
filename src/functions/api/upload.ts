import { z } from 'zod'
import { parse } from 'superjson'

export const UploadModRequest = z.object({
  fileId: z.string(),
  category: z.string(),
  name: z.string(),
  acId: z.string(),
  version: z.string(),
  downloadUrl: z.string(),
})

export type UploadModRequest = z.infer<typeof UploadModRequest>

const sql = `
INSERT INTO uploads (
  file_id,
  category,
  name,
  ac_id,
  version,
  download_url,
  uploaded_at,
  uploaded_by_id
) values (?, ?, ?, ?, ?, ?, ?)
`

export const onRequestPost: PagesFunction<Env> = async ({ request, env }): Promise<Response> => {
  const body = UploadModRequest.parse(parse(await request.text()))
  await env.DB.prepare(sql).bind(
    body.fileId,
    body.category,
    body.name,
    body.acId,
    body.version,
    body.downloadUrl,
    Date.now(),
    null,
  )
  return new Response()
}
