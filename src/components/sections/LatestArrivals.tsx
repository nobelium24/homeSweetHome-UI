// src/components/landing/LatestArrivals.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { productApi } from '@/lib/apiClient';
import { Product } from '@/types';

export default function LatestArrivals() {
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
                    // Fallback products
                    setProducts([
                        {
                            id: '1',
                            categoryId: '1',
                            name: 'Contemporary Sectional Sofa',
                            description: 'Modern L-shaped sofa with premium fabric',
                            colors: ['#1e293b', '#065f46'],
                            price: 1499.99,
                            quantity: 8,
                            images: [],
                        },
                        {
                            id: '2',
                            categoryId: '2',
                            name: 'Platform Bed Frame',
                            description: 'Low-profile bed with integrated storage',
                            colors: ['#44403c', '#78716c'],
                            price: 899.99,
                            quantity: 6,
                            images: [],
                        },
                        {
                            id: '3',
                            categoryId: '3',
                            name: 'Extendable Dining Table',
                            description: 'Solid wood table that seats 6-8 people',
                            colors: ['#92400e', '#1e293b'],
                            price: 799.99,
                            quantity: 4,
                            images: [],
                        },
                        {
                            id: '4',
                            categoryId: '4',
                            name: 'Modern Accent Chair',
                            description: 'Designer chair with ergonomic support',
                            colors: ['#0f766e', '#065f46'],
                            price: 349.99,
                            quantity: 10,
                            images: [],
                        },
                    ]);
                }
            } catch (error) {
                console.log('Error fetching products:', error);
                setProducts([
                    {
                        id: '1',
                        categoryId: '1',
                        name: 'Contemporary Sectional Sofa',
                        description: 'Modern L-shaped sofa with premium fabric',
                        colors: ['#1e293b', '#065f46'],
                        price: 1499.99,
                        quantity: 8,
                        images: [],
                    },
                    {
                        id: '2',
                        categoryId: '2',
                        name: 'Platform Bed Frame',
                        description: 'Low-profile bed with integrated storage',
                        colors: ['#44403c', '#78716c'],
                        price: 899.99,
                        quantity: 6,
                        images: [],
                    },
                    {
                        id: '3',
                        categoryId: '3',
                        name: 'Extendable Dining Table',
                        description: 'Solid wood table that seats 6-8 people',
                        colors: ['#92400e', '#1e293b'],
                        price: 799.99,
                        quantity: 4,
                        images: [],
                    },
                    {
                        id: '4',
                        categoryId: '4',
                        name: 'Modern Accent Chair',
                        description: 'Designer chair with ergonomic support',
                        colors: ['#0f766e', '#065f46'],
                        price: 349.99,
                        quantity: 10,
                        images: [],
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (isLoading) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Arrivals</h2>
                        <p className="text-gray-600">Discover our newest furniture</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Arrivals</h2>
                    <p className="text-gray-600">Just added to our collection</p>
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
                                    <span className="px-2 py-1 text-xs font-medium bg-emerald-600 text-white rounded">
                                        New
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    {product.description}
                                </p>
                            </div>

                            {/* Price and Add Button */}
                            <div className="flex items-center justify-between">
                                <div className="text-xl font-bold text-emerald-800">
                                    ${product.price}
                                </div>
                                <Button
                                    className="bg-emerald-800 hover:bg-emerald-900 text-white"
                                >
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Add to Cart
                                </Button>
                            </div>
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
                        <Link href="/shop/new-arrivals">
                            View All New Arrivals
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}