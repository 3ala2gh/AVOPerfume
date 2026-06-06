import { useMemo, useState } from 'react'
import type { Perfume } from '../components/home/catalogData'

export type ShopSortOption = 'name' | 'price-low' | 'price-high'
export type ShopGenderFilter = 'all' | Perfume['gender']

const DEFAULT_CATEGORY = 'All'
const DEFAULT_GENDER: ShopGenderFilter = 'all'
const DEFAULT_SORT: ShopSortOption = 'name'

type ShopFilters = {
  search: string
  category: string
  gender: ShopGenderFilter
  sort: ShopSortOption
}

function matchesSearch(perfume: Perfume, search: string): boolean {
  if (!search) {
    return true
  }

  const searchableText = [
    perfume.name,
    perfume.description,
    perfume.category,
    perfume.gender,
  ]
    .join(' ')
    .toLowerCase()

  return searchableText.includes(search)
}

function sortPerfumes(perfumes: Perfume[], sort: ShopSortOption): Perfume[] {
  return [...perfumes].sort((first, second) => {
    switch (sort) {
      case 'price-low':
        return first.price - second.price
      case 'price-high':
        return second.price - first.price
      case 'name':
        return first.name.localeCompare(second.name)
    }
  })
}

function applyShopFilters(perfumes: Perfume[], filters: ShopFilters): Perfume[] {
  const normalizedSearch = filters.search.trim().toLowerCase()
  const filtered = perfumes.filter(
    (perfume) =>
      (filters.category === DEFAULT_CATEGORY ||
        perfume.category === filters.category) &&
      (filters.gender === DEFAULT_GENDER ||
        perfume.gender === filters.gender) &&
      matchesSearch(perfume, normalizedSearch),
  )

  return sortPerfumes(filtered, filters.sort)
}

export function useShopFilters(perfumes: Perfume[]) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(DEFAULT_CATEGORY)
  const [gender, setGender] = useState<ShopGenderFilter>(DEFAULT_GENDER)
  const [sort, setSort] = useState<ShopSortOption>(DEFAULT_SORT)

  const filteredPerfumes = useMemo(
    () => applyShopFilters(perfumes, { search, category, gender, sort }),
    [perfumes, search, category, gender, sort],
  )

  function resetFilters() {
    setSearch('')
    setCategory(DEFAULT_CATEGORY)
    setGender(DEFAULT_GENDER)
    setSort(DEFAULT_SORT)
  }

  return {
    search,
    setSearch,
    category,
    setCategory,
    gender,
    setGender,
    sort,
    setSort,
    filteredPerfumes,
    resetFilters,
  }
}
