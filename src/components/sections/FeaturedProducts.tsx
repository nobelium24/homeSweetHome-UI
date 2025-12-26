// src/components/landing/FeaturedProducts.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { productApi } from '@/lib/apiClient';
import { Product } from '@/types';

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await productApi.getAll(4, 0);

                if (response.data && response.data.products.length > 0) {
                    setProducts(response.data.products);
                } else {
                    setProducts([
                        {
                            id: '1',
                            categoryId: '1',
                            name: 'Modern Velvet Sofa',
                            description: '3-seater luxury sofa with velvet upholstery',
                            colors: ['#065f46', '#1e293b'],
                            price: 1299.99,
                            quantity: 5,
                            images: [],
                        },
                        {
                            id: '2',
                            categoryId: '2',
                            name: 'Minimalist Bed Frame',
                            description: 'King size wooden bed with clean lines',
                            colors: ['#1e293b', '#44403c'],
                            price: 1899.99,
                            quantity: 3,
                            images: [],
                        },
                        {
                            id: '3',
                            categoryId: '3',
                            name: 'Marble Dining Table',
                            description: '6-seater dining table with marble top',
                            colors: ['#ffffff', '#f5f5f4'],
                            price: 2499.99,
                            quantity: 2,
                            images: [],
                        },
                        {
                            id: '4',
                            categoryId: '4',
                            name: 'Ergonomic Office Chair',
                            description: 'Adjustable office chair with lumbar support',
                            colors: ['#065f46', '#0f766e'],
                            price: 499.99,
                            quantity: 15,
                            images: [],
                        },
                    ]);
                }
            } catch (error) {
                console.log('Error fetching products:', error);

                //Fallback 
                setProducts([
                    {
                        id: '1',
                        categoryId: '1',
                        name: 'Modern Velvet Sofa',
                        description: '3-seater luxury sofa with velvet upholstery',
                        colors: ['#065f46', '#1e293b'],
                        price: 1299.99,
                        quantity: 5,
                        images: [],
                    },
                    {
                        id: '2',
                        categoryId: '2',
                        name: 'Minimalist Bed Frame',
                        description: 'King size wooden bed with clean lines',
                        colors: ['#1e293b', '#44403c'],
                        price: 1899.99,
                        quantity: 3,
                        images: [],
                    },
                    {
                        id: '3',
                        categoryId: '3',
                        name: 'Marble Dining Table',
                        description: '6-seater dining table with marble top',
                        colors: ['#ffffff', '#f5f5f4'],
                        price: 2499.99,
                        quantity: 2,
                        images: [],
                    },
                    {
                        id: '4',
                        categoryId: '4',
                        name: 'Ergonomic Office Chair',
                        description: 'Adjustable office chair with lumbar support',
                        colors: ['#065f46', '#0f766e'],
                        price: 499.99,
                        quantity: 15,
                        images: [],
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    if (isLoading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
                        <p className="text-gray-600">Our best selling furniture</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="h-48 bg-gray-100 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
                    <p className="text-gray-600">Our best selling furniture</p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            {/* Product Header */}
                            <div className="mb-4">
                                <div className="flex items-start justify-between">
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        <Link href={`/product/${product.id}`} className="hover:text-emerald-800">
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded">
                                        Featured
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    {product.description}
                                </p>
                            </div>

                            {/* Price and Rating */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-xl font-bold text-emerald-800">
                                    ${product.price}
                                </div>
                                <div className="flex items-center space-x-1">
                                    {renderStars(4)}
                                    <span className="text-xs text-gray-500">(24)</span>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <Button className="w-full bg-emerald-800 hover:bg-emerald-900 text-white">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Add to Cart
                            </Button>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Button
                        variant="outline"
                        className="border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                        asChild
                    >
                        <Link href="/shop">
                            View All Products
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}