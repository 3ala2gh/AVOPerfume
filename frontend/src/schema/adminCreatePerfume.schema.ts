import { z } from 'zod'

export const adminCreatePerfumeSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  gender: z.enum(['male', 'female', 'unisex'], {
    message: 'Gender is required',
  }),
  categoryId: z.number().int().gt(0, 'Category is required'),
  price30Ml: z.number().gt(0, '30ml price must be greater than 0'),
  price55Ml: z.number().gt(0, '55ml price must be greater than 0'),
  price100Ml: z.number().gt(0, '100ml price must be greater than 0'),
  description: z.string().trim(),
  image: z
    .custom<FileList>((value) => value instanceof FileList, 'Image is required')
    .refine((files) => files.length > 0, 'Image is required')
    .refine((files) => files[0]?.type.startsWith('image/') ?? false, 'Only image files are allowed'),
})

export type AdminCreatePerfumePayload = z.infer<typeof adminCreatePerfumeSchema>
