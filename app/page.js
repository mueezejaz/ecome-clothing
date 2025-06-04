import Hero from "./components/hero"
import FeaturedProducts from "./components/featured-produts"
import { CartProvider } from "./context/cart-context"
import CategorySection from "./components/category-section"
import Header from "./components/header"
export default function Home() {
  return (
    <CartProvider>
     <Header/> 
      <div className="min-h-screen bg-white">
        <main>
          <Hero />
          <CategorySection/>
          <FeaturedProducts/>
        </main>
      </div>
    </CartProvider>
  )
}

