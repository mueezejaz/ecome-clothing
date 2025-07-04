"use server"
import React from "react"

function ProductCardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="relative">
            <div className="w-full h-80 bg-gray-200" />
          </div>

          <div className="p-6">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="h-6 w-24 bg-gray-300 rounded"></div>
              </div>
              <div className="flex space-x-1">
                <div className="w-4 h-4 bg-gray-300 rounded-full border border-gray-400" />
                <div className="w-4 h-4 bg-gray-300 rounded-full border border-gray-400" />
                <div className="w-4 h-4 bg-gray-300 rounded-full border border-gray-400" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductCardSkeleton
