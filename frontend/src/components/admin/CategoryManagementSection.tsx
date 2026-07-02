import { useState, type FormEvent } from 'react'
import Button from '../common/ui/Button'
import Input from '../common/ui/Input'
import type { Category, CategoryInput } from '../../types/product'
import { useI18n } from '../../hooks/useI18n'
import AdminCollapsibleSection from './AdminCollapsibleSection'

type CategoryManagementSectionProps = {
  categories: Category[]
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  onCreate: (payload: CategoryInput) => Promise<void>
  onUpdate: (id: number, payload: CategoryInput) => Promise<void>
  onDelete: (category: Category) => Promise<void>
}

const EMPTY_CATEGORY: CategoryInput = { name: '', nameAr: '' }

export default function CategoryManagementSection({
  categories,
  isLoading,
  isCreating,
  isUpdating,
  isDeleting,
  onCreate,
  onUpdate,
  onDelete,
}: CategoryManagementSectionProps) {
  const { t } = useI18n()
  const [newCategory, setNewCategory] = useState<CategoryInput>(EMPTY_CATEGORY)
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [editedCategory, setEditedCategory] = useState<CategoryInput>(EMPTY_CATEGORY)
  const [error, setError] = useState('')

  function validateCategory(category: CategoryInput): CategoryInput | null {
    const normalizedCategory = {
      name: category.name.trim(),
      nameAr: category.nameAr.trim(),
    }

    if (!normalizedCategory.name || !normalizedCategory.nameAr) {
      setError(t('admin.categoryNamesRequired'))
      return null
    }

    return normalizedCategory
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const category = validateCategory(newCategory)
    if (!category) return

    try {
      await onCreate(category)
      setNewCategory(EMPTY_CATEGORY)
    } catch {
      setError(t('admin.categorySaveError'))
    }
  }

  function startEditing(category: Category) {
    setError('')
    setEditingCategoryId(category.id)
    setEditedCategory({ name: category.name, nameAr: category.nameAr })
  }

  async function handleUpdate(categoryId: number) {
    setError('')
    const category = validateCategory(editedCategory)
    if (!category) return

    try {
      await onUpdate(categoryId, category)
      setEditingCategoryId(null)
    } catch {
      setError(t('admin.categorySaveError'))
    }
  }

  async function handleDelete(category: Category) {
    setError('')
    try {
      await onDelete(category)
    } catch {
      setError(t('admin.categoryDeleteInUse'))
    }
  }

  return (
    <AdminCollapsibleSection
      title={t('admin.manageCategories')}
      description="Add, rename, and clean up the collections used across the store."
    >
      <div className="space-y-4">
        <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
          <Input
            value={newCategory.name}
            onChange={(event) =>
              setNewCategory((current) => ({ ...current, name: event.target.value }))
            }
            placeholder={t('admin.categoryNameEnglish')}
            aria-label={t('admin.categoryNameEnglish')}
          />
          <Input
            value={newCategory.nameAr}
            onChange={(event) =>
              setNewCategory((current) => ({ ...current, nameAr: event.target.value }))
            }
            placeholder={t('admin.categoryNameArabic')}
            aria-label={t('admin.categoryNameArabic')}
            dir="rtl"
          />
          <Button type="submit" disabled={isCreating} className="sm:col-span-2">
            {isCreating ? t('admin.adding') : t('admin.addCategory')}
          </Button>
        </form>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {isLoading ? <p className="text-sm text-black/60">{t('admin.loadingCategories')}</p> : null}

        <div className="max-h-72 space-y-2 overflow-y-auto">
          {categories.map((category) => {
            const isEditing = editingCategoryId === category.id

            return (
              <div key={category.id} className="rounded-md border border-black/10 bg-white/80 p-3">
                {isEditing ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      value={editedCategory.name}
                      onChange={(event) =>
                        setEditedCategory((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      aria-label={t('admin.categoryNameEnglish')}
                    />
                    <Input
                      value={editedCategory.nameAr}
                      onChange={(event) =>
                        setEditedCategory((current) => ({
                          ...current,
                          nameAr: event.target.value,
                        }))
                      }
                      aria-label={t('admin.categoryNameArabic')}
                      dir="rtl"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-black/60" dir="rtl">
                        {category.nameAr}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        onClick={() => void handleUpdate(category.id)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? t('admin.saving') : t('admin.saveChanges')}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingCategoryId(null)}
                      >
                        {t('common.cancel')}
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => startEditing(category)}
                    >
                      {t('admin.editCategory')}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="danger"
                    disabled={isDeleting}
                    onClick={() => void handleDelete(category)}
                  >
                    {isDeleting ? t('admin.deleting') : t('admin.deleteCategory')}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AdminCollapsibleSection>
  )
}
