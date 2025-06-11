"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Save, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import axiosInstance from "@/app/config/axios"
const sizeOptions = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "2T",
  "3T",
  "One Size",
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
]

const categoryOptions = ["Women", "Men", "Children"]

const colorPresets = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1E3A8A" },
  { name: "Gray", hex: "#6B7280" },
  { name: "Red", hex: "#FF0000" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Green", hex: "#10B981" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Beige", hex: "#F5F5DC" },
]

export default function ProductModal({ isOpen, onClose, product }) {
  const input = useRef(null)
  let inputMetaData = null;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    OriginalPrice: "",
    discountPrice: "",
    category: "",
    mainImageUrl: "/placeholder.svg?height=400&width=300",
    material: "",
    weight: "",
    isActive: true,
    featured: false,
    sale: false,
    variants: [],
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        OriginalPrice: product.OriginalPrice?.toString() || "",
        discountPrice: product.discountPrice?.toString() || "",
        category: product.category || "",
        mainImageUrl: product.mainImageUrl || "/placeholder.svg?height=400&width=300",
        material: product.material || "",
        weight: product.weight?.toString() || "",
        isActive: product.isActive !== undefined ? product.isActive : true,
        featured: product.featured || false,
        sale: product.sale || false,
        variants: product.variants || [],
      })
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        OriginalPrice: "",
        discountPrice: "",
        category: "",
        mainImageUrl: "/placeholder.svg?height=400&width=300",
        material: "",
        weight: "",
        isActive: true,
        featured: false,
        sale: false,
        variants: [],
      })
    }
  }, [product])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    onClose()
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addVariant = () => {
    const newVariant = {
      color: "",
      colorHex: "#000000",
      size: [],
      quantity: 0,
      images: ["/placeholder.svg?height=400&width=300"],
      isAvailable: true,
    }
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }))
  }

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }))
  }

  const updateVariant = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant)),
    }))
  }

  const toggleSize = (variantIndex, size) => {
    const variant = formData.variants[variantIndex]
    const currentSizes = variant.size || []
    const newSizes = currentSizes.includes(size) ? currentSizes.filter((s) => s !== size) : [...currentSizes, size]

    updateVariant(variantIndex, "size", newSizes)
  }

  const addImageToVariant = async (variantIndex, e) => {
    e.preventDefault();

    const file = e.target.files?.[0];
    const variant = formData.variants[variantIndex];

    if (!file) {
      toast("Please select an image file", {
        description: "No file was selected",
        action: {
          label: "Try again",
          onClick: () => e.target.click(),
        },
      });
      return;
    }

    const formdata = new FormData();
    formdata.append("file", {});

    try {
      const response = await axiosInstance.post('/upload/image', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast("Image uploaded successfully!", {
        description: `File: ${file.name}`,
      });

      const newImages = [...(variant.images || []), {
        imageUrl: response.data.imageUrl,
        publicId: response.data.publicId,
        fileName: response.data.fileName,
      }];
      updateVariant(variantIndex, "images", newImages);

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to upload image";

      toast(errorMessage, {
        description: "Please try again or contact support if the problem persists",
      });
    }
  }

  const removeImageFromVariant = (variantIndex, imageIndex) => {
    const variant = formData.variants[variantIndex]
    const newImages = variant.images.filter((_, i) => i !== imageIndex)
    updateVariant(variantIndex, "images", newImages)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <input ref={input} type="file" onChange={(e) => addImageToVariant(inputMetaData, e)} className="absolute right-[9999px]" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Product Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Product Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter product name"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Enter detailed product description"
                          rows={4}
                          required
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryOptions.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Main Image */}
                      <div className="space-y-2">
                        <Label>Main Product Image *</Label>
                        <div className="flex items-center space-x-4">
                          <img
                            src={formData.mainImageUrl || "/placeholder.svg"}
                            alt="Product preview"
                            className="w-20 h-20 rounded-lg object-cover border"
                          />
                          <Button type="button" variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Main Image
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pricing */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pricing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="OriginalPrice">Original Price ($) *</Label>
                          <Input
                            id="OriginalPrice"
                            type="number"
                            step="0.01"
                            value={formData.OriginalPrice}
                            onChange={(e) => handleInputChange("OriginalPrice", e.target.value)}
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="price">Current Price ($) *</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => handleInputChange("price", e.target.value)}
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="discountPrice">Discount Price ($)</Label>
                          <Input
                            id="discountPrice"
                            type="number"
                            step="0.01"
                            value={formData.discountPrice}
                            onChange={(e) => handleInputChange("discountPrice", e.target.value)}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Product Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Product Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="material">Material</Label>
                          <Input
                            id="material"
                            value={formData.material}
                            onChange={(e) => handleInputChange("material", e.target.value)}
                            placeholder="e.g., 100% Cotton"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (grams)</Label>
                          <Input
                            id="weight"
                            type="number"
                            value={formData.weight}
                            onChange={(e) => handleInputChange("weight", e.target.value)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Product Variants */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Product Variants</CardTitle>
                      <Button type="button" onClick={addVariant} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Variant
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {formData.variants.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No variants added yet. Click "Add Variant" to get started.
                        </p>
                      ) : (
                        <div className="space-y-6">
                          {formData.variants.map((variant, index) => (
                            <Card key={index} className="border-2">
                              <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-base">Variant {index + 1}</CardTitle>
                                <Button
                                  type="button"
                                  onClick={() => removeVariant(index)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {/* Color Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Color Name</Label>
                                    <Select
                                      value={variant.color}
                                      onValueChange={(value) => {
                                        const selectedColor = colorPresets.find((c) => c.name === value)
                                        updateVariant(index, "color", value)
                                        if (selectedColor) {
                                          updateVariant(index, "colorHex", selectedColor.hex)
                                        }
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select color" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {colorPresets.map((color) => (
                                          <SelectItem key={color.name} value={color.name}>
                                            <div className="flex items-center space-x-2">
                                              <div
                                                className="w-4 h-4 rounded-full border"
                                                style={{ backgroundColor: color.hex }}
                                              />
                                              <span>{color.name}</span>
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Color Hex</Label>
                                    <div className="flex items-center space-x-2">
                                      <Input
                                        value={variant.colorHex}
                                        onChange={(e) => updateVariant(index, "colorHex", e.target.value)}
                                        placeholder="#000000"
                                      />
                                      <div
                                        className="w-10 h-10 rounded border"
                                        style={{ backgroundColor: variant.colorHex }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Size Selection */}
                                <div className="space-y-2">
                                  <Label>Available Sizes</Label>
                                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                    {sizeOptions.map((size) => (
                                      <Button
                                        key={size}
                                        type="button"
                                        variant={variant.size?.includes(size) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleSize(index, size)}
                                        className="text-xs"
                                      >
                                        {size}
                                      </Button>
                                    ))}
                                  </div>
                                  {variant.size?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {variant.size.map((size) => (
                                        <Badge key={size} variant="secondary">
                                          {size}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Quantity and Availability */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Quantity in Stock</Label>
                                    <Input
                                      type="number"
                                      value={variant.quantity}
                                      onChange={(e) =>
                                        updateVariant(index, "quantity", Number.parseInt(e.target.value) || 0)
                                      }
                                      placeholder="0"
                                      min="0"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Available</Label>
                                    <div className="flex items-center space-x-2 pt-2">
                                      <Switch
                                        checked={variant.isAvailable}
                                        onCheckedChange={(checked) => updateVariant(index, "isAvailable", checked)}
                                      />
                                      <span className="text-sm text-gray-600">
                                        {variant.isAvailable ? "Available" : "Unavailable"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Variant Images */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label>Variant Images</Label>
                                    <Button
                                      type="button"
                                      onClick={() => {
                                        inputMetaData = index;
                                        input.current.click();
                                      }}
                                      variant="outline"
                                      size="sm"
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add Image
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                    {variant.images?.map((image, imageIndex) => (
                                      <div key={imageIndex} className="relative group">
                                        <img
                                          src={image.imageUrl || "/placeholder.svg"}
                                          alt={`Variant ${index + 1} Image ${imageIndex + 1}`}
                                          className="w-full h-16 object-cover rounded border"
                                        />
                                        <Button
                                          type="button"
                                          onClick={() => removeImageFromVariant(index, imageIndex)}
                                          variant="destructive"
                                          size="sm"
                                          className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Product Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Product Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Active Product</Label>
                            <p className="text-sm text-gray-600">Product is visible and available for purchase</p>
                          </div>
                          <Switch
                            checked={formData.isActive}
                            onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Featured Product</Label>
                            <p className="text-sm text-gray-600">Show this product in featured section</p>
                          </div>
                          <Switch
                            checked={formData.featured}
                            onCheckedChange={(checked) => handleInputChange("featured", checked)}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>On Sale</Label>
                            <p className="text-sm text-gray-600">Mark this product as on sale</p>
                          </div>
                          <Switch
                            checked={formData.sale}
                            onCheckedChange={(checked) => handleInputChange("sale", checked)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <Save className="w-4 h-4 mr-2" />
                      {product ? "Update Product" : "Create Product"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
