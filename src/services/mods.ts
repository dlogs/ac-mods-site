import UploadedContent from '../types/UploadedContent'
import { uploadFile } from './backblaze'
import { useFunctions } from 'vite-plugin-cloudflare-functions/client'

export const getUploadedMods = async (): Promise<UploadedContent[]> => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const client = useFunctions()
  const uploads = await client.get('/api/uploads')
  return uploads
}

export const uploadMod = async (file: File, category: string, name: string, id: string, version: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const client = useFunctions()
  const uploadUrl = await client.get('/api/upload_url')
  const uploadResult = await uploadFile(uploadUrl, file)
  await client.post('/api/upload', {
    fileId: uploadResult.fileId,
    category,
    name,
    acId: id,
    version,
    downloadUrl: uploadResult.fileName,
  })
}
