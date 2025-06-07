"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, Edit, Trash2, Eye, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import ProductModal from "./components/product.model.jsx"
import { products } from "../../data/products.js"

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.material?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const getTotalStock = (product) => {
    return product.variants?.reduce((total, variant) => total + (variant.quantity || 0), 0) || 0
  }

  const getAvailableVariants = (product) => {
    return product.variants?.filter((variant) => variant.isAvailable).length || 0
  }

  const handleViewProduct = (product) => {
    // Open product in new tab
    window.open(`/product/${product.id}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">

        <main className="flex-1 p-4 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
              <div className="pt-12 lg:pt-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600">Manage your product inventory and variants</p>
              </div>
              <Button onClick={handleAddProduct} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search products, categories, materials..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Products ({filteredProducts.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Mobile Card View */}
                <div className="block lg:hidden">
                  <div className="space-y-4 p-4">
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={product.mainImageUrl || "/placeholder.svg"}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                            <p className="text-sm text-gray-600">ID: {product.id}</p>
                            <p className="text-sm text-gray-600">{product.material}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                              <Badge
                                className={product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                              >
                                {product.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="font-semibold">${product.price}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Stock</p>
                            <p className="font-semibold">{getTotalStock(product)} units</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Variants</p>
                            <p className="font-semibold">{getAvailableVariants(product)} available</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Weight</p>
                            <p className="font-semibold">{product.weight}g</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center space-x-1">
                            {product.featured && <Badge variant="secondary">Featured</Badge>}
                            {product.sale && <Badge className="bg-red-100 text-red-800">Sale</Badge>}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewProduct(product)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Variants</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.mainImageUrl || "/placeholder.svg"}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-600">ID: {product.id}</p>
                                <p className="text-xs text-gray-500">{product.material}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-semibold">${product.price}</p>
                              {product.OriginalPrice !== product.price && (
                                <p className="text-sm text-gray-500 line-through">${product.OriginalPrice}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Package className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{getTotalStock(product)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.variants?.length || 0} total</p>
                              <p className="text-sm text-gray-600">{getAvailableVariants(product)} available</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge
                                className={product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                              >
                                {product.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <div className="flex space-x-1">
                                {product.featured && (
                                  <Badge variant="secondary" className="text-xs">
                                    Featured
                                  </Badge>
                                )}
                                {product.sale && <Badge className="bg-red-100 text-red-800 text-xs">Sale</Badge>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewProduct(product)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>

      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={selectedProduct} />
    </div>
  )
}
