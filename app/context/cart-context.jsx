"use client"

import { createContext, useContext, useState } from "react"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = (product, selectedVariant = null, selectedSize = null, quantity = 1) => {
    console.log("the quantity we are getting", quantity);
    setItems((prev) => {
      const existingProduct = prev.find((item) => item._id === product._id);

      if (existingProduct) {
        const existingVariant = existingProduct.variants.find(variant => variant._id === selectedVariant._id);

        if (existingVariant) {
          const updatedVariant = {
            ...existingVariant,
            quantity: existingVariant.quantity + quantity
          };

          console.log("the quantity after", updatedVariant.quantity);

          return prev.map(item =>
            item._id === product._id
              ? {
                ...item,
                variants: item.variants.map(variant =>
                  variant._id === selectedVariant._id ? updatedVariant : variant
                )
              }
              : item
          );
        } else {
          // Add new variant
          return prev.map(item =>
            item._id === product._id
              ? { ...item, variants: [...item.variants, { ...selectedVariant, quantity }] }
              : item
          );
        }
      }
      return [
        ...prev,
        {
          ...product,
          variants: [{ ...selectedVariant, quantity }]
        }
      ];
    });
  };

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
  console.log("items are ", items)
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

