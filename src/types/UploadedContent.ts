export default interface UploadedContent {
  fileId: string
  category: string
  name: string
  acId: string
  version: string
  uploadedBy: string
  uploadedAt: Date
  url: string
  size: number
}
