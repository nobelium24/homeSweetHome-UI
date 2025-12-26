// src/app/categories/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronRight,
    Grid,
    List,
    Filter,
    Star,
    ShoppingBag,
    Heart,
    Eye,
    ChevronLeft,
    ChevronDown,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { categoryApi, productApi } from '@/lib/apiClient';
import { Category, Product } from '@/types';

export default function CategoryProductsPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const categoryId = params.id as string;

    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const categoryData = await categoryApi.getById(categoryId);
                setCategory(categoryData);

                const productsData = await productApi.getByCategory(categoryId, 50, 0);
                const products = productsData.products || productsData.products || [];
                setProducts(products);
                setFilteredProducts(products);

                if (products.length > 0) {
                    const prices = products.map(p => p.price);
                    const maxPrice = Math.max(...prices);
                    setPriceRange([0, Math.ceil(maxPrice / 100) * 100]);
                }
            } catch (error) {
                console.log('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (categoryId) {
            fetchData();
        }
    }, [categoryId]);

    const allColors = [...new Set(products.flatMap(p => p.colors || []))];

    // Apply filters
    useEffect(() => {
        let filtered = [...products];

        // Filter by color
        if (selectedColor) {
            filtered = filtered.filter(p =>
                p.colors && p.colors.includes(selectedColor)
            );
        }

        // Filter by price range
        filtered = filtered.filter(p =>
            p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        // Sort products
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'popular':
                    // Assuming popularity based on quantity sold (you might need to add this field)
                    return (b.quantity || 0) - (a.quantity || 0);
                case 'newest':
                default:
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            }
        });

        setFilteredProducts(filtered);
    }, [selectedColor, priceRange, sortBy, products]);

    const handlePriceChange = (min: number, max: number) => {
        setPriceRange([min, max]);
    };

    const clearFilters = () => {
        setSelectedColor(null);
        setPriceRange([0, 5000]);
        setSortBy('newest');
    };

    const handleAddToCart = (product: Product) => {
        // Implement cart logic here
        console.log('Adding to cart:', product);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-12">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            <div className="lg:col-span-1">
                                <div className="h-64 bg-gray-200 rounded-xl mb-4"></div>
                            </div>
                            <div className="lg:col-span-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="bg-white rounded-xl p-4">
                                            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Category not found</h2>
                    <Link href="/categories">
                        <Button>Browse All Categories</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-emerald-900 text-white">
                <div className="container mx-auto px-4 py-12">
                    <nav className="flex items-center space-x-2 text-sm mb-6">
                        <Link href="/" className="text-emerald-200 hover:text-white">Home</Link>
                        <ChevronRight className="h-4 w-4 text-emerald-300" />
                        <Link href="/categories" className="text-emerald-200 hover:text-white">Categories</Link>
                        <ChevronRight className="h-4 w-4 text-emerald-300" />
                        <span className="text-white">{category.name}</span>
                    </nav>

                    <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
                    <p className="text-emerald-100 max-w-2xl">
                        {category.description}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="lg:sticky lg:top-24">
                            {/* Mobile Filters Toggle */}
                            <Button
                                variant="outline"
                                className="w-full mb-4 lg:hidden"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                                {showFilters ? (
                                    <ChevronDown className="h-4 w-4 ml-auto rotate-180" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 ml-auto" />
                                )}
                            </Button>

                            {/* Filters Container */}
                            <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white rounded-xl p-6 shadow-sm`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-semibold text-gray-900">Filters</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="text-sm text-gray-600 hover:text-emerald-700"
                                    >
                                        Clear All
                                    </Button>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-4">Price Range</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">${priceRange[0]}</span>
                                            <span className="text-sm text-gray-600">${priceRange[1]}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max={priceRange[1]}
                                            value={priceRange[0]}
                                            onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
                                            className="w-full"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max={priceRange[1]}
                                            value={priceRange[1]}
                                            onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {/* Colors */}
                                {allColors.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-900 mb-4">Colors</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {allColors.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                                                    className={`h-8 w-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-emerald-600 scale-110' : 'border-gray-300'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Active Filters */}
                                {(selectedColor || priceRange[0] > 0 || priceRange[1] < 5000) && (
                                    <div className="pt-6 border-t">
                                        <h4 className="font-medium text-gray-900 mb-3">Active Filters</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedColor && (
                                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                                    Color
                                                    <button
                                                        onClick={() => setSelectedColor(null)}
                                                        className="ml-2 hover:text-emerald-900"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            )}
                                            {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                                    ${priceRange[0]} - ${priceRange[1]}
                                                    <button
                                                        onClick={() => setPriceRange([0, 5000])}
                                                        className="ml-2 hover:text-emerald-900"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="lg:w-3/4">
                        {/* Products Header */}
                        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        {filteredProducts.length} products found
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Showing products in {category.name}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-4">
                                    {/* Sort By */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="popular">Most Popular</option>
                                    </select>

                                    {/* View Mode */}
                                    <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                                        <Button
                                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                            size="sm"
                                            className={`h-9 px-3 rounded-none ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : ''}`}
                                            onClick={() => setViewMode('grid')}
                                        >
                                            <Grid className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                                            size="sm"
                                            className={`h-9 px-3 rounded-none ${viewMode === 'list' ? 'bg-emerald-600 text-white' : ''}`}
                                            onClick={() => setViewMode('list')}
                                        >
                                            <List className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid/List */}
                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl">
                                <div className="text-gray-400 mb-4">No products found</div>
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredProducts.map((product) => (
                                    <ProductListItem key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        {/* Pagination - You can implement proper pagination here */}
                        {filteredProducts.length > 0 && (
                            <div className="flex justify-center mt-12">
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm" disabled>
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                        1
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        2
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        3
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Product Card Component for Grid View
function ProductCard({ product }: { product: Product }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image */}
            <div className="relative h-64 bg-gradient-to-br from-gray-50 to-emerald-50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-48 w-48 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 group-hover:scale-105 transition-transform duration-300"></div>
                </div>

                {/* Quick Actions */}
                <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}>
                    <Button size="icon" variant="ghost" className="h-8 w-8 bg-white/90 backdrop-blur-sm">
                        <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 bg-white/90 backdrop-blur-sm">
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                    <div className="absolute bottom-4 left-4 flex space-x-1">
                        {product.colors.slice(0, 3).map((color, i) => (
                            <div
                                key={i}
                                className="h-4 w-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                        {product.colors.length > 3 && (
                            <span className="text-xs text-gray-600 bg-white/80 px-1 rounded">
                                +{product.colors.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <Link href={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-800 transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-emerald-800">
                        ${product.price}
                    </div>
                    <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">4.8</span>
                    </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                    className="w-full mt-4 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white"
                    onClick={() => console.log('Add to cart:', product)}
                >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                </Button>
            </div>
        </div>
    );
}

// Product List Item Component for List View
function ProductListItem({ product }: { product: Product }) {
    return (
        <div className="group bg-white rounded-xl p-6 hover:shadow-md transition-all duration-300 border border-transparent hover:border-emerald-200">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Image */}
                <div className="md:w-1/4">
                    <div className="relative h-48 md:h-32 bg-gradient-to-br from-gray-50 to-emerald-50 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-32 w-32 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200"></div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="md:w-3/4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                            <Link href={`/products/${product.id}`}>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-800 transition-colors">
                                    {product.name}
                                </h3>
                            </Link>
                            <p className="text-gray-600 mb-4">
                                {product.description}
                            </p>

                            {/* Colors */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="flex items-center space-x-2 mb-4">
                                    <span className="text-sm text-gray-600">Colors:</span>
                                    <div className="flex space-x-1">
                                        {product.colors.slice(0, 5).map((color, i) => (
                                            <div
                                                key={i}
                                                className="h-4 w-4 rounded-full border border-gray-300"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="text-2xl font-bold text-emerald-800 mb-2">
                                ${product.price}
                            </div>
                            <div className="flex items-center space-x-1 mb-4">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-gray-600">4.8</span>
                            </div>
                            <Button
                                className="bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white"
                                onClick={() => console.log('Add to cart:', product)}
                            >
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}