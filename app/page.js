import Hero from "./components/hero"
import FeaturedProducts from "./components/featured-produts"
import { CartProvider } from "./context/cart-context"
export default function Home() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <main>
          <Hero />
          <FeaturedProducts/>
        </main>
      </div>
    </CartProvider>
  )
}

