const OFFERS_STORAGE_KEY = 'avo_offers_images'

export function getStoredOfferImages(): string[] {
  if (typeof window === 'undefined') {
    return []
  }

  const rawValue = window.localStorage.getItem(OFFERS_STORAGE_KEY)
  if (!rawValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown
    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue.filter((value): value is string => typeof value === 'string')
  } catch {
    return []
  }
}

export function setStoredOfferImages(images: string[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(images))
}
