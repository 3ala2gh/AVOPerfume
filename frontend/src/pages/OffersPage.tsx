import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useOffersQuery } from '../hooks/useOffersQuery'

function OffersPage() {
  const { data: offers = [] } = useOffersQuery()
  const [activeIndex, setActiveIndex] = useState(0)

  function goNext() {
    setActiveIndex((currentIndex) => (currentIndex + 1) % offers.length)
  }

  function goPrevious() {
    setActiveIndex((currentIndex) => (currentIndex - 1 + offers.length) % offers.length)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <section className="bg-black py-14 text-white sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-3 text-3xl tracking-[0.18em] sm:text-4xl md:text-6xl">OFFERS</h1>
          <p className="text-sm tracking-wide opacity-90 sm:text-base lg:text-lg">
            Explore our latest deals
          </p>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        {offers.length === 0 ? (
          <div className="mx-auto w-full max-w-7xl">
            <p className="text-black/70">No offers yet. Please check again soon.</p>
          </div>
        ) : (
          <div className="relative mx-auto w-full max-w-[1500px] overflow-hidden bg-black/5 shadow-sm">
            <img
              src={offers[activeIndex]?.imageUrl}
              alt={`Offer ${activeIndex + 1}`}
              className="h-[56vh] w-full object-cover sm:h-[66vh] lg:h-[78vh] lg:object-contain"
            />

            {offers.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous offer"
                  onClick={goPrevious}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 p-2 text-white transition-colors hover:bg-black sm:left-5"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  aria-label="Next offer"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 p-2 text-white transition-colors hover:bg-black sm:right-5"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default OffersPage
