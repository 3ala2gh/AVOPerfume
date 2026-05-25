export default function StayConnectedSection() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h3 className="mb-4 text-2xl tracking-wider sm:text-3xl">STAY CONNECTED</h3>
        <p className="mb-8 text-base opacity-70 sm:text-lg">
          Subscribe to receive exclusive offers and new collection updates
        </p>
        <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 border border-black/20 px-4 py-3 focus:border-black focus:outline-none"
          />
          <button
            type="button"
            className="bg-black px-8 py-3 text-white transition-colors hover:bg-black/80"
          >
            SUBSCRIBE
          </button>
        </div>
      </div>
    </section>
  )
}
