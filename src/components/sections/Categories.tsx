// src/components/landing/CategoriesSection.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Sofa, Bed, UtensilsCrossed, Table, Armchair, Lamp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categoryApi } from '@/lib/apiClient';
import { Category } from '@/types';

// Map category names to icons
const categoryIcons: Record<string, React.ReactNode> = {
    'living room': <Sofa className="h-8 w-8" />,
    'bedroom': <Bed className="h-8 w-8" />,
    'dining': <UtensilsCrossed className="h-8 w-8" />,
    'office': <Table className="h-8 w-8" />,
    'outdoor': <Armchair className="h-8 w-8" />,
    'lighting': <Lamp className="h-8 w-8" />,
};

// Category color mapping
const categoryColors: Record<string, { bg: string; text: string; hover: string }> = {
    'living room': { bg: 'bg-emerald-50', text: 'text-emerald-700', hover: 'hover:bg-emerald-100' },
    'bedroom': { bg: 'bg-blue-50', text: 'text-blue-700', hover: 'hover:bg-blue-100' },
    'dining': { bg: 'bg-amber-50', text: 'text-amber-700', hover: 'hover:bg-amber-100' },
    'office': { bg: 'bg-gray-50', text: 'text-gray-700', hover: 'hover:bg-gray-100' },
    'outdoor': { bg: 'bg-green-50', text: 'text-green-700', hover: 'hover:bg-green-100' },
    'lighting': { bg: 'bg-purple-50', text: 'text-purple-700', hover: 'hover:bg-purple-100' },
};

// Fallback categories if API fails
export const fallbackCategories: Category[] = [
    {
        id: '1',
        name: 'Living Room',
        description: 'Sofas, sectionals, chairs, coffee tables & entertainment units for your living space'
    },
    {
        id: '2',
        name: 'Bedroom',
        description: 'Beds, nightstands, dressers, wardrobes & bedroom sets for restful nights'
    },
    {
        id: '3',
        name: 'Dining',
        description: 'Dining tables, chairs, buffets & dining sets for memorable meals'
    },
    {
        id: '4',
        name: 'Office',
        description: 'Desks, office chairs, bookshelves & workspace solutions for productivity'
    },
    {
        id: '5',
        name: 'Outdoor',
        description: 'Patio furniture, garden sets & outdoor decor for your exterior spaces'
    },
    {
        id: '6',
        name: 'Lighting',
        description: 'Floor lamps, table lamps, pendant lights & lighting fixtures for ambiance'
    },
];

export default function CategoriesSection() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const response = await categoryApi.getAll();

                if (response && response.length > 0) {
                    setCategories(response);
                } else {
                    setCategories(fallbackCategories);
                }
            } catch (error) {
                console.log('Error fetching categories:', error);
                setCategories(fallbackCategories);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Get category icon
    const getCategoryIcon = (categoryName: string) => {
        const lowerName = categoryName.toLowerCase();
        for (const [key, icon] of Object.entries(categoryIcons)) {
            if (lowerName.includes(key)) {
                return icon;
            }
        }
        return <Sofa className="h-8 w-8" />; // Default icon
    };

    // Get category color
    const getCategoryColor = (categoryName: string) => {
        const lowerName = categoryName.toLowerCase();
        for (const [key, color] of Object.entries(categoryColors)) {
            if (lowerName.includes(key)) {
                return color;
            }
        }
        return categoryColors['living room']; // Default color
    };

    if (isLoading) {
        return (
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover furniture curated for every room in your home
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-64 rounded-2xl bg-gray-200 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-4">
                        <span className="text-sm font-medium text-emerald-700">Collections</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Explore by <span className="text-emerald-800">Category</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Browse our carefully curated furniture collections designed to transform
                        every room in your home into a space of comfort and style.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
                    {categories.slice(0, 6).map((category) => {
                        const color = getCategoryColor(category.name);
                        const icon = getCategoryIcon(category.name);

                        return (
                            <Link
                                key={category.id}
                                href={`/shop/category/${category.id}`}
                                className="group block"
                                onMouseEnter={() => setActiveCategory(category.id)}
                                onMouseLeave={() => setActiveCategory(null)}
                            >
                                <div className={`
                                    relative overflow-hidden rounded-2xl border-2 border-transparent 
                                    transition-all duration-500 h-full
                                    ${color.bg} ${color.hover}
                                    group-hover:border-emerald-300 group-hover:shadow-2xl
                                    ${activeCategory === category.id ? 'scale-[1.02]' : ''}
                                `}>
                                    {/* Category Card */}
                                    <div className="p-8 h-full flex flex-col">
                                        {/* Icon */}
                                        <div className={`
                                            h-16 w-16 rounded-xl mb-6 flex items-center justify-center
                                            transition-transform duration-300
                                            ${color.bg.replace('50', '100')}
                                            group-hover:scale-110 group-hover:rotate-3
                                        `}>
                                            <div className={color.text}>
                                                {icon}
                                            </div>
                                        </div>

                                        {/* Category Name */}
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-800 transition-colors">
                                            {category.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                                            {category.description}
                                        </p>

                                        {/* CTA */}
                                        <div className="flex items-center justify-between">
                                            <span className={`
                                                text-sm font-semibold ${color.text} 
                                                flex items-center space-x-1
                                            `}>
                                                <span>Explore Collection</span>
                                                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </span>

                                            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/80 text-gray-700">
                                                {category.name === 'Living Room' ? '12 items' :
                                                    category.name === 'Bedroom' ? '8 items' :
                                                        category.name === 'Dining' ? '6 items' :
                                                            category.name === 'Office' ? '9 items' :
                                                                category.name === 'Outdoor' ? '7 items' :
                                                                    '5 items'}
                                            </span>
                                        </div>

                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 right-0 h-32 w-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                                            <div className={color.bg.replace('50', '300')} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Button
                        size="lg"
                        className="h-14 px-10 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                        asChild
                    >
                        <Link href="/shop">
                            <span className="text-lg font-medium">View All Categories</span>
                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>

                    {/* Stats */}
                    <div className="mt-12 pt-12 border-t">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-800 mb-2">200+</div>
                                <div className="text-sm text-gray-600">Products</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-800 mb-2">6</div>
                                <div className="text-sm text-gray-600">Categories</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-800 mb-2">50+</div>
                                <div className="text-sm text-gray-600">Designs</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-800 mb-2">5K+</div>
                                <div className="text-sm text-gray-600">Happy Customers</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Category Highlight */}
                {categories.length > 0 && (
                    <div className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-emerald-900 to-emerald-800 text-white overflow-hidden">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-800/30 border border-emerald-700 mb-4">
                                    <span className="text-sm font-medium">Featured Collection</span>
                                </div>
                                <h3 className="text-3xl font-bold mb-4">
                                    {categories[0]?.name} Collection
                                </h3>
                                <p className="text-emerald-100 mb-6 leading-relaxed">
                                    Discover our premium {categories[0]?.name.toLowerCase()} furniture,
                                    crafted with attention to detail and designed for lasting comfort.
                                </p>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="bg-white text-emerald-900 hover:bg-emerald-50"
                                    asChild
                                >
                                    <Link href={`/shop/category/${categories[0]?.id}`}>
                                        Shop Now
                                    </Link>
                                </Button>
                            </div>
                            <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="h-40 w-40 mx-auto rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6">
                                            {getCategoryIcon(categories[0]?.name || '')}
                                        </div>
                                        <p className="text-lg font-semibold">
                                            Premium Quality
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}