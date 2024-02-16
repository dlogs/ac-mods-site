import { z } from 'zod'

export const UploadedContent = z.object({
  fileId: z.string(),
  category: z.string(),
  name: z.string(),
  acId: z.string(),
  version: z.string(),
  uploadedBy: z.string(),
  uploadedAt: z.date(),
  fileName: z.string(),
  size: z.number(),
})

export type UploadedContent = z.infer<typeof UploadedContent>
