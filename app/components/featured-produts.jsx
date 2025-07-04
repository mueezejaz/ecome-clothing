import { ProductCard } from "./product-card"
import axiosInstance from "../config/axios"
async function FeaturedProducts() {
  let featuredProducts;
  try {
    const response = await axiosInstance.get(`api/products/featured`);
    if (response.data?.data) {
      featuredProducts = response.data.data;
    }
    console.log(featuredProducts)
  } catch (error) {
    console.log("error whilte getting product", error)
    let errorMessage = error.response?.data?.message || "faild to get product report the problem";
    return (<h1>{errorMessage}</h1>)
  }
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Collection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked pieces that define contemporary elegance and timeless style
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <div
              key={product._id}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export { FeaturedProducts }