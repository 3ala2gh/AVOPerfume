import axios from 'axios'
import type { UseFormReset, UseFormSetError } from 'react-hook-form'
import { createProduct } from '../api/products.api'
import type { AdminCreatePerfumePayload } from '../schema/adminCreatePerfume.schema'

type UseAdminCreatePerfumeSubmitParams = {
  reset: UseFormReset<AdminCreatePerfumePayload>
  setError: UseFormSetError<AdminCreatePerfumePayload>
  setSuccess: (value: string) => void
}

export function useAdminCreatePerfumeSubmit({
  reset,
  setError,
  setSuccess,
}: UseAdminCreatePerfumeSubmitParams) {
  return async function onSubmit(values: AdminCreatePerfumePayload) {
    setSuccess('')

    const image = values.image.item(0)
    if (!image) {
      setError('image', { message: 'Image is required' })
      return
    }

    try {
      await createProduct({
        name: values.name.trim(),
        description: values.description.trim(),
        categoryId: values.categoryId,
        price: values.price,
        image,
      })

      setSuccess('Perfume created successfully.')
      reset()
    } catch (submitError) {
      if (axios.isAxiosError(submitError)) {
        const message =
          (submitError.response?.data as { message?: string } | undefined)
            ?.message ?? 'Unable to create perfume right now.'
        setError('root', { message })
        return
      }

      setError('root', {
        message: 'Unexpected error happened. Please try again.',
      })
    }
  }
}
