import React from "react"

function ProductCardSkeleton() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="h-12 bg-gray-200 rounded w-80 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer animate-pulse">
              <div className="relative overflow-hidden">
                <div className="w-full h-80 bg-gray-200" />
                {/* Sale badge skeleton */}
                <div className="absolute top-4 left-4 bg-gray-300 rounded-full px-2 py-1 w-12 h-6"></div>
              </div>

              <div className="p-6">
                {/* Product name skeleton */}
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                {/* Category skeleton */}
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* Original price skeleton */}
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    {/* Discount price skeleton */}
                    <div className="h-6 w-16 bg-gray-300 rounded"></div>
                  </div>
                  {/* Color variants skeleton */}
                  <div className="flex space-x-1">
                    <div className="w-4 h-4 bg-gray-300 rounded-full border border-gray-300" />
                    <div className="w-4 h-4 bg-gray-300 rounded-full border border-gray-300" />
                    <div className="w-4 h-4 bg-gray-300 rounded-full border border-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductCardSkeleton
