import { UploadedContent } from '../../types/UploadedContent'
import { z } from 'zod'

export const QueryResponse = z.object({
  file_id: z.string(),
  category: z.string(),
  name: z.string(),
  ac_id: z.string(),
  version: z.string(),
  uploaded_at: z.number(),
  download_url: z.string(),
  uploaded_by_email: z.string().nullable(),
  uploaded_by_display_name: z.string().nullable(),
})

export type QueryResponse = z.infer<typeof QueryResponse>

const sql = `
SELECT
  uploads.file_id,
  uploads.category,
  uploads.name,
  uploads.ac_id,
  uploads.version,
  uploads.download_url,
  uploads.uploaded_at,
  users.email as uploaded_by_email,
  users.display_name as uploaded_by_display_name
FROM uploads
LEFT JOIN users ON uploads.uploaded_by_id = users.id
`

export const onRequestGet: PagesFunction<Env> = async ({ env }): Promise<Response> => {
  const uploadQueryResult = await env.DB.prepare(sql).all()

  if (!uploadQueryResult.success) {
    throw new Error('Error fetching uploads')
  }

  const parsedResults = z.array(QueryResponse).parse(uploadQueryResult.results)
  const rows: UploadedContent[] = parsedResults.map((row) => ({
    fileId: row.file_id,
    category: row.category,
    name: row.name,
    acId: row.ac_id,
    version: row.version,
    uploadedAt: new Date(row.uploaded_at),
    uploadedBy: row.uploaded_by_display_name || row.uploaded_by_email || 'Dave',
    url: row.download_url,
    size: 0,
  }))
  return new Response(JSON.stringify(rows))
}
