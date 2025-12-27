// src/app/admin/categories/page.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Grid,
    List,
    ChevronDown,
    X,
    Check,
    AlertCircle,
    FolderTree,
    Package,
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
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Textarea } from '@/components/ui/textarea';
import { categoryApi } from '@/lib/apiClient';
import { Category } from '@/types';

interface CreateCategoryForm {
    name: string;
    description: string;
}

interface EditCategoryForm extends CreateCategoryForm {
    id: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Modal states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Form states
    const [createForm, setCreateForm] = useState<CreateCategoryForm>({
        name: '',
        description: ''
    });
    const [editForm, setEditForm] = useState<EditCategoryForm>({
        id: '',
        name: '',
        description: ''
    });
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

    // Feedback states
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const data = await categoryApi.getAll();
            console.log(data, "categories");
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Filter and sort categories with useMemo for performance
    const sortedCategories = useMemo(() => {
        let filtered = [...categories];

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(category =>
                category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                category.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            if (sortBy === 'name') {
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else {
                const dateA = new Date(a.createdAt || 0).getTime();
                const dateB = new Date(b.createdAt || 0).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }
        });

        return filtered;
    }, [categories, searchQuery, sortBy, sortOrder]);

    // Handle create category
    const handleCreateCategory = async () => {
        try {
            setError('');
            setSuccess('');

            // Validation
            if (!createForm.name.trim()) {
                setError('Category name is required');
                return;
            }
            if (!createForm.description.trim()) {
                setError('Category description is required');
                return;
            }

            // In a real implementation, you would call categoryApi.create()
            // For now, simulate creation
            const newCategory: Category = {
                id: Date.now().toString(),
                name: createForm.name,
                description: createForm.description,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Add to local state
            setCategories(prev => [newCategory, ...prev]);

            // Reset form and close dialog
            setCreateForm({ name: '', description: '' });
            setCreateDialogOpen(false);
            setSuccess('Category created successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error creating category:', err);
            setError('Failed to create category');
        }
    };

    // Handle edit category
    const handleEditCategory = async () => {
        try {
            setError('');
            setSuccess('');

            // Validation
            if (!editForm.name.trim()) {
                setError('Category name is required');
                return;
            }
            if (!editForm.description.trim()) {
                setError('Category description is required');
                return;
            }

            // In a real implementation, you would call categoryApi.update()
            // For now, simulate update
            const updatedCategories = categories.map(category =>
                category.id === editForm.id
                    ? { ...category, name: editForm.name, description: editForm.description, updatedAt: new Date() }
                    : category
            );

            setCategories(updatedCategories);
            setEditDialogOpen(false);
            setSuccess('Category updated successfully!');

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error updating category:', err);
            setError('Failed to update category');
        }
    };

    // Handle delete category
    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;

        try {
            setError('');
            setSuccess('');

            // In a real implementation, you would call categoryApi.deleteById()
            // For now, simulate deletion
            const updatedCategories = categories.filter(category => category.id !== categoryToDelete);
            setCategories(updatedCategories);

            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
            setSuccess('Category deleted successfully!');

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error deleting category:', err);
            setError('Failed to delete category');
        }
    };

    // Open edit dialog with category data
    const openEditDialog = (category: Category) => {
        setEditForm({
            id: category.id,
            name: category.name,
            description: category.description
        });
        setEditDialogOpen(true);
    };

    // Open delete dialog
    const openDeleteDialog = (categoryId: string) => {
        setCategoryToDelete(categoryId);
        setDeleteDialogOpen(true);
    };

    // Format date
    const formatDate = (date: Date | undefined) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Reset forms
    const resetCreateForm = () => {
        setCreateForm({ name: '', description: '' });
        setError('');
    };

    const resetEditForm = () => {
        setEditForm({ id: '', name: '', description: '' });
        setError('');
    };

    // Mobile-friendly responsive adjustments
    if (loading) {
        return (
            <div className="flex items-center justify-center h-96 px-4">
                <div className="text-center">
                    <div className="h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 md:px-0">
            {/* Header - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">
                        Manage your furniture categories and collections
                    </p>
                </div>

                {/* Create Category Button */}
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={resetCreateForm}
                            className="w-full sm:w-auto bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] w-[95vw] mx-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                            <DialogDescription>
                                Add a new furniture category to your store
                            </DialogDescription>
                        </DialogHeader>

                        {/* Create Category Form */}
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category Name *</label>
                                <Input
                                    placeholder="e.g., Living Room"
                                    value={createForm.name}
                                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description *</label>
                                <Textarea
                                    placeholder="Describe this category (e.g., Sofas, chairs, coffee tables...)"
                                    value={createForm.description}
                                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                                    rows={4}
                                />
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

                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setCreateDialogOpen(false)}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateCategory}
                                className="w-full sm:w-auto bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900"
                            >
                                <Check className="h-4 w-4 mr-2" />
                                Create Category
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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

