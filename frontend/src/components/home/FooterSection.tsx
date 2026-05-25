export default function FooterSection() {
  return (
    <footer className="bg-black py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <h5 className="mb-4 text-xl tracking-wider">AVO PERFUMES</h5>
            <p className="text-sm opacity-60">
              Luxury fragrances crafted with passion and precision
            </p>
          </div>

          <div>
            <h6 className="mb-4 tracking-wide">SHOP</h6>
            <ul className="space-y-2 text-sm opacity-60">
              <li>
                <a href="#products" className="transition-opacity hover:opacity-100">
                  All Products
                </a>
              </li>
              <li>
                <a href="#categories" className="transition-opacity hover:opacity-100">
                  Collections
                </a>
              </li>
              <li>
                <a href="#" className="transition-opacity hover:opacity-100">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="transition-opacity hover:opacity-100">
                  Best Sellers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="mb-4 tracking-wide">SUPPORT</h6>
            <ul className="space-y-2 text-sm opacity-60">
              <li>
                <a href="#" className="transition-opacity hover:opacity-100">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="transition-opacity hover:opacity-100">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="transition-opacity hover:opacity-100">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="transition-opacity hover:opacity-100">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="mb-4 tracking-wide">FOLLOW US</h6>
            <ul className="space-y-2 text-sm opacity-60">
              <li>
                <a href="#" className="transition-opacity hover:opacity-100">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="transition-opacity hover:opacity-100">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="transition-opacity hover:opacity-100">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="transition-opacity hover:opacity-100">
                  Pinterest
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm opacity-60">
          <p>© 2026 AVO PERFUMES. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
