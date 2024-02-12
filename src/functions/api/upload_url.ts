import { makePagesFunction } from 'vite-plugin-cloudflare-functions/worker'
import { getAuthResponse, getUploadUrl } from '../../services/backblaze'

export const onRequestGet = makePagesFunction(async ({ env }) => {
  const bucketId = await env.KV.get('bucket_id')
  const applicationKeyId = await env.KV.get('application_key_id')
  const applicationKey = await env.KV.get('application_key')
  if (!bucketId || !applicationKeyId || !applicationKey) {
    throw new Error('Missing required key value')
  }

  const authResponse = await getAuthResponse(applicationKeyId, applicationKey)

  return getUploadUrl(authResponse, bucketId)
})
