"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Save, Plus, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const categoryOptions = ["Women", "Men", "Children",] // Expanded example

const colorPresets = [
  { name: "Black", hex: "#000000" }, { name: "White", hex: "#FFFFFF" }, { name: "Navy", hex: "#1E3A8A" },
  { name: "Gray", hex: "#6B7280" }, { name: "Red", hex: "#FF0000" }, { name: "Blue", hex: "#3B82F6" },
  { name: "Green", hex: "#10B981" }, { name: "Pink", hex: "#FFC0CB" }, { name: "Brown", hex: "#8B4513" },
  { name: "Beige", hex: "#F5F5DC" }, { name: "Olive", hex: "#808000" }, { name: "Purple", hex: "#800080" },
] // Expanded example

const initialFormData = {
  name: "",
  description: "",
  price: "",
  OriginalPrice: "",
  discountPrice: "",
  category: "",
  mainImage: { imageUrl: "", publicId: "", fileName: "" },
  material: "",
  weight: "",
  isActive: true,
  // featured: false, // Assuming these are not in current Product model based on schema
  // sale: false,     // Assuming these are not in current Product model
  variants: [],
};

export default function ProductModal({ isOpen, onClose, product, onProductSaved }) {
  const inputRef = useRef(null); // Renamed for clarity
  console.log("the data is ", product)
  const [imageUploadTarget, setImageUploadTarget] = useState(null); // 'main' or variant index
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (isOpen) { // Reset form when modal opens or product changes
      if (product) {
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          OriginalPrice: product.OriginalPrice?.toString() || "",
          discountPrice: product.discountPrice?.toString() || "",
          category: product.category || "",
          mainImage: product.mainImage || { imageUrl: "", publicId: "", fileName: "" },
          material: product.material || "",
          weight: product.weight?.toString() || "",
          isActive: product.isActive !== undefined ? product.isActive : true,
          variants: product.variants?.map(v => ({
            ...v,
            size: v.size || "",
            images: v.images || [],
            isAvailable: v.isAvailable !== undefined ? v.isAvailable : true,
          })) || [],
        });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [product, isOpen]);
  console.log("the produt current state is ", formData )
  const validateForm = () => {
    const { name, description, price, OriginalPrice, discountPrice, category, mainImage, variants } = formData;
    if (!name.trim()) { toast.error("Product name is required."); return false; }
    if (!description.trim()) { toast.error("Product description is required."); return false; }
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) { toast.error("Valid current price is required."); return false; }
    if (isNaN(parseFloat(OriginalPrice)) || parseFloat(OriginalPrice) <= 0) { toast.error("Valid original price is required."); return false; }
    if (parseFloat(price) < parseFloat(discountPrice)) { toast.error("discount price can not be greater then the price"); return false }
    if (!category) { toast.error("Category is required."); return false; }
    if (!mainImage?.imageUrl) { toast.error("Main product image is required."); return false; }

    if (!variants || variants.length === 0) {
      toast.error("At least one product variant is required.");
      return false;
    }

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.color.trim()) { toast.error(`Color is required for Variant ${i + 1}.`); return false; }
      if (!v.size && typeof( v.size )!= "string") { toast.error(`At least one size is required for Variant ${i + 1}.`); return false; }
      if (isNaN(parseInt(v.quantity)) || parseInt(v.quantity) < 0) { toast.error(`Valid quantity is required for Variant ${i + 1}.`); return false; }
      if (!v.images || v.images.length === 0) { toast.error(`At least one image is required for Variant ${i + 1}.`); return false; }
      v.images.forEach(img => {
        if (!img.imageUrl) { toast.error(`Image URL is missing for an image in Variant ${i + 1}.`); return false; }
      })
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      OriginalPrice: parseFloat(formData.OriginalPrice),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      variants: formData.variants.map(v => ({
        ...v,
        quantity: parseInt(v.quantity)
      }))
    };

    try {
      let response;
      if (product && product._id) { // Editing existing product
        response = await axiosInstance.put(`/api/products/${product._id}`, payload);
      } else { // Creating new product
        response = await axiosInstance.post("/api/products", payload);
      }

      // Axios wraps the response in a `data` object.
      const result = response.data;

      toast.success(result.message || (product ? "Product updated successfully!" : "Product created successfully!"));
      if (onProductSaved) {
        onProductSaved();
      }
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Submit error:", error);
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      images: [], // Initialize with empty array, actual image objects will be added on upload
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

  function showLoadingMessage(msg = loading.message) {
    toast("Loading", {
      description: msg,
    });
  }
  const handleImageUpload = async (e) => {
    if (isUploading) {
      toast.info("An image upload is already in progress.");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${file.name}...`);

    const imageFormData = new FormData();
    imageFormData.append("file", file);

    try {
      const response = await axiosInstance.post('/api/upload/image', imageFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Axios puts response data directly in `response.data`
      const result = response.data;

      toast.success(`Image "${result.fileName}" uploaded successfully!`, { id: toastId });

      const newImageData = {
        imageUrl: result.imageUrl,
        publicId: result.publicId,
        fileName: result.fileName,
      };

      if (imageUploadTarget === "main") {
        handleInputChange("mainImage", newImageData);
      } else if (typeof imageUploadTarget === "number") { // Variant image
        const variantIndex = imageUploadTarget;
        const variant = formData.variants[variantIndex];
        const updatedImages = [...(variant.images || []), newImageData];
        const finalImages = updatedImages.filter(img => typeof img === 'object' && img.imageUrl);
        updateVariant(variantIndex, "images", finalImages);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to upload image.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = ""; // Reset file input
      }
      setImageUploadTarget(null); // Reset target
    }
  };

  const triggerImageUpload = (targetType) => { // targetType can be 'main' or variant index
    setImageUploadTarget(targetType);
    inputRef.current?.click();
  };

  const removeImageFromVariant = (variantIndex, imagePublicIdToRemove) => {
    const variant = formData.variants[variantIndex];
    const newImages = variant.images.filter((img) => img.publicId !== imagePublicIdToRemove);
    updateVariant(variantIndex, "images", newImages);
    toast.info("Image removed from variant. Save product to persist changes.");
  };

  const removeMainImage = () => {
    handleInputChange("mainImage", { imageUrl: "", publicId: "", fileName: "" });
    toast.info("Main image removed. Save product to persist changes.");
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageUpload}
            className="absolute right-[9999px]" // Visually hidden but accessible
          />
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
                <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting || isUploading}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Product Information */}
                  <fieldset disabled={isSubmitting || isUploading} className="space-y-4">
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
                            value={product?.category || ""}
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
                        {/* Main Image upload is handled outside this fieldset for separate disable logic */}
                      </CardContent>
                    </Card>
                  </fieldset>

                  {/* Main Image - separate because its button has its own isUploading logic */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Main Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Main Image */}
                      <div className="space-y-2">
                        <Label>Main Product Image *</Label>
                        <div className="flex items-center space-x-4">
                          {formData.mainImage?.imageUrl ? (
                            <div className="relative group">
                              <img
                                src={formData.mainImage.imageUrl}
                                alt="Product preview"
                                className="w-20 h-20 rounded-lg object-cover border"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-lg border bg-gray-100 flex items-center justify-center">
                              <Upload className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => triggerImageUpload("main")}
                            disabled={isUploading || isSubmitting}
                          >
                            {isUploading && imageUploadTarget === "main" ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4 mr-2" />
                            )}
                            {formData.mainImage?.imageUrl ? "Change Image" : "Upload Image"}
                          </Button>
                        </div>
                        {!formData.mainImage?.imageUrl && <p className="text-xs text-red-500 pt-1">Main image is required.</p>}
                      </div>
                    </CardContent>
                  </Card>

                  <fieldset disabled={isSubmitting || isUploading}>
                    {/* Pricing */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Pricing</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="OriginalPrice">Original Price *</Label>
                            <Input
                              id="OriginalPrice"
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={formData.OriginalPrice}
                              onChange={(e) => handleInputChange("OriginalPrice", e.target.value)}
                              placeholder="e.g., 29.99"
                              required
                            />
                            <CardDescription>enter the price you buy it for</CardDescription>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="price">Current Price *</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={formData.price}
                              onChange={(e) => handleInputChange("price", e.target.value)}
                              placeholder="e.g., 19.99"
                              required
                            />
                            <CardDescription>enter the price to sale it for </CardDescription>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="discountPrice">Discount Price</Label>
                            <Input
                              id="discountPrice"
                              type="number"
                              step="0.01"
                              min="0"
                              value={formData.discountPrice}
                              onChange={(e) => handleInputChange("discountPrice", e.target.value)}
                              placeholder="e.g., 14.99 (optional)"
                            />
                            <CardDescription>enter discountprice </CardDescription>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Product Details */}
                    <Card className="mt-8">
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
                    <Card className="mt-8">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Product Variants</CardTitle>
                        <Button type="button" onClick={addVariant} variant="outline" size="sm" disabled={isSubmitting || isUploading}>
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
                                    disabled={isSubmitting || isUploading}
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
                                        disabled={isSubmitting || isUploading}
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
                                          disabled={isSubmitting || isUploading}
                                        />
                                        <div
                                          className="w-10 h-10 rounded border"
                                          style={{ backgroundColor: variant.colorHex }}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Size Size */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Select Size</Label>
                                      <Select
                                        value={variant.size || ""}
                                        onValueChange={(value) => {
                                          updateVariant(index,"size",value);  
                                        }}
                                        disabled={isSubmitting || isUploading}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selet Size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {sizeOptions.map((size) => (
                                            <SelectItem key={size} value={size}>
                                              <div className="flex items-center space-x-2">
                                                <span>{size}</span>
                                              </div>
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  {/* Quantity and Availability */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Quantity in Stock</Label>
                                      <Input
                                        type="number"
                                        value={variant?.quantity || ""}
                                        onChange={(e) =>
                                          updateVariant(index, "quantity", Number.parseInt(e.target.value) || 0)
                                        }
                                        disabled={isSubmitting || isUploading}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Available</Label>
                                      <div className="flex items-center space-x-2 pt-2">
                                        <Switch
                                          checked={variant.isAvailable}
                                          onCheckedChange={(checked) => updateVariant(index, "isAvailable", checked)}
                                          disabled={isSubmitting || isUploading}
                                        />
                                        <span className="text-sm text-gray-600">
                                          {variant.isAvailable ? "Available" : "Unavailable"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Variant Images (upload button handled outside fieldset) */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label>Variant Images *</Label>
                                      <Button
                                        type="button"
                                        onClick={() => triggerImageUpload(index)}
                                        variant="outline"
                                        size="sm"
                                        disabled={isUploading || isSubmitting}
                                      >
                                        {isUploading && imageUploadTarget === index ? (
                                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                        ) : (
                                          <Plus className="w-3 h-3 mr-1" />
                                        )}
                                        Add Image
                                      </Button>
                                    </div>
                                    {(!variant.images || variant.images.length === 0) && <p className="text-xs text-red-500 pt-1">At least one image is required for each variant.</p>}
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                      {variant.images?.map((image, imageIndex) => (
                                        image.imageUrl && ( // Only render if imageUrl exists
                                          <div key={image.publicId || imageIndex} className="relative group">
                                            <img
                                              src={image.imageUrl}
                                              alt={`Variant ${index + 1} Image ${imageIndex + 1}`}
                                              className="w-full h-16 object-cover rounded border"
                                            />
                                            <Button
                                              type="button"
                                              onClick={() => removeImageFromVariant(index, image.publicId)}
                                              variant="destructive"
                                              size="sm"
                                              className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                              disabled={isUploading || isSubmitting}
                                            >
                                              <X className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        )
                                      ))}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                        {formData.variants.length === 0 && <p className="text-xs text-red-500 pt-1">At least one variant is required.</p>}
                      </CardContent>
                    </Card>

                    {/* Product Settings */}
                    <fieldset disabled={isSubmitting}> {/* Only disable settings on final submission */}
                      <Card className="mt-8">
                        <CardHeader>
                          <CardTitle className="text-lg">Product Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <Label htmlFor={`isActive-${product?._id}`}>Active Product</Label>
                                <p className="text-sm text-gray-600">Product is visible and available for purchase</p>
                              </div>
                              <Switch
                                id={`isActive-${product?._id}`}
                                checked={formData.isActive}
                                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                              // disabled state is inherited from fieldset
                              />
                            </div>
                            {/* Removed Featured and On Sale switches as they are not in the Product Model from model.Product.js */}
                          </div>
                        </CardContent>
                      </Card>
                    </fieldset>
                  </fieldset> {/* This closes the main fieldset started after Main Image card */}


                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting || isUploading}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || isUploading}>
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {product?._id ? "Update Product" : "Create Product"}
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


