export type Perfume = {
  name: string
  price: number
  description: string
  category: 'Floral' | 'Woody' | 'Oriental' | 'Fresh'
  image: string
}

export const perfumes: Perfume[] = [
  {
    name: 'Midnight Elegance',
    price: 189,
    description: 'A sophisticated blend of dark florals and woods',
    category: 'Oriental',
    image:
      'https://images.unsplash.com/photo-1650270247263-be30a414cb3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: 'Pure Essence',
    price: 165,
    description: 'Delicate notes of white flowers and citrus',
    category: 'Fresh',
    image:
      'https://images.unsplash.com/photo-1640869116016-93c00ba94b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: 'Noir Collection',
    price: 210,
    description: 'Intense and mysterious fragrance',
    category: 'Oriental',
    image:
      'https://images.unsplash.com/photo-1610245182596-a7ad35b1e463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: 'Crystal Dreams',
    price: 175,
    description: 'Fresh and luminous scent',
    category: 'Fresh',
    image:
      'https://images.unsplash.com/photo-1632495112970-30ce8340c2be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: 'Velvet Rose',
    price: 195,
    description: 'Luxurious rose and amber blend',
    category: 'Floral',
    image:
      'https://images.unsplash.com/photo-1653885546835-94cc964f7c02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: 'Signature Edition',
    price: 225,
    description: 'Our most exclusive fragrance',
    category: 'Oriental',
    image:
      'https://images.unsplash.com/photo-1647507653704-bde7f2d6dbf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: 'Ocean Breeze',
    price: 155,
    description: 'Aquatic notes with sea salt',
    category: 'Fresh',
    image:
      'https://images.unsplash.com/photo-1643797517714-a273548abc3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: 'Sandalwood Dreams',
    price: 198,
    description: 'Rich sandalwood and cedar',
    category: 'Woody',
    image:
      'https://images.unsplash.com/photo-1610245169249-c7fbf6768884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
  {
    name: 'White Jasmine',
    price: 172,
    description: 'Pure jasmine essence',
    category: 'Floral',
    image:
      'https://images.unsplash.com/photo-1694179023466-cb438ce7ae0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  },
]

export const categoryOrder = ['All', 'Floral', 'Woody', 'Oriental', 'Fresh'] as const
export type CategoryName = (typeof categoryOrder)[number]

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function perfumeToSlug(name: string): string {
  return normalize(name).replace(/[^a-z0-9]+/g, '-')
}

export function findPerfumeBySlug(slug: string): Perfume | undefined {
  return perfumes.find((perfume) => perfumeToSlug(perfume.name) === slug)
}

export function findPerfumeByQuery(query: string): Perfume | undefined {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) {
    return undefined
  }

  return (
    perfumes.find((perfume) => normalize(perfume.name) === normalizedQuery) ??
    perfumes.find((perfume) => normalize(perfume.name).includes(normalizedQuery))
  )
}
