// src/components/landing/ReviewsSection.tsx
'use client';

import { useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Review {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
    location: string;
}

export default function ReviewsSection() {
    const [currentReview, setCurrentReview] = useState(0);

    const reviews: Review[] = [
        {
            id: '1',
            name: 'Sarah Johnson',
            rating: 5,
            comment: 'The quality of the Modern Velvet Sofa exceeded my expectations. Perfect addition to my living room!',
            date: '2 weeks ago',
            location: 'New York',
        },
        {
            id: '2',
            name: 'Michael Chen',
            rating: 5,
            comment: 'Our Minimalist Bed Frame is absolutely stunning. Best furniture purchase we have ever made!',
            date: '1 month ago',
            location: 'San Francisco',
        },
        {
            id: '3',
            name: 'Emma Rodriguez',
            rating: 5,
            comment: 'The Marble Dining Table is a showstopper! Perfectly balances modern design with timeless elegance.',
            date: '3 weeks ago',
            location: 'Miami',
        },
        {
            id: '4',
            name: 'David Wilson',
            rating: 5,
            comment: 'The Ergonomic Office Chair has completely changed my work-from-home experience. No more back pain!',
            date: '2 months ago',
            location: 'Austin',
        },
    ];

    const stats = {
        averageRating: 4.9,
        totalReviews: 1247,
    };

    const nextReview = () => {
        setCurrentReview((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const goToReview = (index: number) => {
        setCurrentReview(index);
    };

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

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who have transformed their homes
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Main Review Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 relative">
                        <Quote className="absolute top-6 right-6 h-12 w-12 text-emerald-100" />

                        <div className="flex items-center mb-4">
                            {renderStars(reviews[currentReview].rating)}
                            <span className="ml-2 text-sm text-gray-600">{reviews[currentReview].date}</span>
                        </div>

                        <p className="text-lg text-gray-800 mb-6 italic">
                            "{reviews[currentReview].comment}"
                        </p>

                        <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4">
                                <AvatarFallback className="bg-emerald-100 text-emerald-800">
                                    {reviews[currentReview].name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-semibold text-gray-900">{reviews[currentReview].name}</h4>
                                <p className="text-sm text-gray-600">{reviews[currentReview].location}</p>
                            </div>
                        </div>
                    </div>

                    {/* Review Navigation */}
                    <div className="flex items-center justify-center space-x-4 mb-12">
                        <button
                            onClick={prevReview}
                            className="p-2 rounded-full border border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                            aria-label="Previous review"
                        >
                            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <div className="flex space-x-2">
                            {reviews.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToReview(index)}
                                    className={`h-2 w-8 rounded-full transition-colors ${index === currentReview ? 'bg-emerald-600' : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to review ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextReview}
                            className="p-2 rounded-full border border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                            aria-label="Next review"
                        >
                            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="bg-emerald-50 rounded-2xl p-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-emerald-800 mb-2">
                                    {stats.averageRating}
                                </div>
                                <div className="flex justify-center mb-2">
                                    {renderStars(5)}
                                </div>
                                <p className="text-sm text-gray-600">Average Rating</p>
                            </div>

                            <div className="text-center">
                                <div className="text-4xl font-bold text-emerald-800 mb-2">
                                    {stats.totalReviews.toLocaleString()}
                                </div>
                                <p className="text-sm text-gray-600">Total Reviews</p>
                            </div>

                            <div className="text-center">
                                <div className="text-4xl font-bold text-emerald-800 mb-2">
                                    98%
                                </div>
                                <p className="text-sm text-gray-600">Would Recommend</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}