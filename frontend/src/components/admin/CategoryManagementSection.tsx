import { useState, type FormEvent } from 'react'
import { Check, CircleAlert, Pencil, Plus, Tags, Trash2 } from 'lucide-react'
import Input from '../common/ui/Input'
import type { Category, CategoryInput } from '../../types/product'
import { useI18n } from '../../hooks/useI18n'
import { cn } from '../../utils/cn'
import AdminButton from './AdminButton'
import AdminEmptyState, { AdminListSkeleton } from './AdminEmptyState'
import AdminField from './AdminField'
import AdminPanel from './AdminPanel'
import ConfirmDialog from './ConfirmDialog'

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
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

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

  async function confirmDelete() {
    if (!categoryToDelete) return
    setError('')
    try {
      await onDelete(categoryToDelete)
    } catch {
      setError(t('admin.categoryDeleteInUse'))
    } finally {
      setCategoryToDelete(null)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-6">
      <AdminPanel title={t('admin.addNewCategory')} className="h-fit lg:sticky lg:top-28">
        <form onSubmit={handleCreate} className="space-y-4">
          <AdminField label={t('admin.categoryNameEnglish')} htmlFor="new-category-name">
            <Input
              id="new-category-name"
              value={newCategory.name}
              onChange={(event) =>
                setNewCategory((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Oriental"
            />
          </AdminField>
          <AdminField label={t('admin.categoryNameArabic')} htmlFor="new-category-name-ar">
            <Input
              id="new-category-name-ar"
              value={newCategory.nameAr}
              onChange={(event) =>
                setNewCategory((current) => ({ ...current, nameAr: event.target.value }))
              }
              placeholder="شرقي"
              dir="rtl"
            />
          </AdminField>
          <AdminButton type="submit" icon={Plus} isLoading={isCreating} className="w-full">
            {isCreating ? t('admin.adding') : t('admin.addCategory')}
          </AdminButton>
        </form>
      </AdminPanel>

      <AdminPanel
        title={t('admin.yourCategories')}
        actions={
          <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-semibold text-ink/70">
            {categories.length}
          </span>
        }
      >
        {error ? (
          <p role="alert" className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            <CircleAlert className="h-4 w-4 shrink-0" />
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <AdminListSkeleton rows={4} />
        ) : categories.length === 0 ? (
          <AdminEmptyState icon={Tags} title={t('admin.noCategories')} />
        ) : (
          <ul className="space-y-2">
            {categories.map((category) => {
              const isEditing = editingCategoryId === category.id

              return (
                <li
                  key={category.id}
                  className={cn(
                    'rounded-xl border p-3 transition-colors sm:p-3.5',
                    isEditing ? 'border-champagne/50 bg-champagne/[0.04]' : 'border-ink/[0.08] bg-white',
                  )}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input
                          value={editedCategory.name}
                          onChange={(event) =>
                            setEditedCategory((current) => ({ ...current, name: event.target.value }))
                          }
                          aria-label={t('admin.categoryNameEnglish')}
                          autoFocus
                        />
                        <Input
                          value={editedCategory.nameAr}
                          onChange={(event) =>
                            setEditedCategory((current) => ({ ...current, nameAr: event.target.value }))
                          }
                          aria-label={t('admin.categoryNameArabic')}
                          dir="rtl"
                        />
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <AdminButton variant="outline" size="sm" onClick={() => setEditingCategoryId(null)}>
                          {t('common.cancel')}
                        </AdminButton>
                        <AdminButton
                          size="sm"
                          icon={Check}
                          isLoading={isUpdating}
                          onClick={() => void handleUpdate(category.id)}
                        >
                          {isUpdating ? t('admin.saving') : t('admin.saveChanges')}
                        </AdminButton>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{category.name}</p>
                        <p className="truncate text-sm text-ink-muted" dir="rtl">
                          {category.nameAr}
                        </p>
                      </div>
                      <AdminButton
                        variant="ghost"
                        size="sm"
                        icon={Pencil}
                        onClick={() => startEditing(category)}
                        aria-label={`${t('admin.editCategory')} ${category.name}`}
                      >
                        <span className="hidden sm:inline">{t('admin.editCategory')}</span>
                      </AdminButton>
                      <AdminButton
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        disabled={isDeleting}
                        onClick={() => setCategoryToDelete(category)}
                        aria-label={`${t('admin.deleteCategory')} ${category.name}`}
                        className="hover:!bg-red-50 hover:!text-red-600"
                      >
                        <span className="hidden sm:inline">{t('admin.deleteCategory')}</span>
                      </AdminButton>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </AdminPanel>

      <ConfirmDialog
        isOpen={categoryToDelete !== null}
        title={t('admin.deleteCategoryTitle')}
        message={categoryToDelete ? t('admin.deleteCategoryConfirm', { name: categoryToDelete.name }) : ''}
        isPending={isDeleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  )
}
