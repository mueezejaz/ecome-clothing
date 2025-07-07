"use client"

import { useState, useMemo, useEffect, use } from "react"
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
import { notFound } from "next/navigation"
import ProductCardSkeleton from "@/app/components/ProductCardSkeleton" // For loading state
import Link from "next/link"
import axiosInstance from "@/app/config/axios"
import { toast } from "sonner"
const VALID_CATEGORIES = ["women", "men", "children"]

export default function CategoryPage({ params }) {
    const resolvedParams = use(params)
    const categoryName = resolvedParams.category ? resolvedParams.category.toLowerCase() : "";

    if (!VALID_CATEGORIES.includes(categoryName) && categoryName !== "") {
        notFound();
    }

    const [productsOnPage, setProductsOnPage] = useState([])
    const [filterOptions, setFilterOptions] = useState({
        maxPrice: 500, // Initial default
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false); // For filter changes after initial load
    const [fetchError, setFetchError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const itemsPerPage = 12; // Or get from API if configurable

    const [filters, setFilters] = useState({
        priceRange: [0, 300], // Default, will update based on fetched filterOptions
        onSale: false,
        featured: false,
    })

    const [sortBy, setSortBy] = useState("featured")
    const [viewMode, setViewMode] = useState("grid")
    const [isFilterOpen, setIsFilterOpen] = useState(false)


    // Fetch initial filter options (colors, sizes, materials, maxPrice)
    // useEffect(() => {
    //     if (categoryName && VALID_CATEGORIES.includes(categoryName)) {
    //         const fetchFilterOptions = async () => {
    //             try {
    //                 // Fetch all products for the category *without* pagination/filters
    //                 // to determine all available options.
    //                 // NOTE: This can be inefficient for very large categories.
    //                 // A better approach for large datasets is a dedicated API endpoint 
    //                 // that returns distinct filter values.
    //                 const response = await fetch(`/api/category/${categoryName}?limit=10000`); // Fetch a large number
    //                 if (!response.ok) throw new Error('Failed to fetch initial product data for filters');
    //                 const data = await response.json();
    //                 const allCategoryProducts = data.data || [];

    //                 // const colors = new Set(); // Removed
    //                 // const sizes = new Set(); // Removed
    //                 // const materials = new Set(); // Removed
    //                 let maxPrice = 0;

    //                 allCategoryProducts.forEach((product) => {
    //                     const price = product.discountPrice || product.price;
    //                     if (price > maxPrice) maxPrice = price + 10;
    //                     // product.variants?.forEach((variant) => { // Removed
    //                     //     if (variant.color) colors.add(variant.color); // Removed
    //                     //     variant.size?.forEach((s) => sizes.add(s)); // Removed
    //                     // }); // Removed
    //                     // if (product.material) materials.add(product.material); // Removed
    //                 });

    //                 const calculatedMaxPrice = Math.ceil(maxPrice) || 500;
    //                 setFilterOptions({
    //                     // colors: Array.from(colors).sort(), // Removed
    //                     // sizes: Array.from(sizes).sort(), // Removed
    //                     // materials: Array.from(materials).sort(), // Removed
    //                     maxPrice: calculatedMaxPrice,
    //                 });
    //                 // Set initial price range filter based on actual max price
    //                 setFilters(prev => ({ ...prev, priceRange: [0, calculatedMaxPrice] }));
    //             } catch (error) {
    //                 console.error("Error fetching filter options:", error);
    //                 // Keep default filter options or handle error appropriately
    //             }
    //         };
    //         fetchFilterOptions();
    //     }
    // }, [categoryName]);


    // Fetch products based on category, filters, sorting, and pagination
    useEffect(() => {
        if (categoryName && VALID_CATEGORIES.includes(categoryName)) {
            const fetchProducts = async () => {
                if (currentPage === 1 && !isUpdating) setIsLoading(true); else setIsUpdating(true);
                setFetchError(null);

                const params = new URLSearchParams({
                    page: currentPage,
                    limit: itemsPerPage,
                    sortBy: sortBy,
                    priceMin: filters.priceRange[0],
                    priceMax: filters.priceRange[1],
                });

                if (filters.onSale) params.append('onSale', 'true');
                if (filters.featured) params.append('featured', 'true');

                try {
                    const response = await axiosInstance(`/api/category/${categoryName}?${params.toString()}`);
                    if (!response.data?.data) {
                        toast.error(`Failed to fetch products for ${categoryName}`)
                        throw new Error(`Failed to fetch products for ${categoryName}`);
                    }
                    setProductsOnPage(response.data?.data || []);
                    setTotalPages(response.data?.totalPages || 0);
                    setTotalProducts(response.data?.totalProducts || 0);
                } catch (error) {
                    const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred.";
                    console.error("Error fetching products:", error);
                    toast.error(errorMessage);
                    setFetchError(errorMessage);
                    setProductsOnPage([]);
                    setTotalPages(0);
                    setTotalProducts(0);
                } finally {
                    setIsLoading(false);
                    setIsUpdating(false);
                }
            };
            fetchProducts();
        } else if (categoryName !== "") {
            setIsLoading(false);
            setIsUpdating(false);
        }
    }, [categoryName, filters, sortBy, currentPage, itemsPerPage]);

    // No client-side filtering or sorting needed anymore as server handles it.
    // const filteredProducts = useMemo(...); -> REMOVE
    // const sortedProducts = useMemo(...); -> REMOVE
    // `productsOnPage` is now the source of truth for display.

    // Filter handlers
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setCurrentPage(1); // Reset to page 1 on filter change
        setFilters(newFilters);
    }

    const handleArrayFilterToggle = (key, value) => {
        const currentArray = filters[key];
        const newArray = currentArray.includes(value)
            ? currentArray.filter((item) => item !== value)
            : [...currentArray, value];
        const newFilters = { ...filters, [key]: newArray };
        setCurrentPage(1); // Reset to page 1 on filter change
        setFilters(newFilters);
    }

    const clearFilters = () => {
        setFilters({
            priceRange: [0, filterOptions.maxPrice], // Reset price range to full
            onSale: false,
            // colors: [], // Removed
            // sizes: [], // Removed
            // materials: [], // Removed
            featured: false,
        });
        setCurrentPage(1); // Reset page
    }

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.onSale) count++;
        if (filters.featured) count++;
        // Removed counts for colors, sizes, materials
        if (filterOptions.maxPrice > 0 && //Ensure maxPrice is loaded
            (filters.priceRange[0] > 0 || filters.priceRange[1] < filterOptions.maxPrice)) {
            count++;
        }
        return count;
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

            {/* Colors, Sizes, Materials sections are removed */}
            {/* The empty space will naturally be handled by flex layout or lack of these elements */}
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
                                    {(isLoading || isUpdating)
                                        ? "Loading..."
                                        : `${productsOnPage.length > 0 ? ((currentPage - 1) * itemsPerPage + 1) + '-' + Math.min(currentPage * itemsPerPage, totalProducts) : 0} of ${totalProducts} products`}
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Sort */}
                                <Select value={sortBy} onValueChange={(value) => { setCurrentPage(1); setSortBy(value); }}>
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
                                {/* Removed map for filters.colors */}
                                {/* Removed map for filters.sizes */}
                                {/* Removed map for filters.materials */}
                                {filterOptions.maxPrice > 0 && (filters.priceRange[0] > 0 || filters.priceRange[1] < filterOptions.maxPrice) && (
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
                            {(isLoading || (isUpdating && productsOnPage.length === 0)) && ( // Show skeleton if initial load or updating and no products yet
                                        <ProductCardSkeleton/>
                            )}
                            {!isLoading && !isUpdating && fetchError && (
                                <div className="text-center py-16 text-red-500">
                                    <X className="w-16 h-16 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">Error loading products</h3>
                                    <p>{fetchError}</p>
                                    <Button onClick={() => { /* Implement refetch or clear error */ }} className="mt-4">
                                        Try Again
                                    </Button>
                                </div>
                            )}
                            {!isLoading && !isUpdating && !fetchError && productsOnPage.length === 0 && (
                                <div className="text-center py-16">
                                    <div className="text-gray-400 mb-4">
                                        <Filter className="w-16 h-16 mx-auto" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                                    <p className="text-gray-600 mb-4">
                                        Try adjusting your filters or check back later.
                                    </p>
                                    {getActiveFiltersCount() > 0 && (
                                        <Button onClick={clearFilters}>Clear All Filters</Button>
                                    )}
                                </div>
                            )}
                            {(!isUpdating || productsOnPage.length > 0) && !fetchError && productsOnPage.length > 0 && ( // Show products if not updating or if updating but products exist
                                <div
                                    className={
                                        viewMode === "grid"
                                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                            : "space-y-6"
                                    }
                                >
                                    {productsOnPage.map((product, index) => (
                                        <motion.div
                                            key={product._id || product.id}
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

                        {/* Pagination Controls */}
                        {!isLoading && !fetchError && totalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                                className="flex justify-center items-center space-x-4 mt-12 py-4">
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1 || isUpdating}
                                    variant="outline"
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <Button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages || isUpdating}
                                    variant="outline"
                                >
                                    Next
                                </Button>
                            </motion.div>
                        )}
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
        if (product.discountPrice && product.price && product.price > product.discountPrice) {
            return Math.round(((product.price - product.discountPrice) / product.price) * 100)
        }
        return 0
    }

    const salePercentage = getSalePercentage()

    return (
        <Link href={`/product/${product._id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                    <div className="flex">
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <img
                                src={product.mainImage.imageUrl}
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
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}


