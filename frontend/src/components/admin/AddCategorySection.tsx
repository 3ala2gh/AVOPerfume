import { type FormEvent, useState } from 'react'
import Button from '../common/ui/Button'
import Input from '../common/ui/Input'
import { useI18n } from '../../i18n'

type AddCategorySectionProps = {
  isAddingCategory: boolean
  onCreateCategory: (name: string) => Promise<void>
}

export default function AddCategorySection({
  isAddingCategory,
  onCreateCategory,
}: AddCategorySectionProps) {
  const { t } = useI18n()
  const [newCategoryName, setNewCategoryName] = useState('')
  const [categorySuccess, setCategorySuccess] = useState('')
  const [categoryError, setCategoryError] = useState('')

  async function handleCreateCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCategoryError('')
    setCategorySuccess('')

    const normalizedName = newCategoryName.trim()
    if (!normalizedName) {
      setCategoryError(t('admin.categoryRequired'))
      return
    }

    try {
      await onCreateCategory(normalizedName)
      setCategorySuccess(t('admin.addCategory'))
      setNewCategoryName('')
    } catch {
      setCategoryError(t('admin.createError'))
    }
  }

  return (
    <form
      onSubmit={handleCreateCategory}
      className="space-y-3 rounded-xl border border-black/10 bg-white/90 p-4 sm:p-5 lg:p-6"
    >
      <h2 className="text-base font-semibold sm:text-lg">{t('admin.addCategory')}</h2>
      <div className="space-y-2">
        <label htmlFor="category-name" className="block text-sm font-medium">
          {t('admin.categoryName')}
        </label>
        <Input
          id="category-name"
          value={newCategoryName}
          onChange={(event) => setNewCategoryName(event.target.value)}
        />
      </div>
      {categoryError && <p className="text-sm text-red-600">{categoryError}</p>}
      {categorySuccess && <p className="text-sm text-green-700">{categorySuccess}</p>}
      <Button
        type="submit"
        disabled={isAddingCategory}
        className="w-full sm:w-auto"
      >
        {isAddingCategory ? t('admin.adding') : t('admin.addCategory')}
      </Button>
    </form>
  )
}
