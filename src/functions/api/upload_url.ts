import { stringify } from 'superjson'
import { getAuthResponse, getUploadUrl } from '../../services/backblaze'
import { z } from 'zod'

export const onRequestGet: PagesFunction<Env> = async ({ env }): Promise<Response> => {
  const bucketId = await env.KV.get('bucket_id')
  const applicationKeyId = await env.KV.get('application_key_id')
  const applicationKey = await env.KV.get('application_key')
  if (!bucketId || !applicationKeyId || !applicationKey) {
    throw new Error('Missing required key value')
  }

  try {
    const authResponse = await getAuthResponse(applicationKeyId, applicationKey)

    const uploadUrl = await getUploadUrl(authResponse, bucketId)

    return new Response(stringify(uploadUrl))
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error)
    }
    throw error
  }
}
