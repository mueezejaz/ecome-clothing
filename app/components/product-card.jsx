"use client"

import { motion } from "framer-motion"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "../context/cart-context"
import Link from "next/link"

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  return (
    <Link href={`/product/${product.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        <div className="relative overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            whileHover={{ scale: 1.05 }}
          />

          {product.sale && <Badge className="absolute top-4 left-4 bg-red-500 text-white">Sale</Badge>}

          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute inset-x-4 bottom-4"
          >
            <Button onClick={handleAddToCart} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </motion.div>
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3">{product.category}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {product.originalPrice && (
                <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
              )}
              <span className="text-xl font-bold text-gray-900">${product.price}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
