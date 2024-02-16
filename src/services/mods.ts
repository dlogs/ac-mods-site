import axios from 'axios'
import { UploadedContent } from '../types/UploadedContent'
import { uploadFile, GetUploadUrlResponse } from './backblaze'
import { parse, stringify } from 'superjson'
import { UploadModRequest } from '../functions/api/upload'

const client = axios.create({
  transformResponse: (data) => parse(data),
  transformRequest: (data) => stringify(data),
})

export const getUploadedMods = async (): Promise<UploadedContent[]> => {
  const uploadsResponse = await client.get('/api/uploads')
  return UploadedContent.array().parse(uploadsResponse.data)
}

export const uploadMod = async (file: File, category: string, name: string, id: string, version: string) => {
  const uploadUrlResponse = await client.get('/api/upload_url')
  const uploadUrl = GetUploadUrlResponse.parse(uploadUrlResponse.data)
  const uploadResult = await uploadFile(uploadUrl, file)
  await client.post('/api/upload', {
    fileId: uploadResult.fileId,
    category,
    name,
    acId: id,
    version,
    fileName: uploadResult.fileName,
  } as UploadModRequest)
}
