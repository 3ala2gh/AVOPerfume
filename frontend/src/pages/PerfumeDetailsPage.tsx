import { Link, useParams } from 'react-router-dom'
import { findPerfumeBySlug } from '../components/home/catalogData'

function PerfumeDetailsPage() {
  const { slug = '' } = useParams()
  const perfume = findPerfumeBySlug(slug)

  if (!perfume) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl tracking-wide">Perfume Not Found</h1>
        <p className="mb-6 opacity-70">We could not find a perfume with this name.</p>
        <Link to="/" className="border border-black px-6 py-3 transition-all hover:bg-black hover:text-white">
          Back to Home
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
          <img src={perfume.image} alt={perfume.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="mb-3 text-sm tracking-[0.2em] opacity-50">{perfume.category}</p>
          <h1 className="mb-4 text-3xl tracking-wide sm:text-4xl">{perfume.name}</h1>
          <p className="mb-6 text-base opacity-80 sm:text-lg">{perfume.description}</p>
          <p className="mb-8 text-2xl sm:text-3xl">${perfume.price}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="w-full border border-black px-6 py-3 transition-all hover:bg-black hover:text-white sm:w-auto"
            >
              Add to Cart
            </button>
            <Link
              to="/#products"
              className="w-full border border-black px-6 py-3 text-center transition-all hover:bg-black hover:text-white sm:w-auto"
            >
              Browse More
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PerfumeDetailsPage
