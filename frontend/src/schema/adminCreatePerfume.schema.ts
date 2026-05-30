import { z } from 'zod'

export const adminCreatePerfumeSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  gender: z.enum(['male', 'female', 'unisex'], {
    message: 'Gender is required',
  }),
  categoryId: z.number().int().gt(0, 'Category is required'),
  price: z.number().gt(0, 'Price must be greater than 0'),
  description: z.string().trim(),
  image: z
    .custom<FileList>((value) => value instanceof FileList, 'Image is required')
    .refine((files) => files.length > 0, 'Image is required')
    .refine((files) => files[0]?.type.startsWith('image/') ?? false, 'Only image files are allowed'),
})

export type AdminCreatePerfumePayload = z.infer<typeof adminCreatePerfumeSchema>
