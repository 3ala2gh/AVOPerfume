import { createContext } from 'react'

export type Language = 'en' | 'ar'
export type TranslationValues = Record<string, string | number>

export type I18nContextValue = {
  language: Language
  direction: 'ltr' | 'rtl'
  isArabic: boolean
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
  t: (key: string, values?: TranslationValues) => string
  categoryLabel: (category: string, categoryAr?: string) => string
  genderLabel: (gender: string) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)
