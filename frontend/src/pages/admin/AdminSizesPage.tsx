import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import SizeAvailabilitySection from '../../components/admin/SizeAvailabilitySection'
import type { SizeSettings } from '../../api/admin.api'
import { useSizeSettingsQuery } from '../../hooks/useSizeSettingsQuery'
import { useUpdateSizeSettingsMutation } from '../../hooks/useUpdateSizeSettingsMutation'
import { useI18n } from '../../hooks/useI18n'

function AdminSizesPage() {
  const queryClient = useQueryClient()
  const { t } = useI18n()
  const { data: sizeSettings, isLoading } = useSizeSettingsQuery()
  const { mutateAsync: updateSizeSettings, isPending } = useUpdateSizeSettingsMutation()

  async function handleSave(settings: SizeSettings) {
    await updateSizeSettings(settings)
    await queryClient.invalidateQueries({ queryKey: ['size-settings'] })
    await queryClient.invalidateQueries({ queryKey: ['products'] })
    toast.success(t('admin.sizeAvailabilityUpdated'))
  }

  return (
    <SizeAvailabilitySection
      key={sizeSettings ? 'loaded' : 'loading'}
      settings={sizeSettings}
      isLoading={isLoading}
      isSaving={isPending}
      onSave={handleSave}
    />
  )
}

export default AdminSizesPage
