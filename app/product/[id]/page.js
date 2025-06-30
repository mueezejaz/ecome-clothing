"use client"

import { useState, useEffect, use } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Heart, ShoppingBag, Star, Truck, Shield, RotateCcw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "../../context/cart-context"
import { toast } from "sonner"
import Link from "next/link"
import Header from "../../components/header"
import Footer from "../../components/footer"
import { notFound } from "next/navigation"
import axiosInstance from "@/app/config/axios"
import axios from "axios"

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const paramss = use(params)
  const { addItem, items } = useCart()

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance(`/api/products/${paramss.id}`)

        setProduct(response.data.data)
        console.log(response)
        // Initialize with first variant
        if (response.data?.data?.variants && response.data?.data?.variants.length > 0) {
          setSelectedVariant(response.data.data.variants[0])
        }
      } catch (error) {
        let errorMessage = error.response?.data?.message || "faild to get product";
        console.error('Error fetching product:', error)
        toast.error(errorMessage);
        notFound();
      } finally {
        setLoading(false)
      }
    }

    if (paramss.id) {
      fetchProduct()
    }
  }, [paramss.id])

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return

      try {
        const response = await axiosInstance(`/api/products/related/${product._id}`)
        setRelatedProducts(response.data.data || [])
      } catch (error) {
        const errorMessage = error.response?.data?.message || "faild to get product";
        console.error('Error fetching related products:', error)
        toast.error(errorMessage)
      }
    }

    fetchRelatedProducts()
  }, [product])
