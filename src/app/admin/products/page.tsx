// src/app/admin/products/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Eye,
    Grid,
    List,
    ChevronDown,
    X,
    Check,
    AlertCircle,
    Package,
    DollarSign,
    Tag,
    Upload,
    Image as ImageIcon,
    ShoppingCart,
    BarChart3,
    FilterX,
    Layers,
    Palette,
    MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { productApi, categoryApi } from '@/lib/apiClient';
import { Product, Category, StockStatus, TopProduct } from '@/types';

interface ProductForm {
    name: string;
    description: string;
    categoryId: string;
    price: string;
    quantity: string;
    colors: string[];
    images: File[];
}

interface ProductFilters {
    categoryId: string;
    minPrice: string;
    maxPrice: string;
    stockStatus: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
    search: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Modal states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    // Form states
    const [productForm, setProductForm] = useState<ProductForm>({
        name: '',
        description: '',
        categoryId: '',
        price: '',
        quantity: '',
        colors: [],
        images: []
    });
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    // Filter states
    const [filters, setFilters] = useState<ProductFilters>({
        categoryId: 'all',
        minPrice: '',
        maxPrice: '',
        stockStatus: 'all',
        search: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    // Feedback states
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Image preview
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch products and categories
    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsData, categoriesData] = await Promise.all([
                productApi.getAll(100, 0),
                categoryApi.getAll()
            ]);

            setProducts(productsData.products || productsData || []);
            setCategories(categoriesData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...products];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower)
            );
        }

        // Category filter
        if (filters.categoryId !== 'all') {
            filtered = filtered.filter(product => product.categoryId === filters.categoryId);
        }

        // Price filter
        if (filters.minPrice) {
            const minPrice = parseFloat(filters.minPrice);
            filtered = filtered.filter(product => product.price >= minPrice);
        }
        if (filters.maxPrice) {
            const maxPrice = parseFloat(filters.maxPrice);
            filtered = filtered.filter(product => product.price <= maxPrice);
        }

        // Stock status filter
        if (filters.stockStatus !== 'all') {
            filtered = filtered.filter(product => {
                const quantity = product.quantity || 0;
                switch (filters.stockStatus) {
                    case 'in-stock': return quantity > 10;
                    case 'low-stock': return quantity > 0 && quantity <= 10;
                    case 'out-of-stock': return quantity === 0;
                    default: return true;
                }
            });
        }

        setFilteredProducts(filtered);
    }, [filters, products]);

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            case 'price':
                return sortOrder === 'asc'
                    ? a.price - b.price
                    : b.price - a.price;
            case 'createdAt':
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            default:
                return 0;
        }
    });

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        const newImages = [...productForm.images, ...files];
        setProductForm({ ...productForm, images: newImages });

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        const newImages = [...productForm.images];
        const newPreviews = [...imagePreviews];

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setProductForm({ ...productForm, images: newImages });
        setImagePreviews(newPreviews);
    };

    // Handle color selection
    const addColor = () => {
        const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        setProductForm({ ...productForm, colors: [...productForm.colors, color] });
    };

    const removeColor = (index: number) => {
        const newColors = [...productForm.colors];
        newColors.splice(index, 1);
        setProductForm({ ...productForm, colors: newColors });
    };

    // Handle create product
    const handleCreateProduct = async () => {
        try {
            setError('');
            setSuccess('');

            // Validation
            if (!productForm.name.trim()) {
                setError('Product name is required');
                return;
            }
            if (!productForm.categoryId) {
                setError('Category is required');
                return;
            }
            if (!productForm.price || parseFloat(productForm.price) <= 0) {
                setError('Valid price is required');
                return;
            }
            if (!productForm.quantity || parseInt(productForm.quantity) < 0) {
                setError('Valid quantity is required');
                return;
            }

            // Create form data for multipart upload
            const formData = new FormData();
            formData.append('name', productForm.name);
            formData.append('description', productForm.description);
            formData.append('categoryId', productForm.categoryId);
            formData.append('price', productForm.price);
            formData.append('quantity', productForm.quantity);
            formData.append('colors', JSON.stringify(productForm.colors));
            productForm.images.forEach(image => {
                formData.append('images', image);
            });

            // In a real implementation, you would call productApi.create() with formData
            // For now, simulate creation
            const newProduct: Product = {
                id: Date.now().toString(),
                name: productForm.name,
                description: productForm.description,
                categoryId: productForm.categoryId,
                price: parseFloat(productForm.price),
                quantity: parseInt(productForm.quantity),
                colors: productForm.colors,
                images: productForm.images.map((_, i) => ({
                    publicId: `img_${Date.now()}_${i}`,
                    secureUrl: imagePreviews[i] || '/placeholder.jpg'
                })),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            setProducts(prev => [newProduct, ...prev]);
            resetProductForm();
            setCreateDialogOpen(false);
            setSuccess('Product created successfully!');

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error creating product:', err);
            setError('Failed to create product');
        }
    };

    // Handle edit product
    const handleEditProduct = async () => {
        if (!editingProduct) return;

        try {
            setError('');
            setSuccess('');

            // Validation
            if (!productForm.name.trim()) {
                setError('Product name is required');
                return;
            }
            if (!productForm.categoryId) {
                setError('Category is required');
                return;
            }
            if (!productForm.price || parseFloat(productForm.price) <= 0) {
                setError('Valid price is required');
                return;
            }
            if (!productForm.quantity || parseInt(productForm.quantity) < 0) {
                setError('Valid quantity is required');
                return;
            }

            const updatedProducts = products.map(product =>
                product.id === editingProduct.id
                    ? {
                        ...product,
                        name: productForm.name,
                        description: productForm.description,
                        categoryId: productForm.categoryId,
                        price: parseFloat(productForm.price),
                        quantity: parseInt(productForm.quantity),
                        colors: productForm.colors,
                        images: productForm.images.length > 0
                            ? productForm.images.map((_, i) => ({
                                publicId: `img_${Date.now()}_${i}`,
                                secureUrl: imagePreviews[i] || '/placeholder.jpg'
                            }))
                            : product.images,
                        updatedAt: new Date()
                    }
                    : product
            );

            setProducts(updatedProducts);
            resetProductForm();
            setEditDialogOpen(false);
            setEditingProduct(null);
            setSuccess('Product updated successfully!');

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error updating product:', err);
            setError('Failed to update product');
        }
    };

    // Handle delete product
    const handleDeleteProduct = async () => {
        if (!productToDelete) return;

        try {
            setError('');
            setSuccess('');

            const updatedProducts = products.filter(product => product.id !== productToDelete);
            setProducts(updatedProducts);

            setDeleteDialogOpen(false);
            setProductToDelete(null);
            setSuccess('Product deleted successfully!');

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Failed to delete product');
        }
    };

    // Open edit dialog with product data
    const openEditDialog = (product: Product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            description: product.description,
            categoryId: product.categoryId,
            price: product.price.toString(),
            quantity: (product.quantity || 0).toString(),
            colors: product.colors || [],
            images: []
        });
        setImagePreviews([]);
        setEditDialogOpen(true);
    };

    // Open view dialog
    const openViewDialog = (product: Product) => {
        setViewingProduct(product);
        setViewDialogOpen(true);
    };

    // Reset form
    const resetProductForm = () => {
        setProductForm({
            name: '',
            description: '',
            categoryId: '',
            price: '',
            quantity: '',
            colors: [],
            images: []
        });
        setImagePreviews([]);
        setError('');
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            categoryId: 'all',
            minPrice: '',
            maxPrice: '',
            stockStatus: 'all',
            search: ''
        });
    };

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    // Get stock status badge
    const getStockStatus = (quantity: number = 0) => {
        if (quantity === 0) {
            return <Badge variant="destructive">Out of Stock</Badge>;
        } else if (quantity <= 10) {
            return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Low Stock</Badge>;
        } else {
            return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">In Stock</Badge>;
        }
    };

    // Get category name
    const getCategoryName = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.name || 'Uncategorized';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-2">
                        Manage your furniture products and inventory
                    </p>
                </div>

                {/* Create Product Button */}
                <Button
                    onClick={() => {
                        resetProductForm();
                        setCreateDialogOpen(true);
                    }}
                    className="bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-emerald-700 flex items-center">
                        <Check className="h-4 w-4 mr-2" />
                        {success}
                    </p>
                </div>
            )}

            {error && !createDialogOpen && !editDialogOpen && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {error}
                    </p>
                </div>
            )}

            {/* Filters and Controls */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col space-y-4">
                        {/* Search Bar */}
                        <div className="flex items-center space-x-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search products by name or description..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="pl-10"
                                />
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center"
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                                {showFilters && <ChevronDown className="h-4 w-4 ml-2 rotate-180" />}
                            </Button>

                            <div className="flex items-center space-x-2">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className={`h-9 px-3 ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : ''}`}
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className={`h-9 px-3 ${viewMode === 'list' ? 'bg-emerald-600 text-white' : ''}`}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Category</Label>
                                    <Select
                                        value={filters.categoryId}
                                        onValueChange={(value) => setFilters({ ...filters, categoryId: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {categories.map(category => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Price Range</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            placeholder="Min"
                                            value={filters.minPrice}
                                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                            type="number"
                                            min="0"
                                        />
                                        <Input
                                            placeholder="Max"
                                            value={filters.maxPrice}
                                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                            type="number"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium mb-2 block">Stock Status</Label>
                                    <Select
                                        value={filters.stockStatus}
                                        onValueChange={(value: any) => setFilters({ ...filters, stockStatus: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="in-stock">In Stock</SelectItem>
                                            <SelectItem value="low-stock">Low Stock</SelectItem>
                                            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={resetFilters}
                                        className="flex-1"
                                    >
                                        <FilterX className="h-4 w-4 mr-2" />
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Products</p>
                                <p className="text-2xl font-bold">{products.length}</p>
                            </div>
                            <Package className="h-8 w-8 text-emerald-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">In Stock</p>
                                <p className="text-2xl font-bold">
                                    {products.filter(p => (p.quantity || 0) > 10).length}
                                </p>
                            </div>
                            <Check className="h-8 w-8 text-emerald-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Low Stock</p>
                                <p className="text-2xl font-bold">
                                    {products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) <= 10).length}
                                </p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-amber-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Out of Stock</p>
                                <p className="text-2xl font-bold">
                                    {products.filter(p => (p.quantity || 0) === 0).length}
                                </p>
                            </div>
                            <X className="h-8 w-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Products Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Showing {sortedProducts.length} of {products.length} products
                </p>

                <div className="flex items-center space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center">
                                Sort: {sortBy === 'name' ? 'Name' : sortBy === 'price' ? 'Price' : 'Date'}
                                <ChevronDown className="h-4 w-4 ml-2" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setSortBy('name'); setSortOrder('asc'); }}>
                                Name A-Z
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSortBy('name'); setSortOrder('desc'); }}>
                                Name Z-A
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSortBy('price'); setSortOrder('asc'); }}>
                                Price: Low to High
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSortBy('price'); setSortOrder('desc'); }}>
                                Price: High to Low
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSortBy('createdAt'); setSortOrder('desc'); }}>
                                Newest First
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSortBy('createdAt'); setSortOrder('asc'); }}>
                                Oldest First
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Products Grid/List */}
            {sortedProducts.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto mb-6">
                            {filters.search || filters.categoryId !== 'all' || filters.minPrice || filters.maxPrice || filters.stockStatus !== 'all'
                                ? 'No products match your filters. Try adjusting your search criteria.'
                                : 'Get started by creating your first product.'
                            }
                        </p>
                        {!(filters.search || filters.categoryId !== 'all' || filters.minPrice || filters.maxPrice || filters.stockStatus !== 'all') && (
                            <Button
                                onClick={() => setCreateDialogOpen(true)}
                                className="bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create First Product
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            categories={categories}
                            onView={openViewDialog}
                            onEdit={openEditDialog}
                            onDelete={(id) => {
                                setProductToDelete(id);
                                setDeleteDialogOpen(true);
                            }}
                        />
                    ))}
                </div>
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-emerald-700" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{product.name}</p>
                                                    <p className="text-sm text-gray-500 truncate max-w-xs">
                                                        {product.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {getCategoryName(product.categoryId)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {formatPrice(product.price)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium">{product.quantity || 0}</span>
                                                <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${(product.quantity || 0) === 0 ? 'bg-red-500' :
                                                            (product.quantity || 0) <= 10 ? 'bg-amber-500' : 'bg-emerald-500'
                                                            }`}
                                                        style={{ width: `${Math.min(100, ((product.quantity || 0) / 50) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStockStatus(product.quantity)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openViewDialog(product)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditDialog(product)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setProductToDelete(product.id || '');
                                                        setDeleteDialogOpen(true);
                                                    }}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}

            {/* Create Product Dialog */}
            <ProductDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                title="Create New Product"
                description="Add a new furniture product to your store"
                categories={categories}
                form={productForm}
                imagePreviews={imagePreviews}
                error={error}
                onFormChange={setProductForm}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
                onAddColor={addColor}
                onRemoveColor={removeColor}
                onSubmit={handleCreateProduct}
                fileInputRef={fileInputRef}
            />

            {/* Edit Product Dialog */}
            <ProductDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                title="Edit Product"
                description="Update product details"
                categories={categories}
                form={productForm}
                imagePreviews={imagePreviews}
                error={error}
                onFormChange={setProductForm}
                onImageUpload={handleImageUpload}
                onRemoveImage={removeImage}
                onAddColor={addColor}
                onRemoveColor={removeColor}
                onSubmit={handleEditProduct}
                fileInputRef={fileInputRef}
                editingProduct={editingProduct}
            />

            {/* View Product Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Product Details</DialogTitle>
                        <DialogDescription>
                            View complete product information
                        </DialogDescription>
                    </DialogHeader>

                    {viewingProduct && (
                        <div className="space-y-6 py-4">
                            {/* Product Header */}
                            <div className="flex items-start space-x-4">
                                <div className="h-16 w-16 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <Package className="h-8 w-8 text-emerald-700" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{viewingProduct.name}</h3>
                                    <p className="text-gray-600">ID: {viewingProduct.id}</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        {getStockStatus(viewingProduct.quantity)}
                                        <Badge variant="secondary">
                                            {getCategoryName(viewingProduct.categoryId)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Price</h4>
                                    <p className="text-2xl font-bold text-emerald-700">
                                        {formatPrice(viewingProduct.price)}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Stock Quantity</h4>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {viewingProduct.quantity || 0}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                                    <p className="text-gray-600">{viewingProduct.description}</p>
                                </div>

                                {/* Colors */}
                                {viewingProduct.colors && viewingProduct.colors.length > 0 && (
                                    <div className="col-span-2">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Colors</h4>
                                        <div className="flex space-x-2">
                                            {viewingProduct.colors.map((color, index) => (
                                                <div
                                                    key={index}
                                                    className="h-8 w-8 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Dates */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Created</h4>
                                    <p className="text-gray-600">
                                        {new Date(viewingProduct.createdAt || 0).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Last Updated</h4>
                                    <p className="text-gray-600">
                                        {new Date(viewingProduct.updatedAt || 0).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setViewDialogOpen(false)}
                        >
                            Close
                        </Button>
                        {viewingProduct && (
                            <Button
                                onClick={() => {
                                    setViewDialogOpen(false);
                                    openEditDialog(viewingProduct);
                                }}
                                className="bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Product
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this product? This action cannot be undone.
                            All product data, including images, will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setProductToDelete(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteProduct}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Product
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// Product Dialog Component
function ProductDialog({
    open,
    onOpenChange,
    title,
    description,
    categories,
    form,
    imagePreviews,
    error,
    onFormChange,
    onImageUpload,
    onRemoveImage,
    onAddColor,
    onRemoveColor,
    onSubmit,
    fileInputRef,
    editingProduct
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    categories: Category[];
    form: ProductForm;
    imagePreviews: string[];
    error: string;
    onFormChange: (form: ProductForm) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
    onAddColor: () => void;
    onRemoveColor: (index: number) => void;
    onSubmit: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    editingProduct?: Product | null;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Basic Information */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Modern Velvet Sofa"
                                value={form.name}
                                onChange={(e) => onFormChange({ ...form, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={form.categoryId}
                                onValueChange={(value) => onFormChange({ ...form, categoryId: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(category => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($) *</Label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="299.99"
                                value={form.price}
                                onChange={(e) => onFormChange({ ...form, price: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Stock Quantity *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="0"
                                placeholder="50"
                                value={form.quantity}
                                onChange={(e) => onFormChange({ ...form, quantity: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your product features, dimensions, materials, etc."
                            value={form.description}
                            onChange={(e) => onFormChange({ ...form, description: e.target.value })}
                            rows={4}
                        />
                    </div>

                    {/* Colors */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Colors</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onAddColor}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Color
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.colors.map((color, index) => (
                                <div key={index} className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                                    <div
                                        className="h-6 w-6 rounded-full border border-gray-300"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-sm">{color}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onRemoveColor(index)}
                                        className="h-6 w-6 p-0 text-gray-500 hover:text-red-600"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <Label>Product Images (Max 5)</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {/* Image Preview */}
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => onRemoveImage(index)}
                                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}

                            {/* Upload Button */}
                            {imagePreviews.length < 5 && (
                                <div
                                    className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-400 transition-colors cursor-pointer flex flex-col items-center justify-center"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Upload</span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={onImageUpload}
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">
                            Supported formats: JPG, PNG, WEBP. Max size: 5MB per image.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            {error}
                        </p>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        className="bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900"
                    >
                        <Check className="h-4 w-4 mr-2" />
                        {editingProduct ? 'Update Product' : 'Create Product'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Product Card Component for Grid View
function ProductCard({
    product,
    categories,
    onView,
    onEdit,
    onDelete
}: {
    product: Product;
    categories: Category[];
    onView: (product: Product) => void;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}) {
    const [showActions, setShowActions] = useState(false);

    const getCategoryName = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        return category?.name || 'Uncategorized';
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const getStockStatus = (quantity: number = 0) => {
        if (quantity === 0) return 'bg-red-500';
        if (quantity <= 10) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    return (
        <Card
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-emerald-50 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-32 w-32 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200"></div>
                    </div>

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 left-3">
                        <div className={`h-3 w-3 rounded-full ${getStockStatus(product.quantity)}`} />
                    </div>

                    {/* Actions */}
                    <div className={`absolute top-3 right-3 flex flex-col space-y-1 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onView(product)}
                            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(product)}
                            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => product.id && onDelete(product.id)}
                            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {product.name}
                        </h3>
                        <span className="text-xl font-bold text-emerald-700">
                            {formatPrice(product.price)}
                        </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                    </p>

                    <div className="space-y-3">
                        {/* Category */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Category</span>
                            <Badge variant="secondary">
                                {getCategoryName(product.categoryId)}
                            </Badge>
                        </div>

                        {/* Stock */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Stock</span>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium">{product.quantity || 0}</span>
                                <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${getStockStatus(product.quantity)}`}
                                        style={{ width: `${Math.min(100, ((product.quantity || 0) / 50) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Colors */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Colors</span>
                                <div className="flex -space-x-1">
                                    {product.colors.slice(0, 3).map((color, index) => (
                                        <div
                                            key={index}
                                            className="h-4 w-4 rounded-full border border-gray-300"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                    {product.colors.length > 3 && (
                                        <div className="h-4 w-4 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center">
                                            <span className="text-xs">+{product.colors.length - 3}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onView(product)}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}