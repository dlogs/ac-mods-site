import axios from 'axios'
import UploadedContent from '../types/UploadedContent'
import { uploadFile } from './backblaze'

export const getUploadedMods = async (): Promise<UploadedContent[]> => {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  const uploadsResponse = await axios.get('/api/uploads')
  return await uploadsResponse.data
}

export const uploadMod = async (file: File, category: string, name: string, id: string, version: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  const uploadUrlResponse = await axios.get('/api/upload_url')
  const uploadUrl = uploadUrlResponse.data
  const uploadResult = await uploadFile(uploadUrl, file)
  await axios.post('/api/upload', {
    fileId: uploadResult.fileId,
    category,
    name,
    acId: id,
    version,
    downloadUrl: uploadResult.fileName,
  })
}
