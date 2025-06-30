"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import axiosInstance from "@/app/config/axios"
import { Plus, Search, Filter, Edit, Trash2, Eye, Package, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import ProductModal from "./components/product.model.jsx"
// import { products as staticProducts } from "../../data/products.js" // Keep for reference or remove
import { toast } from "sonner";


export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/api/products");
      setProducts(response.data.data)
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Fail to fetch the products";
      toast.error(`Error fetching products: ${errorMessage}`);
      console.error("Fetch products error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductSaved = () => {
    fetchProducts(); // Refresh product list after save/update
    setIsModalOpen(false); // Close modal
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.material && product.material.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await axiosInstance.delete(`/api/products/${productId}`);
      toast.success("Product deleted successfully!");
      fetchProducts(); // Refresh list
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete this product";
      toast.error(`Error deleting products: ${errorMessage}`);
      console.error("Error while deleteing product:", err);
    }
  };

  const getTotalStock = (product) => {
    return product.variants?.reduce((total, variant) => total + (variant.quantity || 0), 0) || 0
  }

  const getAvailableVariants = (product) => {
    return product.variants?.filter((variant) => variant.isAvailable !== false).length || 0 // isAvailable can be true or undefined
  }

  const handleViewProduct = (product) => {
    // Open product in new tab using MongoDB _id
    window.open(`/product/${product._id}`, "_blank")
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
                {isLoading && (
                  <div className="flex items-center justify-center p-10">
                    <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                    <p className="ml-2 text-gray-600">Loading products...</p>
                  </div>
                )}
                {error && !isLoading && (
                  <div className="p-10 text-center text-red-600">
                    <p>Error loading products: {error}</p>
                    <Button onClick={fetchProducts} className="mt-4">Try Again</Button>
                  </div>
                )}
                {!isLoading && !error && filteredProducts.length === 0 && (
                  <div className="p-10 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2" />
                    <p>No products found.</p>
                    <p className="text-sm">Try adjusting your search or add a new product.</p>
                  </div>
                )}
                {!isLoading && !error && filteredProducts.length > 0 && (
                  <>
                    {/* Mobile Card View */}
                    <div className="block lg:hidden">
                      <div className="space-y-4 p-4">
                        {filteredProducts.map((product, index) => (
                          <motion.div
                            key={product._id} // Use MongoDB _id
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border rounded-lg p-4 space-y-3"
                          >
                            <div className="flex items-start space-x-3">
                              <img
                                src={product.mainImage?.imageUrl || "/hero/placeholder.png"} // Updated placeholder path
                                alt={product.name}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                                <p className="text-sm text-gray-600">ID: {product._id}</p> {/* Use MongoDB _id */}
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
                                <p className="font-semibold">{product.weight || 'N/A'}g</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center space-x-1">
                                {/* Add featured/sale badges if these fields exist in your model */}
                                {/* {product.featured && <Badge variant="secondary">Featured</Badge>} */}
                                {/* {product.discountPrice && product.discountPrice < product.price && <Badge className="bg-red-100 text-red-800">Sale</Badge>} */}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => handleViewProduct(product)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteProduct(product._id)}>
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
                              key={product._id} // Use MongoDB _id
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-gray-50"
                            >
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={product.mainImage?.imageUrl || "/hero/placeholder.png"} // Updated placeholder path
                                    alt={product.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-900">{product.name}</p>
                                    <p className="text-sm text-gray-600">ID: {product._id.slice(-6)}</p> {/* Show last 6 chars of ID */}
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
                                  {product.OriginalPrice && product.OriginalPrice > product.price && (
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
                                  {/* Add featured/sale badges if these fields exist */}
                                  {/* <div className="flex space-x-1">
                                    {product.featured && (
                                      <Badge variant="secondary" className="text-xs">Featured</Badge>
                                    )}
                                    {product.discountPrice && product.discountPrice < product.price && <Badge className="bg-red-100 text-red-800 text-xs">Sale</Badge>}
                                  </div> */}
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
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteProduct(product._id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>

      <ProductModal
        key={selectedProduct?._id || "new-product"} // Use MongoDB _id for key
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onProductSaved={handleProductSaved} // Pass callback to refresh list
      />
    </div>
  )
}

