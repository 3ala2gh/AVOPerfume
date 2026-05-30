import { useMutation } from '@tanstack/react-query'
import { publishWebsite } from '../api/admin.api'

export function usePublishWebsiteMutation() {
  return useMutation({
    mutationFn: publishWebsite,
  })
}
