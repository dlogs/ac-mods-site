import UploadedContent from '../../types/UploadedContent'

interface QueryResponse {
  file_id: string
  category: string
  name: string
  ac_id: string
  version: string
  uploaded_at: number
  download_url: string
  uploaded_by_email: string | null
  uploaded_by_display_name: string | null
}

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
  const uploadQueryResult = await env.DB.prepare(sql).all<QueryResponse>()

  if (!uploadQueryResult.success) {
    throw new Error('Error fetching uploads')
  }
  const rows: UploadedContent[] = uploadQueryResult.results.map((row) => ({
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
