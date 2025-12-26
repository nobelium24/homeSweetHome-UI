// src/app/products/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronRight,
    Star,
    ShoppingBag,
    Heart,
    Share2,
    Truck,
    Shield,
    RefreshCw,
    Check,
    Plus,
    Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { productApi } from '@/lib/apiClient';
import { Product } from '@/types';

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const data = await productApi.getOne(productId);
                const productData = data.product || data.product;
                setProduct(productData);

                if (productData.colors && productData.colors.length > 0) {
                    setSelectedColor(productData.colors[0]);
                }
            } catch (error) {
                console.log('Error fetching product:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleAddToCart = () => {
        if (!product) return;

        // Implement cart logic here
        console.log('Adding to cart:', {
            productId: product.id,
            name: product.name,
            price: product.price,
            color: selectedColor,
            quantity
        });
    };

    const handleIncrement = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-12">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="h-96 bg-gray-200 rounded-xl"></div>
                            <div className="space-y-6">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product not found</h2>
                    <Link href="/">
                        <Button>Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 py-6">
                <nav className="flex items-center space-x-2 text-sm">
                    <Link href="/" className="text-gray-600 hover:text-emerald-700">Home</Link>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <Link href="/categories" className="text-gray-600 hover:text-emerald-700">Categories</Link>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    {product.categoryId && (
                        <>
                            <Link
                                href={`/categories/${product.categoryId}`}
                                className="text-gray-600 hover:text-emerald-700"
                            >
                                Category
                            </Link>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        </>
                    )}
                    <span className="text-gray-900">{product.name}</span>
                </nav>
            </div>

            {/* Product Details */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div>
                        {/* Main Image */}
                        <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
                            <div className="relative h-96 bg-gradient-to-br from-gray-50 to-emerald-50 rounded-xl overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-64 w-64 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200"></div>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        {product.images && product.images.length > 0 ? (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.slice(0, 4).map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`bg-white rounded-lg p-2 border-2 transition-all ${activeImageIndex === index ? 'border-emerald-600' : 'border-gray-200 hover:border-emerald-400'
                                            }`}
                                    >
                                        <div className="h-20 bg-gradient-to-br from-gray-50 to-emerald-50 rounded"></div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-white rounded-lg p-2 border-2 border-gray-200">
                                        <div className="h-20 bg-gradient-to-br from-gray-50 to-emerald-50 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="bg-white rounded-2xl p-8 shadow-sm">
                            {/* Title and Rating */}
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        <Star className="h-5 w-5 fill-gray-300 text-gray-300" />
                                        <span className="ml-2 text-sm text-gray-600">4.8 (24 reviews)</span>
                                    </div>
                                    {product.quantity && product.quantity < 10 && (
                                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                            Only {product.quantity} left
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="text-4xl font-bold text-emerald-800">${product.price}</div>
                                {product.quantity && (
                                    <div className="text-sm text-gray-600 mt-2">
                                        In Stock: {product.quantity} units available
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Colors */}
                            {product.colors && product.colors.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="font-semibold text-gray-900 mb-3">Choose Color</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {product.colors.map((color, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedColor(color)}
                                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${selectedColor === color
                                                    ? 'border-emerald-600 bg-emerald-50'
                                                    : 'border-gray-300 hover:border-emerald-400'
                                                    }`}
                                            >
                                                <div
                                                    className="h-6 w-6 rounded-full"
                                                    style={{ backgroundColor: color }}
                                                />
                                                <span className="text-sm font-medium">
                                                    {selectedColor === color && <Check className="h-4 w-4 inline mr-1" />}
                                                    Color {index + 1}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={handleDecrement}
                                            className="h-12 w-12 flex items-center justify-center text-gray-600 hover:text-emerald-700"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="h-12 w-16 flex items-center justify-center font-semibold">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={handleIncrement}
                                            className="h-12 w-12 flex items-center justify-center text-gray-600 hover:text-emerald-700"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {product.quantity && quantity > product.quantity && (
                                            <span className="text-red-600">Exceeds available stock</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-4">
                                <Button
                                    size="lg"
                                    className="w-full h-14 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white shadow-lg"
                                    onClick={handleAddToCart}
                                    disabled={product.quantity !== undefined && quantity > product.quantity}
                                >
                                    <ShoppingBag className="h-5 w-5 mr-2" />
                                    Add to Cart
                                </Button>

                                <div className="flex space-x-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12"
                                    >
                                        <Heart className="h-4 w-4 mr-2" />
                                        Wishlist
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12"
                                    >
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                    </Button>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-8 pt-8 border-t">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <Truck className="h-5 w-5 text-emerald-700" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">Free Shipping</div>
                                            <div className="text-xs text-gray-600">Over $500</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <Shield className="h-5 w-5 text-emerald-700" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">2-Year Warranty</div>
                                            <div className="text-xs text-gray-600">Quality Guaranteed</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <RefreshCw className="h-5 w-5 text-emerald-700" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">14-Day Returns</div>
                                            <div className="text-xs text-gray-600">Easy Returns</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <Check className="h-5 w-5 text-emerald-700" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">Premium Quality</div>
                                            <div className="text-xs text-gray-600">Handcrafted</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}