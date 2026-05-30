import { type FormEvent, useState } from 'react'
import Button from '../common/ui/Button'
import Input from '../common/ui/Input'

type AddCategorySectionProps = {
  isAddingCategory: boolean
  onCreateCategory: (name: string) => Promise<void>
}

export default function AddCategorySection({
  isAddingCategory,
  onCreateCategory,
}: AddCategorySectionProps) {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [categorySuccess, setCategorySuccess] = useState('')
  const [categoryError, setCategoryError] = useState('')

  async function handleCreateCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCategoryError('')
    setCategorySuccess('')

    const normalizedName = newCategoryName.trim()
    if (!normalizedName) {
      setCategoryError('Category name is required.')
      return
    }

    try {
      await onCreateCategory(normalizedName)
      setCategorySuccess('Category added successfully.')
      setNewCategoryName('')
    } catch {
      setCategoryError('Unable to add category right now.')
    }
  }

  return (
    <form
      onSubmit={handleCreateCategory}
      className="space-y-3 rounded-xl border border-black/10 bg-white/90 p-4 sm:p-5 lg:p-6"
    >
      <h2 className="text-base font-semibold sm:text-lg">Add Category</h2>
      <div className="space-y-2">
        <label htmlFor="category-name" className="block text-sm font-medium">
          Category Name
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
        {isAddingCategory ? 'Adding...' : 'Add Category'}
      </Button>
    </form>
  )
}
