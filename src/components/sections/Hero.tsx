// src/components/landing/Hero.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, RefreshCw, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categoryApi } from '@/lib/apiClient';
import { Category } from '@/types';

interface HeroSlide {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
}

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);

    const heroSlides: HeroSlide[] = [
        {
            id: '1',
            title: 'Modern Furniture for Your Home',
            description: 'Discover premium furniture that combines comfort, style, and quality craftsmanship.',
            imageUrl: '/api/placeholder/1200/800',
            ctaText: 'Shop Now',
            ctaLink: '/shop',
        },
        {
            id: '2',
            title: 'Create Your Dream Space',
            description: 'Transform any room with our carefully curated furniture collections.',
            imageUrl: '/api/placeholder/1200/800',
            ctaText: 'Explore Collections',
            ctaLink: '/collections',
        },
    ];

    // Fallback categories
    const fallbackCategories: Category[] = [
        { id: '1', name: 'Living Room', description: 'Sofas & Chairs' },
        { id: '2', name: 'Bedroom', description: 'Beds & Wardrobes' },
        { id: '3', name: 'Dining', description: 'Tables & Chairs' },
        { id: '4', name: 'Office', description: 'Desks & Chairs' },
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryApi.getAll();
                setCategories(response || []);
            } catch (error) {
                console.log('Error fetching categories:', error);
                setCategories(fallbackCategories);
            }
        };

        fetchCategories();
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    const currentSlideData = heroSlides[currentSlide];

    return (
        <section className="bg-white overflow-hidden">
            <div className="relative">
                {/* Hero Content - Reversed order for mobile */}
                <div className="container mx-auto px-4 py-6 lg:py-16">
                    {/* For mobile: Image first, then content */}
                    <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:gap-12">
                        {/* Content Column - On desktop: left, On mobile: after image */}
                        <div className="lg:w-1/2 mt-8 lg:mt-0">
                            <div className="space-y-6">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                    {currentSlideData.title}
                                </h1>

                                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                                    {currentSlideData.description}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        size="lg"
                                        className="h-12 sm:h-14 bg-emerald-800 hover:bg-emerald-900 text-white shadow-md hover:shadow-lg transition-all"
                                        asChild
                                    >
                                        <Link href={currentSlideData.ctaLink} className="flex items-center justify-center">
                                            <span className="text-base sm:text-lg font-medium">{currentSlideData.ctaText}</span>
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>

                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-12 sm:h-14 border-gray-300 hover:border-emerald-400 hover:bg-emerald-50"
                                        asChild
                                    >
                                        <Link href="/shop">
                                            <span className="text-base sm:text-lg">Browse All</span>
                                        </Link>
                                    </Button>
                                </div>

                                {/* Quick Categories */}
                                {categories.length > 0 && (
                                    <div className="pt-8 lg:pt-10">
                                        <p className="text-sm font-medium text-gray-700 mb-3">Shop by category:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.slice(0, 4).map((category) => (
                                                <Link
                                                    key={category.id}
                                                    href={`/shop/category/${category.id}`}
                                                    className="px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 text-sm font-medium transition-all duration-200 border border-transparent hover:border-emerald-200"
                                                >
                                                    {category.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Image Column - On mobile: first, On desktop: right */}
                        <div className="lg:w-1/2">
                            <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[450px] rounded-xl lg:rounded-2xl overflow-hidden shadow-lg lg:shadow-xl">
                                {/* Simple Image Container */}
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/80 to-emerald-200/60">
                                    {/* Subtle Grid Pattern */}
                                    <div className="absolute inset-0 grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:gap-4 sm:p-4">
                                        {[...Array(6)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="bg-white/30 backdrop-blur-sm rounded"
                                            />
                                        ))}
                                    </div>

                                    {/* Center Furniture Visualization */}
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                        <div className="relative w-full max-w-xs sm:max-w-sm">
                                            {/* Main Furniture Piece */}
                                            <div className="h-32 w-48 sm:h-40 sm:w-60 md:h-48 md:w-72 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg mx-auto flex items-center justify-center">
                                                <div className="h-20 w-28 sm:h-24 sm:w-32 md:h-28 md:w-36 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-lg relative overflow-hidden">
                                                    {/* Furniture Details */}
                                                    <div className="absolute inset-0 flex flex-col items-center justify-between p-3">
                                                        {/* Top Bar */}
                                                        <div className="h-1 w-16 sm:w-20 bg-emerald-200 rounded-full" />
                                                        {/* Armrests */}
                                                        <div className="flex justify-between w-full px-2">
                                                            <div className="h-6 w-2 bg-emerald-200 rounded-full" />
                                                            <div className="h-6 w-2 bg-emerald-200 rounded-full" />
                                                        </div>
                                                        {/* Base */}
                                                        <div className="h-2 w-24 sm:w-28 bg-emerald-200 rounded-full" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Decorative Accent Pieces */}
                                            <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4">
                                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/80 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center">
                                                    <div className="h-4 w-4 rounded bg-emerald-300" />
                                                </div>
                                            </div>

                                            <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4">
                                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/80 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center">
                                                    <div className="h-3 w-3 rounded-full bg-emerald-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Slider Controls */}
                    <div className="mt-8 lg:mt-12 flex items-center justify-center space-x-4">
                        <button
                            onClick={prevSlide}
                            className="h-10 w-10 rounded-full bg-white border border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 shadow-sm transition-all duration-200 flex items-center justify-center"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="h-5 w-5 text-gray-600" />
                        </button>

                        <div className="flex items-center space-x-2">
                            {heroSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'w-8 bg-emerald-600'
                                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            className="h-10 w-10 rounded-full bg-white border border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 shadow-sm transition-all duration-200 flex items-center justify-center"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-gray-200 bg-gray-50/50">
                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="flex items-center p-3 sm:p-4 rounded-lg bg-white hover:bg-emerald-50/50 transition-colors shadow-sm hover:shadow">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-emerald-100 flex items-center justify-center mr-3 sm:mr-4">
                                <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-700" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 text-sm sm:text-base">Free Shipping</div>
                                <div className="text-xs sm:text-sm text-gray-600">Over $500</div>
                            </div>
                        </div>

                        <div className="flex items-center p-3 sm:p-4 rounded-lg bg-white hover:bg-emerald-50/50 transition-colors shadow-sm hover:shadow">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-emerald-100 flex items-center justify-center mr-3 sm:mr-4">
                                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-700" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 text-sm sm:text-base">2-Year Warranty</div>
                                <div className="text-xs sm:text-sm text-gray-600">Quality Guaranteed</div>
                            </div>
                        </div>

                        <div className="flex items-center p-3 sm:p-4 rounded-lg bg-white hover:bg-emerald-50/50 transition-colors shadow-sm hover:shadow">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-emerald-100 flex items-center justify-center mr-3 sm:mr-4">
                                <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-700" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 text-sm sm:text-base">Easy Returns</div>
                                <div className="text-xs sm:text-sm text-gray-600">14-Day Policy</div>
                            </div>
                        </div>

                        <div className="flex items-center p-3 sm:p-4 rounded-lg bg-white hover:bg-emerald-50/50 transition-colors shadow-sm hover:shadow">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-emerald-100 flex items-center justify-center mr-3 sm:mr-4">
                                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-700" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900 text-sm sm:text-base">Secure Payment</div>
                                <div className="text-xs sm:text-sm text-gray-600">100% Safe</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}