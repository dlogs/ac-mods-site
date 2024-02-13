export interface UploadModRequest {
  fileId: string
  category: string
  name: string
  acId: string
  version: string
  downloadUrl: string
}

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
  const body = (await request.json()) as UploadModRequest
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
