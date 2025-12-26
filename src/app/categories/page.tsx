// src/app/categories/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Grid, List, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { categoryApi } from '@/lib/apiClient';
import { Category } from '@/types';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const searchParams = useSearchParams();
    const search = searchParams.get('q') || '';

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const data = await categoryApi.getAll();
                setCategories(data);
                setFilteredCategories(data);
            } catch (error) {
                console.log('Error fetching categories:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (search) {
            setSearchQuery(search);
            const filtered = categories.filter(category =>
                category.name.toLowerCase().includes(search.toLowerCase()) ||
                category.description.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    }, [search, categories]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === '') {
            setFilteredCategories(categories);
        } else {
            const filtered = categories.filter(category =>
                category.name.toLowerCase().includes(query.toLowerCase()) ||
                category.description.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-12">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl p-6">
                                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
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
                        <span className="text-white">Categories</span>
                    </nav>

                    <h1 className="text-4xl font-bold mb-4">All Categories</h1>
                    <p className="text-emerald-100 max-w-2xl">
                        Browse our complete collection of furniture categories.
                        Find the perfect pieces for every room in your home.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Search and Filters */}
                <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="relative max-w-md">
                                <Input
                                    type="search"
                                    placeholder="Search categories..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="pl-10"
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <Filter className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                {filteredCategories.length} categories found
                            </span>

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

                {/* Categories Grid/List */}
                {filteredCategories.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">No categories found</div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery('');
                                setFilteredCategories(categories);
                            }}
                        >
                            Clear Search
                        </Button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCategories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredCategories.map((category) => (
                            <CategoryListItem key={category.id} category={category} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Category Card Component for Grid View
function CategoryCard({ category }: { category: Category }) {
    return (
        <Link href={`/categories/${category.id}`}>
            <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-emerald-50 to-emerald-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-emerald-200 to-emerald-300 group-hover:scale-110 transition-transform duration-300"></div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-800 transition-colors">
                        {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                        {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                            Browse Collection
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

// Category List Item Component for List View
function CategoryListItem({ category }: { category: Category }) {
    return (
        <Link href={`/categories/${category.id}`}>
            <div className="group bg-white rounded-xl p-6 hover:shadow-md transition-all duration-300 border border-transparent hover:border-emerald-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Icon */}
                        <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                            <div className="h-6 w-6 rounded bg-emerald-500"></div>
                        </div>

                        {/* Content */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-800">
                                {category.name}
                            </h3>
                            <p className="text-sm text-gray-600 max-w-2xl">
                                {category.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">View Products</span>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </div>
        </Link>
    );
}