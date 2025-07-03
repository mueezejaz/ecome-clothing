"use client"

import { createContext, useContext, useState, useMemo } from "react"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = (product, selectedVariant = null, selectedSize = null, quantity = 1) => {
    setItems((prev) => {
      const existingProduct = prev.find((item) => item._id === product._id)

      if (existingProduct) {
        const existingVariant = existingProduct.variants.find(
          (variant) => variant._id === selectedVariant._id
        )

        if (existingVariant) {
          return prev.map((item) =>
            item._id === product._id
              ? {
                  ...item,
                  variants: item.variants.map((variant) =>
                    variant._id === selectedVariant._id
                      ? { ...variant, quantity: variant.quantity + quantity }
                      : variant
                  )
                }
              : item
          )
        } else {
          return prev.map((item) =>
            item._id === product._id
              ? {
                  ...item,
                  variants: [...item.variants, { ...selectedVariant, quantity }]
                }
              : item
          )
        }
      }

      return [
        ...prev,
        {
          ...product,
          variants: [{ ...selectedVariant, quantity }]
        }
      ]
    })
  }

  const removeItem = (itemId, variantId) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item._id === itemId
            ? {
                ...item,
                variants: item.variants.filter((variant) => variant._id !== variantId)
              }
            : item
        )
        .filter((item) => item.variants.length > 0)
    )
  }

  const itemCount = (itemId, variantId) => {
    const product = items.find((e) => e._id === itemId)
    const variant = product?.variants.find((e) => variantId === e._id)
    return variant?.quantity || 0
  }

  const updateQuantity = (itemId, variantId, quantity) => {
    if (quantity <= 0) {
      console.log("the qunatity is",quantity)
      removeItem(itemId, variantId)
      return
    }

    setItems((prev) =>
      prev.map((item) =>
        item._id === itemId
          ? {
              ...item,
              variants: item.variants.map((variant) =>
                variant._id === variantId ? { ...variant, quantity } : variant
              )
            }
          : item
      )
    )
  }

  const getCurrentPrice = (item) => item.discountPrice || item.price

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const itemTotal = item.variants.reduce(
        (variantSum, variant) => variantSum + getCurrentPrice(item) * variant.quantity,
        0
      )
      return sum + itemTotal
    }, 0)
  }, [items])

  const totalItems = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + item.variants.reduce((variantSum, variant) => variantSum + variant.quantity, 0),
      0
    )
  }, [items])

  return (
    <CartContext.Provider
      value={{ items, addItem, itemCount, removeItem, updateQuantity, total, totalItems }}
    >
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


