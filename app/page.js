import { Suspense } from "react"
import Hero from "./components/hero"
import { FeaturedProducts } from "./components/featured-produts"
import ProductCardSkeleton from "./components/ProductCardSkeleton"
import CategorySection from "./components/category-section"
import Header from "./components/header"
export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <main>
          <Hero />
          <CategorySection />
          <Suspense fallback={<ProductCardSkeleton/>}>
            <FeaturedProducts />
          </Suspense>
        </main>
      </div>
    </>
  )
}

