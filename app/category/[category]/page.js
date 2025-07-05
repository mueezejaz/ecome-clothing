"use client"

import { useState, useMemo, use } from "react"
import { motion } from "framer-motion"
import { Filter, X, Grid, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import Header from "@/app/components/header"
import Footer from "@/app/components/footer"
import { ProductCard } from "@/app/components/product-card"
import { products } from "@/app/data/products"
import { notFound } from "next/navigation"

const VALID_CATEGORIES = ["women", "men", "children"]

export default function CategoryPage({ params }) {
    const resolvedParams = use(params);
    const categoryName = resolvedParams.category.toLowerCase()   
    if (!VALID_CATEGORIES.includes(categoryName)) {
        notFound()
    }

    const [filters, setFilters] = useState({
        priceRange: [0, 500],
        onSale: false,
        inStock: false,
        colors: [],
        sizes: [],
        materials: [],
        featured: false,
    })

    const [sortBy, setSortBy] = useState("featured")
    const [viewMode, setViewMode] = useState("grid")
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Get category products
    const categoryProducts = products.filter((product) => product.category.toLowerCase() === categoryName)

    // Get all available filter options
    const filterOptions = useMemo(() => {
        const colors = new Set()
        const sizes = new Set()
        const materials = new Set()
        let maxPrice = 0

        categoryProducts.forEach((product) => {
            // Price
            const price = product.discountPrice || product.price
            if (price > maxPrice) maxPrice = price

            // Colors from variants
            product.variants?.forEach((variant) => {
                if (variant.color) colors.add(variant.color)
                variant.size?.forEach((size) => sizes.add(size))
            })

            // Materials
            if (product.material) materials.add(product.material)
        })

        return {
            colors: Array.from(colors).sort(),
            sizes: Array.from(sizes).sort(),
            materials: Array.from(materials).sort(),
            maxPrice: Math.ceil(maxPrice),
        }
    }, [categoryProducts])

    // Apply filters
    const filteredProducts = useMemo(() => {
        return categoryProducts.filter((product) => {
            const price = product.discountPrice || product.price

            // Price filter
            if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
                return false
            }

            // Sale filter
            if (filters.onSale && !product.sale && !product.discountPrice) {
                return false
            }

            // Stock filter
            if (filters.inStock) {
                const totalStock = product.variants?.reduce((sum, variant) => sum + (variant.quantity || 0), 0) || 0
                if (totalStock === 0) return false
            }

            // Featured filter
            if (filters.featured && !product.featured) {
                return false
            }

            // Color filter
            if (filters.colors.length > 0) {
                const productColors = product.variants?.map((v) => v.color) || []
                if (!filters.colors.some((color) => productColors.includes(color))) {
                    return false
                }
            }

            // Size filter
            if (filters.sizes.length > 0) {
                const productSizes = product.variants?.flatMap((v) => v.size || []) || []
                if (!filters.sizes.some((size) => productSizes.includes(size))) {
                    return false
                }
            }

            // Material filter
            if (filters.materials.length > 0) {
                if (!filters.materials.includes(product.material)) {
                    return false
                }
            }

            return true
        })
    }, [categoryProducts, filters])

    // Sort products
    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts]

        switch (sortBy) {
            case "price-low":
                return sorted.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))
            case "price-high":
                return sorted.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price))
            case "name":
                return sorted.sort((a, b) => a.name.localeCompare(b.name))
            case "newest":
                return sorted.reverse()
            case "featured":
            default:
                return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        }
    }, [filteredProducts, sortBy])

    // Filter handlers
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const handleArrayFilterToggle = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value],
        }))
    }

    const clearFilters = () => {
        setFilters({
            priceRange: [0, filterOptions.maxPrice],
            onSale: false,
            inStock: false,
            colors: [],
            sizes: [],
            materials: [],
            featured: false,
        })
    }

    const getActiveFiltersCount = () => {
        let count = 0
        if (filters.onSale) count++
        if (filters.inStock) count++
        if (filters.featured) count++
        if (filters.colors.length > 0) count++
        if (filters.sizes.length > 0) count++
        if (filters.materials.length > 0) count++
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < filterOptions.maxPrice) count++
        return count
    }

    // Filter component
    const FilterContent = () => (
        <div className="space-y-6">
            {/* Price Range */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-4">
                    <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => handleFilterChange("priceRange", value)}
                        max={filterOptions.maxPrice}
                        step={10}
                        className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}</span>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Quick Filters */}
            <div>
                <h3 className="font-semibold text-gray-900 mb-3">Quick Filters</h3>
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="onSale"
                            checked={filters.onSale}
                            onCheckedChange={(checked) => handleFilterChange("onSale", checked)}
                        />
                        <label htmlFor="onSale" className="text-sm text-gray-700">
                            On Sale
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="inStock"
                            checked={filters.inStock}
                            onCheckedChange={(checked) => handleFilterChange("inStock", checked)}
                        />
                        <label htmlFor="inStock" className="text-sm text-gray-700">
                            In Stock
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="featured"
                            checked={filters.featured}
                            onCheckedChange={(checked) => handleFilterChange("featured", checked)}
                        />
                        <label htmlFor="featured" className="text-sm text-gray-700">
                            Featured
                        </label>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Colors */}
            {filterOptions.colors.length > 0 && (
                <>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Colors</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {filterOptions.colors.map((color) => {
                                const variant = categoryProducts.flatMap((p) => p.variants || []).find((v) => v.color === color)
                                return (
                                    <div key={color} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`color-${color}`}
                                            checked={filters.colors.includes(color)}
                                            onCheckedChange={() => handleArrayFilterToggle("colors", color)}
                                        />
                                        <label htmlFor={`color-${color}`} className="flex items-center space-x-2 text-sm">
                                            <div
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{ backgroundColor: variant?.colorHex || "#000" }}
                                            />
                                            <span>{color}</span>
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <Separator />
                </>
            )}

            {/* Sizes */}
            {filterOptions.sizes.length > 0 && (
                <>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Sizes</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {filterOptions.sizes.map((size) => (
                                <div key={size} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`size-${size}`}
                                        checked={filters.sizes.includes(size)}
                                        onCheckedChange={() => handleArrayFilterToggle("sizes", size)}
                                    />
                                    <label htmlFor={`size-${size}`} className="text-sm">
                                        {size}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Separator />
                </>
            )}

            {/* Materials */}
            {filterOptions.materials.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Materials</h3>
                    <div className="space-y-2">
                        {filterOptions.materials.map((material) => (
                            <div key={material} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`material-${material}`}
                                    checked={filters.materials.includes(material)}
                                    onCheckedChange={() => handleArrayFilterToggle("materials", material)}
                                />
                                <label htmlFor={`material-${material}`} className="text-sm">
                                    {material}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

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
                    <span>Home</span>
                    <span>/</span>
                    <span className="text-gray-900 capitalize">{categoryName}</span>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 capitalize">{categoryName}'s Collection</h1>
                    <p className="text-gray-600">Discover our curated selection of premium {categoryName}'s fashion</p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar Filters */}
                    <motion.aside
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden lg:block w-80 flex-shrink-0"
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                                    {getActiveFiltersCount() > 0 && (
                                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                                            Clear All
                                        </Button>
                                    )}
                                </div>
                                <FilterContent />
                            </CardContent>
                        </Card>
                    </motion.aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
                        >
                            <div className="flex items-center space-x-4">
                                {/* Mobile Filter Button */}
                                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="lg:hidden bg-transparent">
                                            <SlidersHorizontal className="w-4 h-4 mr-2" />
                                            Filters
                                            {getActiveFiltersCount() > 0 && (
                                                <Badge className="ml-2 bg-gray-900 text-white">{getActiveFiltersCount()}</Badge>
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-80">
                                        <SheetHeader>
                                            <SheetTitle>Filters</SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-6">
                                            <FilterContent />
                                            {getActiveFiltersCount() > 0 && (
                                                <div className="mt-6 pt-6 border-t">
                                                    <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                                                        Clear All Filters
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                <div className="text-sm text-gray-600">
                                    {sortedProducts.length} of {categoryProducts.length} products
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Sort */}
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="featured">Featured</SelectItem>
                                        <SelectItem value="newest">Newest</SelectItem>
                                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                                        <SelectItem value="name">Name: A to Z</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* View Mode */}
                                <div className="hidden sm:flex items-center border rounded-lg">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <Grid className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Active Filters */}
                        {getActiveFiltersCount() > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-wrap items-center gap-2 mb-6"
                            >
                                <span className="text-sm text-gray-600">Active filters:</span>
                                {filters.onSale && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        On Sale
                                        <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange("onSale", false)} />
                                    </Badge>
                                )}
                                {filters.inStock && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        In Stock
                                        <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange("inStock", false)} />
                                    </Badge>
                                )}
                                {filters.featured && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        Featured
                                        <X className="w-3 h-3 cursor-pointer" onClick={() => handleFilterChange("featured", false)} />
                                    </Badge>
                                )}
                                {filters.colors.map((color) => (
                                    <Badge key={color} variant="secondary" className="flex items-center gap-1">
                                        {color}
                                        <X className="w-3 h-3 cursor-pointer" onClick={() => handleArrayFilterToggle("colors", color)} />
                                    </Badge>
                                ))}
                                {filters.sizes.map((size) => (
                                    <Badge key={size} variant="secondary" className="flex items-center gap-1">
                                        Size {size}
                                        <X className="w-3 h-3 cursor-pointer" onClick={() => handleArrayFilterToggle("sizes", size)} />
                                    </Badge>
                                ))}
                                {filters.materials.map((material) => (
                                    <Badge key={material} variant="secondary" className="flex items-center gap-1">
                                        {material}
                                        <X
                                            className="w-3 h-3 cursor-pointer"
                                            onClick={() => handleArrayFilterToggle("materials", material)}
                                        />
                                    </Badge>
                                ))}
                                {(filters.priceRange[0] > 0 || filters.priceRange[1] < filterOptions.maxPrice) && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        ${filters.priceRange[0]} - ${filters.priceRange[1]}
                                        <X
                                            className="w-3 h-3 cursor-pointer"
                                            onClick={() => handleFilterChange("priceRange", [0, filterOptions.maxPrice])}
                                        />
                                    </Badge>
                                )}
                            </motion.div>
                        )}

                        {/* Products Grid */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                            {sortedProducts.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-gray-400 mb-4">
                                        <Filter className="w-16 h-16 mx-auto" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                                    <p className="text-gray-600 mb-4">Try adjusting your filters to see more products</p>
                                    <Button onClick={clearFilters}>Clear All Filters</Button>
                                </div>
                            ) : (
                                <div
                                    className={
                                        viewMode === "grid"
                                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                            : "space-y-6"
                                    }
                                >
                                    {sortedProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            {viewMode === "grid" ? <ProductCard product={product} /> : <ProductListItem product={product} />}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

// List view component
function ProductListItem({ product }) {
    const getSalePercentage = () => {
        if (product.OriginalPrice && product.price && product.OriginalPrice > product.price) {
            return Math.round(((product.OriginalPrice - product.price) / product.OriginalPrice) * 100)
        }
        return 0
    }

    const salePercentage = getSalePercentage()

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
                <div className="flex">
                    <div className="relative w-48 h-48 flex-shrink-0">
                        <img
                            src={product.mainImageUrl || product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {(product.sale || salePercentage > 0) && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                                {salePercentage > 0 ? `-${salePercentage}%` : "Sale"}
                            </Badge>
                        )}
                    </div>
                    <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                            <div className="text-right">
                                <div className="flex items-center space-x-2">
                                    {product.OriginalPrice && product.OriginalPrice !== (product.discountPrice || product.price) && (
                                        <span className="text-gray-400 line-through">${product.OriginalPrice}</span>
                                    )}
                                    <span className="text-xl font-bold text-gray-900">${product.discountPrice || product.price}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Badge variant="outline">{product.category}</Badge>
                                {product.featured && <Badge variant="secondary">Featured</Badge>}
                                {product.variants && product.variants.length > 1 && (
                                    <div className="flex space-x-1">
                                        {product.variants.slice(0, 4).map((variant, index) => (
                                            <div
                                                key={index}
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{ backgroundColor: variant.colorHex }}
                                                title={variant.color}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Button>View Details</Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
