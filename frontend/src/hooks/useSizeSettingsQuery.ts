import { useQuery } from '@tanstack/react-query'
import { getSizeSettings } from '../api/admin.api'

export function useSizeSettingsQuery() {
  return useQuery({
    queryKey: ['size-settings'],
    queryFn: getSizeSettings,
  })
}