console.log("the cart items are",items);
  // Reset selected image when variant changes
  useEffect(() => {
    setSelectedImage(0)
  }, [selectedVariant])

  if (loading) {
    return (
      <div className="min-h-screen bg-white animate-pulse">
        <main className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-300 mb-8">
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <span>/</span>
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <span>/</span>
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>

          {/* Back Button */}
          <div className="mb-8">
            <div className="h-6 w-40 bg-gray-200 rounded" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Product Images */}
            <div>
              <div className="w-full h-96 lg:h-[600px] bg-gray-200 rounded-lg" />
              <div className="grid grid-cols-4 gap-4 mt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="space-y-6">
              {/* Title and rating */}
              <div>
                <div className="h-8 w-2/3 bg-gray-200 rounded mb-2" />
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
                    ))}
                  </div>
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <div className="h-8 w-24 bg-gray-200 rounded" />
                <div className="h-6 w-16 bg-gray-200 rounded" />
                <div className="h-6 w-20 bg-gray-200 rounded" />
              </div>

              {/* Color */}
              <div>
                <div className="h-4 w-28 bg-gray-200 rounded mb-3" />
                <div className="flex space-x-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-10 h-10 bg-gray-200 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-3" />
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded-md" />
                  ))}
                </div>
              </div>

              {/* Stock Info */}
              <div className="h-10 w-full bg-gray-200 rounded-lg" />

              {/* Quantity */}
              <div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                <div className="flex space-x-4">
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                    <div className="px-3 py-2 w-8 bg-gray-200" />
                    <div className="px-4 py-2 border-x border-gray-200 w-12 bg-gray-200" />
                    <div className="px-3 py-2 w-8 bg-gray-200" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="h-14 w-full bg-gray-200 rounded" />
                <div className="h-14 w-full bg-gray-200 rounded" />
              </div>

              {/* Features */}
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-gray-200 rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div className="h-4 w-40 bg-gray-200 rounded" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-4 w-2/3 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-20 space-y-4">
            <div className="h-8 w-1/3 bg-gray-200 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="h-64 bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded mb-2" />
                  <div className="h-5 w-1/4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

    )
  }

  if (!product) {
    notFound()
  }
  let count = 0;
  // Get current images based on selected variant
  const getCurrentImages = () => {
    const images = []

    // Add main image first
    if (product.mainImage?.imageUrl) {
      images.push(product.mainImage.imageUrl)
    }
    console.log("current count is ", count, "and the product is ", product, "and the varient is ", selectedVariant)
    // Add variant images
    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      selectedVariant.images.forEach(img => {
        if (img.imageUrl) {
          images.push(img.imageUrl)
        }
      })
    }

    if (images.length === 0) {
      toast.error("faild to get images")
    }

    return images
  }

  const currentImages = getCurrentImages()

  // Get available sizes for selected variant
  const getAvailableSizes = () => {
    if (selectedVariant?.size) {
      return Array.isArray(selectedVariant.size) ? selectedVariant.size : [selectedVariant.size]
    }
    return []
  }

  const availableSizes = getAvailableSizes()

  // Calculate sale percentage
  const getSalePercentage = () => {
    if (product.discountPrice && product.price && product.discountPrice < product.price) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100)
    }
    return 0
  }

  const salePercentage = getSalePercentage()

  // Get current price (use discount price if available)
  const getCurrentPrice = () => {
    return product.discountPrice || product.price
  }

  const features = [
    { icon: Truck, text: "Free shipping on orders over $100" },
    { icon: RotateCcw, text: "30-day return policy" },
    { icon: Shield, text: "2-year warranty included" },
  ]

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a color")
      return
    }
    if (!selectedSize) {
      toast.error("Please select a size")
      return
    }
    if (quantity > selectedVariant.quantity) {
      toast.error(`Only ${selectedVariant.quantity} items available`)
      return
    }

    setAddingToCart(true)
    try {
      addItem(product, selectedVariant, selectedSize, quantity)
      toast.success(`${product.name} added to cart!`, {
        description: `${quantity} item(s) in ${selectedVariant.color}, size ${selectedSize}`
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error("Failed to add item to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant)
    // Reset size selection if current size is not available in new variant
    if (selectedSize && !variant.size?.includes(selectedSize)) {
      setSelectedSize("")
    }
  }

  const handleWishlist = () => {
    // Implement wishlist functionality here
    toast.success("Added to wishlist!", {
      description: `${product.name} has been saved to your wishlist`
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
        >
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </motion.div>

        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="p-0 h-auto font-normal text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-lg bg-gray-100">
                <motion.img
                  key={`${selectedVariant?.color}-${selectedImage}`}
                  src={currentImages[selectedImage]}
                  alt={`${product.name} - ${selectedVariant?.color || "Default"}`}
                  className="w-full h-96 lg:h-[600px] object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => {
                    e.target.alt = "faild to get image"
                  }}
                />
                {salePercentage > 0 && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                    -{salePercentage}%
                  </Badge>
                )}
                {selectedVariant && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: selectedVariant.colorHex || '#000' }}
                      />
                      <span className="text-sm font-medium text-gray-900">{selectedVariant.color}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-4">
                {currentImages.map((image, index) => (
                  <motion.button
                    key={`${selectedVariant?.color}-thumb-${index}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all ${selectedImage === index ? "border-gray-900" : "border-gray-200"
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=80&width=80"
                      }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Product Title and Rating */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(128 reviews)</span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">${getCurrentPrice()}</span>
              {product.price && product.price !== getCurrentPrice() && (
                <span className="text-xl text-gray-400 line-through">${product.price}</span>
              )}
              {salePercentage > 0 && <Badge className="bg-red-500 text-white">Save {salePercentage}%</Badge>}
            </div>

            <Separator />

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Color {selectedVariant && <span className="font-normal text-gray-600">- {selectedVariant.color}</span>}
              </h3>
              <div className="flex space-x-3">
                {product.variants?.map((variant) => (
                  <motion.button
                    key={variant.color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleVariantChange(variant)}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all ${selectedVariant?.color === variant.color ? "border-gray-900 scale-110" : "border-gray-300"
                      }`}
                    style={{ backgroundColor: variant.colorHex || '#000' }}
                    title={variant.color}
                  >
                    {selectedVariant?.color === variant.color && (
                      <div className="absolute inset-0 rounded-full border-2 border-white" />
                    )}
                    {!variant.isAvailable && (
                      <div className="absolute inset-0 bg-gray-500/50 rounded-full flex items-center justify-center">
                        <div className="w-6 h-0.5 bg-white transform rotate-45" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Size {selectedSize && <span className="font-normal text-gray-600">- {selectedSize}</span>}
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {availableSizes.map((size) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedSize(size)
                      toast.info(`Selected size ${size}`)
                    }}
                    className={`py-2 px-3 border rounded-md text-sm font-medium transition-all ${selectedSize === size
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Stock Information */}
            {selectedVariant && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Stock Available:</span>
                  <span
                    className={`text-sm font-medium ${selectedVariant.quantity > 10
                      ? "text-green-600"
                      : selectedVariant.quantity > 0
                        ? "text-yellow-600"
                        : "text-red-600"
                      }`}
                  >
                    {selectedVariant.quantity > 0 ? `${selectedVariant.quantity} units` : "Out of stock"}
                  </span>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors"
                    disabled={selectedVariant && quantity >= selectedVariant.quantity}
                  >
                    +
                  </button>
                </div>
                {selectedVariant && quantity > selectedVariant.quantity && (
                  <span className="text-sm text-red-600">Only {selectedVariant.quantity} available</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || !selectedSize || selectedVariant.quantity === 0 || addingToCart}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg font-semibold disabled:bg-gray-400"
                  size="lg"
                >
                  {addingToCart ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      {selectedVariant?.quantity === 0
                        ? "Out of Stock"
                        : `Add to Cart - $${(getCurrentPrice() * quantity).toFixed(2)}`}
                    </>
                  )}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleWishlist}
                  variant="outline"
                  className="w-full border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white py-3 text-lg font-semibold"
                  size="lg"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Add to Wishlist
                </Button>
              </motion.div>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center space-x-3 text-gray-600"
                >
                  <feature.icon className="w-5 h-5" />
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Product Details</h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Material:</strong> {product.material || "Premium Quality"}
                </p>
                <p>
                  <strong>Weight:</strong> {product.weight ? `${product.weight}g` : "Lightweight"}
                </p>
                <p>
                  <strong>Care:</strong> Machine wash cold, tumble dry low
                </p>
                <p>
                  <strong>Origin:</strong> Made in Italy
                </p>
                <p>
                  <strong>Fit:</strong> True to size
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/product/${relatedProduct._id}`}>
                    <div className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg mb-4">
                        <img
                          src={relatedProduct.mainImage?.imageUrl || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=256&width=256"
                          }}
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{relatedProduct.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{relatedProduct.category}</p>
                      <p className="font-bold text-gray-900">
                        ${relatedProduct.discountPrice || relatedProduct.price}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>

      <Footer />
    </div>
  )
}







