import { useMutation } from '@tanstack/react-query'
import { updateSizeSettings } from '../api/admin.api'

export function useUpdateSizeSettingsMutation() {
  return useMutation({ mutationFn: updateSizeSettings })
}