            {/* Filters and Controls - Mobile Optimized */}
            <Card>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                        {/* Search */}
                        <div className="w-full">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search categories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* View Mode and Sort - Stack on mobile */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            {/* Sort Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center justify-between w-full sm:w-auto">
                                        <div className="flex items-center">
                                            <Filter className="h-4 w-4 mr-2" />
                                            <span className="hidden sm:inline">Sort: </span>
                                            {sortBy === 'name' ? 'Name' : 'Date'}
                                        </div>
                                        <ChevronDown className="h-4 w-4 ml-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48">
                                    <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => { setSortBy('name'); setSortOrder('asc'); }}>
                                        Name A-Z
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setSortBy('name'); setSortOrder('desc'); }}>
                                        Name Z-A
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setSortBy('createdAt'); setSortOrder('desc'); }}>
                                        Newest First
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setSortBy('createdAt'); setSortOrder('asc'); }}>
                                        Oldest First
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* View Mode Toggle */}
                            <div className="flex border border-gray-200 rounded-lg overflow-hidden w-full sm:w-auto">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    className={`flex-1 sm:flex-none h-9 px-3 rounded-none ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Grid</span>
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    className={`flex-1 sm:flex-none h-9 px-3 rounded-none ${viewMode === 'list' ? 'bg-emerald-600 text-white' : ''}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">List</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Categories Count and Clear Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-sm text-gray-600">
                    Showing {sortedCategories.length} of {categories.length} categories
                </p>
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery('')}
                        className="text-gray-600 hover:text-emerald-700 w-full sm:w-auto"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear Search
                    </Button>
                )}
            </div>

            {/* Categories Grid/List */}
            {sortedCategories.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <FolderTree className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No categories found
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto mb-6">
                            {searchQuery
                                ? 'No categories match your search. Try a different search term.'
                                : 'Get started by creating your first furniture category.'
                            }
                        </p>
                        {!searchQuery && (
                            <Button
                                onClick={() => setCreateDialogOpen(true)}
                                className="bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create First Category
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {sortedCategories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onEdit={openEditDialog}
                            onDelete={openDeleteDialog}
                        />
                    ))}
                </div>
            ) : (
                <Card>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="min-w-full">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-4 sm:pl-6">Category</TableHead>
                                        <TableHead className="hidden sm:table-cell">Description</TableHead>
                                        <TableHead className="hidden md:table-cell">Created</TableHead>
                                        <TableHead className="hidden lg:table-cell">Updated</TableHead>
                                        <TableHead className="pr-4 sm:pr-6 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="pl-4 sm:pl-6 py-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                        <FolderTree className="h-5 w-5 text-emerald-700" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">{category.name}</p>
                                                        <p className="text-sm text-gray-500 truncate sm:hidden">
                                                            {category.description}
                                                        </p>
                                                        <p className="text-xs text-gray-500 hidden sm:block">ID: {category.id}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <p className="text-gray-600 max-w-xs truncate">
                                                    {category.description}
                                                </p>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <p className="text-sm text-gray-600">{formatDate(category.createdAt)}</p>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <p className="text-sm text-gray-600">{formatDate(category.updatedAt)}</p>
                                            </TableCell>
                                            <TableCell className="pr-4 sm:pr-6 py-3 text-right">
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => openDeleteDialog(category.id)}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </Card>
            )}

            {/* Edit Category Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px] w-[95vw] mx-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                            Update the category details
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category Name *</label>
                            <Input
                                placeholder="Category name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description *</label>
                            <Textarea
                                placeholder="Category description"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                rows={4}
                            />
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

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setEditDialogOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditCategory}
                            className="w-full sm:w-auto bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900"
                        >
                            <Check className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this category? This action cannot be undone.
                            Products in this category will need to be reassigned.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                        <AlertDialogCancel
                            onClick={() => setCategoryToDelete(null)}
                            className="w-full sm:w-auto mt-0"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteCategory}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                        >
                            Delete Category
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// Category Card Component for Grid View - Mobile Optimized
function CategoryCard({
    category,
    onEdit,
    onDelete
}: {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}) {
    const [showActions, setShowActions] = useState(false);

    return (
        <Card
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            onTouchStart={() => setShowActions(true)}
        >
            <CardContent className="p-0">
                {/* Card Header */}
                <div className="p-4 sm:p-6 pb-3 sm:pb-4">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <FolderTree className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-700" />
                        </div>

                        <div className={`flex space-x-1 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(category)}
                                className="h-8 w-8 p-0"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(category.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-1">{category.name}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                        {category.description}
                    </p>
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t">
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            Created: {new Date(category.createdAt || 0).toLocaleDateString()}
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                            <Package className="h-3 w-3 mr-1 hidden sm:inline" />
                            <span>12</span>
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}