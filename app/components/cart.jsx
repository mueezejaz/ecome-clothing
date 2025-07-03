"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "../context/cart-context"

export default function Cart({ isOpen, onClose }) {
  const { items, updateQuantity ,itemCount, removeItem, total } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Shopping Cart</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <ShoppingBag className="w-16 h-16 mb-4" />
                    <p className="text-lg">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                        item.variants.map((variant) => (
                          <motion.div
                            key={variant._id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center space-x-4 p-4 border rounded-lg"
                          >
                            <img
                              src={variant.images[0]?.imageUrl || item.mainImage?.imageUrl || "./placeholder.png"}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-gray-600">
                                ${item.price}
                              </p>
                              <p className="ml-2 text-sm text-gray-500">Size: {variant.size}</p>
                              <p className="ml-2 text-sm text-gray-500">color:
                                <span
                                  className="inline-block w-3 h-3 rounded-full ml-2 align-middle"
                                  style={{ backgroundColor: variant.colorHex }}
                                  title={variant.colorHex}
                                ></span>
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-8 h-8"
                                onClick={() => updateQuantity(item._id , variant._id,itemCount(item._id , variant._id) - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center">{itemCount(item._id , variant._id)}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-8 h-8"
                                onClick={() => updateQuantity(item._id , variant._id,itemCount(item._id , variant._id) + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item._id, variant._id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))
                    ))}

                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                  </div>
                  <Button className="w-full bg-gray-900 hover:bg-gray-800">Checkout</Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
