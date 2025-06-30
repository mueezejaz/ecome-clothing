"use client"

import { createContext, useContext, useState } from "react"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = (product, selectedVariant = null, selectedSize = null, quantity = 1) => {
    setItems((prev) => {
      // Create a unique identifier for the cart item including variant and size
      const itemId = product._id; 

      const existing = prev.find((item) => item.itemId === itemId)

      if (existing) {
        return prev.map((item) => (item.itemId === itemId ? { ...item, quantity: item.quantity + quantity } : item))
      }

      return [
        ...prev,
        {
          ...product,
          itemId,
          quantity,
          selectedVariant,
          selectedSize,
          // Use discount price if available, otherwise use regular price
          price: product.discountPrice || product.price,
        },
      ]
    })
  }

  const removeItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.itemId !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    setItems((prev) => prev.map((item) => (item.itemId === itemId ? { ...item, quantity } : item)))
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, total, totalItems }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

