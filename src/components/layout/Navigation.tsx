// src/components/layout/Navigation.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Search,
    Heart,
    ShoppingBag,
    Menu,
    X,
    ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { categoryApi, searchApi } from '@/lib/apiClient';
import { Category } from '@/types';

// Search result interface
interface SearchResult {
    id: string;
    type: 'product' | 'category';
    name: string;
    description: string;
    metadata: {
        price?: number;
        [key: string]: any;
    };
}

export default function Navigation() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryApi.getAll();
                // Your API returns { categories: Category[], message: string }
                const categoriesData = response || [];

                if (categoriesData.length === 0) {
                    // Fallback demo categories if API returns empty
                    setCategories([
                        { id: '1', name: 'Living Room', description: 'Sofas, Chairs & Tables' },
                        { id: '2', name: 'Bedroom', description: 'Beds, Wardrobes & Nightstands' },
                        { id: '3', name: 'Dining', description: 'Dining Tables & Chairs' },
                        { id: '4', name: 'Office', description: 'Desks & Office Chairs' },
                        { id: '5', name: 'Outdoor', description: 'Patio Furniture & Decor' },
                    ]);
                } else {
                    setCategories(categoriesData);
                }

            } catch (error) {
                console.error('Error fetching categories:', error);
                // Fallback categories if API fails
                setCategories([
                    { id: '1', name: 'Living Room', description: 'Sofas, Chairs & Tables' },
                    { id: '2', name: 'Bedroom', description: 'Beds, Wardrobes & Nightstands' },
                    { id: '3', name: 'Dining', description: 'Dining Tables & Chairs' },
                    { id: '4', name: 'Office', description: 'Desks & Office Chairs' },
                    { id: '5', name: 'Outdoor', description: 'Patio Furniture & Decor' },
                ]);
            }
        };
        fetchCategories();
    }, []);

    // Handle search with debouncing
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 2) {
                try {
                    const response = await searchApi.search(searchQuery);
                    // Adjust based on your search API response structure
                    const results = response.results || response || [];
                    setSearchResults(results);
                } catch (error) {
                    console.error('Search failed:', error);
                    setSearchResults([]);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleResultClick = (result: SearchResult) => {
        if (result.type === 'product') {
            router.push(`/products/${result.id}`);
        } else if (result.type === 'category') {
            router.push(`/categories/${result.id}`);
        }
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    // Always ensure categories is an array before mapping
    const safeCategories = Array.isArray(categories) ? categories : [];

    return (
        <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b shadow-sm'
            : 'bg-white border-b'
            }`}>
            <div className="container mx-auto px-4">
                {/* Desktop Navigation */}
                <div className="hidden lg:flex h-16 items-center justify-between">

                    {/* Left: Logo */}
                    <div className="flex-1">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">HSH</span>
                            </div>
                            <span className="text-xl font-bold text-emerald-900 tracking-tight">
                                Home Sweet Home
                            </span>
                        </Link>
                    </div>

                    {/* Center: Navigation Links */}
                    <div className="flex-1 flex justify-center">
                        <div className="flex items-center space-x-8">
                            <Link
                                href="/"
                                className={`text-sm font-medium transition-all duration-200 hover:text-emerald-700 relative group ${pathname === '/' ? 'text-emerald-800' : 'text-gray-700'}`}
                            >
                                Home
                                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-600 transform origin-left transition-transform duration-200 ${pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                    }`} />
                            </Link>

                            {/* Shop Dropdown */}
                            {safeCategories.length > 0 && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="text-sm font-medium text-gray-700 hover:text-emerald-700 transition-all duration-200 flex items-center space-x-1 group">
                                            <span>Shop</span>
                                            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="center"
                                        className="w-72 p-2 bg-white border border-gray-100 shadow-xl rounded-xl"
                                    >
                                        <div className="grid gap-1">
                                            {safeCategories.map((category) => (
                                                <DropdownMenuItem key={category.id} asChild>
                                                    <Link
                                                        href={`/categories/${category.id}`}
                                                        className="flex items-center justify-between p-3 hover:bg-emerald-50 rounded-lg cursor-pointer transition-all duration-200 group/item"
                                                    >
                                                        <div className="flex flex-col items-start">
                                                            <span className="font-medium text-gray-900 group-hover/item:text-emerald-800">
                                                                {category.name}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {category.description}
                                                            </span>
                                                        </div>
                                                        <div className="h-8 w-8 rounded-md bg-emerald-100 flex items-center justify-center transition-colors group-hover/item:bg-emerald-200">
                                                            <div className="h-2 w-2 rounded-full bg-emerald-600" />
                                                        </div>
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            <Link
                                href="/faq"
                                className={`text-sm font-medium transition-all duration-200 hover:text-emerald-700 relative group ${pathname === '/faq' ? 'text-emerald-800' : 'text-gray-700'}`}
                            >
                                FAQ
                                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-600 transform origin-left transition-transform duration-200 ${pathname === '/faq' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                    }`} />
                            </Link>
                        </div>
                    </div>

                    {/* Right: Action Icons */}
                    <div className="flex-1 flex justify-end">
                        <div className="flex items-center space-x-3">

                            {/* Search with Popover */}
                            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-all duration-200"
                                    >
                                        <Search className="h-5 w-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[90vw] max-w-md p-0 shadow-2xl" align="end">
                                    <form onSubmit={handleSearch} className="p-4 border-b">
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                type="search"
                                                placeholder="Search for furniture, decor, or collections..."
                                                className="pl-11 pr-4 py-3 text-base border-emerald-200 focus:border-emerald-400"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                    </form>

                                    {/* Search Results */}
                                    {searchResults.length > 0 && (
                                        <div className="max-h-96 overflow-y-auto">
                                            {searchResults.slice(0, 5).map((result) => (
                                                <button
                                                    key={`${result.type}-${result.id}`}
                                                    onClick={() => handleResultClick(result)}
                                                    className="flex items-center w-full p-4 hover:bg-gray-50 border-b last:border-b-0 transition-colors duration-150 text-left"
                                                >
                                                    <div className={`h-12 w-12 rounded-md mr-3 flex items-center justify-center ${result.type === 'product' ? 'bg-emerald-100' : 'bg-blue-100'
                                                        }`}>
                                                        {result.type === 'product' ? (
                                                            <div className="h-6 w-6 rounded bg-emerald-500" />
                                                        ) : (
                                                            <div className="h-6 w-6 rounded bg-blue-500" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                                {result.name}
                                                            </p>
                                                            <span className={`text-xs px-2 py-1 rounded ${result.type === 'product'
                                                                ? 'bg-emerald-100 text-emerald-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                                }`}>
                                                                {result.type === 'product' ? 'Product' : 'Category'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                                            {result.description}
                                                        </p>
                                                        {'price' in result.metadata && (
                                                            <p className="text-sm font-semibold text-emerald-700 mt-1">
                                                                ${result.metadata.price}
                                                            </p>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </PopoverContent>
                            </Popover>

                            {/* Wishlist */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full relative transition-all duration-200"
                            >
                                <Heart className="h-5 w-5" />
                            </Button>

                            {/* Cart */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full relative transition-all duration-200"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-xs text-white font-medium shadow-sm">
                                    3
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex lg:hidden h-16 items-center justify-between">

                    {/* Left: Logo (Mobile) */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center">
                            <span className="text-white font-bold text-xs">HSH</span>
                        </div>
                        <span className="text-lg font-bold text-emerald-900">
                            Home Sweet Home
                        </span>
                    </Link>

                    {/* Right: Mobile Action Icons */}
                    <div className="flex items-center space-x-2">

                        {/* Mobile Search */}
                        <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full"
                                >
                                    <Search className="h-5 w-5" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[calc(100vw-2rem)] p-0 shadow-2xl" align="end">
                                <form onSubmit={handleSearch} className="p-4 border-b">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            type="search"
                                            placeholder="Search furniture..."
                                            className="pl-11 pr-4 py-3 text-base border-emerald-200"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                </form>

                                {searchResults.length > 0 && (
                                    <div className="max-h-80 overflow-y-auto">
                                        {searchResults.slice(0, 3).map((result) => (
                                            <button
                                                key={`${result.type}-${result.id}`}
                                                onClick={() => handleResultClick(result)}
                                                className="flex items-center w-full p-4 hover:bg-gray-50 border-b last:border-b-0 text-left"
                                            >
                                                <div className={`h-10 w-10 rounded mr-3 flex items-center justify-center ${result.type === 'product' ? 'bg-emerald-100' : 'bg-blue-100'
                                                    }`}>
                                                    {result.type === 'product' ? (
                                                        <div className="h-5 w-5 rounded bg-emerald-500" />
                                                    ) : (
                                                        <div className="h-5 w-5 rounded bg-blue-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {result.name}
                                                    </p>
                                                    {'price' in result.metadata && (
                                                        <p className="text-sm font-semibold text-emerald-700">
                                                            ${result.metadata.price}
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>

                        {/* Mobile Menu Sheet */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0">
                                <SheetHeader className="p-6 border-b">
                                    <SheetTitle className="text-left flex items-center space-x-2">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center">
                                            <span className="text-white font-bold text-xs">HSH</span>
                                        </div>
                                        <span className="text-lg font-bold text-emerald-900">
                                            Menu
                                        </span>
                                    </SheetTitle>
                                </SheetHeader>

                                <div className="flex flex-col h-[calc(100vh-120px)]">
                                    {/* Navigation Links */}
                                    <div className="flex-1 p-6">
                                        <div className="space-y-6">
                                            <div>
                                                <Link
                                                    href="/"
                                                    className="text-base font-medium text-gray-900 hover:text-emerald-700 flex items-center justify-between p-3 rounded-lg hover:bg-emerald-50 transition-colors"
                                                    onClick={() => document.dispatchEvent(new Event('sheet-close'))}
                                                >
                                                    <span>Home</span>
                                                    {pathname === '/' && (
                                                        <div className="h-2 w-2 rounded-full bg-emerald-600" />
                                                    )}
                                                </Link>
                                            </div>

                                            {safeCategories.length > 0 && (
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
                                                        Shop Categories
                                                    </p>
                                                    <div className="space-y-2">
                                                        {safeCategories.map((category) => (
                                                            <Link
                                                                key={category.id}
                                                                href={`/categories/${category.id}`}
                                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-emerald-50 transition-colors group"
                                                                onClick={() => document.dispatchEvent(new Event('sheet-close'))}
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="h-8 w-8 rounded-md bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                                                        <div className="h-2 w-2 rounded-full bg-emerald-600" />
                                                                    </div>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-sm font-medium text-gray-900 group-hover:text-emerald-800">
                                                                            {category.name}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">
                                                                            {category.description}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <ChevronDown className="h-4 w-4 text-gray-400 -rotate-90" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <Link
                                                    href="/faq"
                                                    className="text-base font-medium text-gray-900 hover:text-emerald-700 flex items-center justify-between p-3 rounded-lg hover:bg-emerald-50 transition-colors"
                                                    onClick={() => document.dispatchEvent(new Event('sheet-close'))}
                                                >
                                                    <span>FAQ</span>
                                                    {pathname === '/faq' && (
                                                        <div className="h-2 w-2 rounded-full bg-emerald-600" />
                                                    )}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom Actions */}
                                    <div className="border-t p-6">
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <Button
                                                variant="outline"
                                                className="flex items-center justify-center space-x-2 h-12"
                                            >
                                                <Heart className="h-4 w-4" />
                                                <span>Wishlist</span>
                                            </Button>
                                            <Button
                                                variant="default"
                                                className="flex items-center justify-center space-x-2 h-12 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900"
                                            >
                                                <ShoppingBag className="h-4 w-4" />
                                                <span>Cart (3)</span>
                                            </Button>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">
                                                Premium furniture for every home
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}