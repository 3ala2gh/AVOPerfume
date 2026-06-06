import { useState } from 'react'
import {
  DEFAULT_PERFUME_SIZE,
  type Perfume,
} from '../components/home/catalogData'
import type { PerfumeSize } from '../types/product'

export function usePerfumeModal() {
  const [activePerfume, setActivePerfume] = useState<Perfume | null>(null)
  const [selectedSize, setSelectedSize] = useState<PerfumeSize>(DEFAULT_PERFUME_SIZE)

  function openPerfume(perfume: Perfume) {
    setSelectedSize(DEFAULT_PERFUME_SIZE)
    setActivePerfume(perfume)
  }

  function closePerfume() {
    setActivePerfume(null)
  }

  return {
    activePerfume,
    selectedSize,
    setSelectedSize,
    openPerfume,
    closePerfume,
  }
}
