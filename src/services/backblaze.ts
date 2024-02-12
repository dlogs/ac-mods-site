import axios from 'axios'

export interface AuthResponse {
  authorizationToken: string
  apiUrl: string
}

export interface GetUploadUrlResponse {
  uploadUrl: string
  authorizationToken: string
}

export interface UploadFileResponse {
  fileId: string
  fileName: string
}

export const getAuthResponse = async (applicationKeyId: string, applicationKey: string): Promise<AuthResponse> => {
  const authResponse = await axios.get<AuthResponse>('https://api.backblazeb2.com/b2api/v3/b2_authorize_account', {
    auth: {
      username: applicationKeyId,
      password: applicationKey,
    },
  })

  return authResponse.data
}

export const getUploadUrl = async (authResponse: AuthResponse, bucketId: string): Promise<GetUploadUrlResponse> => {
  const urlResponse = await axios.get<GetUploadUrlResponse>(authResponse.apiUrl + '/b2api/v3/b2_get_upload_url', {
    headers: {
      Authorization: authResponse.authorizationToken,
    },
    params: {
      bucketId,
    },
  })

  return {
    uploadUrl: urlResponse.data.uploadUrl,
    authorizationToken: urlResponse.data.authorizationToken,
  }
}

export const uploadFile = async (uploadUrl: GetUploadUrlResponse, file: File): Promise<UploadFileResponse> => {
  const fileContents = await file.arrayBuffer()
  const sha1 = await getSha1(fileContents)
  const uploadResponse = await axios.post(uploadUrl.uploadUrl, fileContents, {
    headers: {
      Authorization: uploadUrl.authorizationToken,
      'Content-Type': 'b2/x-auto',
      'X-Bz-Content-Sha1': sha1,
    },
  })
  return uploadResponse.data
}

async function getSha1(buffer: ArrayBuffer) {
  const hash = await crypto.subtle.digest('SHA-1', buffer)
  return Array.from(new Uint8Array(hash))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')
}
