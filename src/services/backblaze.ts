import axios from 'axios'
import { z } from 'zod'

export const AuthResponse = z.object({
  authorizationToken: z.string(),
  apiUrl: z.string(),
})

export type AuthResponse = z.infer<typeof AuthResponse>

export const GetUploadUrlResponse = z.object({
  uploadUrl: z.string(),
  authorizationToken: z.string(),
})

export type GetUploadUrlResponse = z.infer<typeof GetUploadUrlResponse>

export const UploadFileResponse = z.object({
  fileId: z.string(),
  fileName: z.string(),
})

export type UploadFileResponse = z.infer<typeof UploadFileResponse>

export const getAuthResponse = async (applicationKeyId: string, applicationKey: string): Promise<AuthResponse> => {
  const authResponse = await fetch('https://api.backblazeb2.com/b2api/v3/b2_authorize_account', {
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + btoa(applicationKeyId + ':' + applicationKey),
    },
  })

  const data = await authResponse.json()

  return AuthResponse.parse(data)
}

export const getUploadUrl = async (authResponse: AuthResponse, bucketId: string): Promise<GetUploadUrlResponse> => {
  const urlResponse = await fetch(
    authResponse.apiUrl + '/b2api/v3/b2_get_upload_url?' + new URLSearchParams({ bucketId }).toString(),
    {
      method: 'GET',
      headers: {
        Authorization: authResponse.authorizationToken,
      },
    },
  )

  const data = await urlResponse.json()

  return GetUploadUrlResponse.parse(data)
}

export const uploadFile = async (uploadUrl: GetUploadUrlResponse, file: File): Promise<UploadFileResponse> => {
  const fileContents = await file.arrayBuffer()
  const sha1 = await getSha1(fileContents)
  const uploadResponse = await axios.post(uploadUrl.uploadUrl, fileContents, {
    headers: {
      Authorization: uploadUrl.authorizationToken,
      'Content-Type': 'b2/x-auto',
      'X-Bz-File-Name': encodeURI(file.name),
      'X-Bz-Content-Sha1': sha1,
    },
  })
  return UploadFileResponse.parse(uploadResponse.data)
}

async function getSha1(buffer: ArrayBuffer) {
  const hash = await crypto.subtle.digest('SHA-1', buffer)
  return Array.from(new Uint8Array(hash))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')
}
