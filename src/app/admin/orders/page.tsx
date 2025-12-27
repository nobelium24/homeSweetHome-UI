// src/app/admin/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Eye,
    CheckCircle,
    Truck,
    Package,
    XCircle,
    RefreshCw,
    Download,
    MoreVertical,
    Calendar,
    ChevronDown,
    X,
    AlertCircle,
    Clock,
    ShieldCheck,
    User
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
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { orderApi } from '@/lib/apiClient';
import { Order, OrderStatus } from '@/types';
import { format } from 'date-fns';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');

    // Modal states
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');

    // Feedback states
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderApi.getAll(50, 0);
            const ordersData = response.orders || [];
            setOrders(ordersData);
            setFilteredOrders(ordersData);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter orders based on search and filters
    useEffect(() => {
        let filtered = [...orders];

        // Apply search filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                order.id?.toLowerCase().includes(query) ||
                order.email.toLowerCase().includes(query) ||
                order.firstName.toLowerCase().includes(query) ||
                order.lastName.toLowerCase().includes(query) ||
                order.reference?.toLowerCase().includes(query)
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Apply date filter
        const now = new Date();
        filtered = filtered.filter(order => {
            const orderDate = new Date(order.createdAt || 0);

            switch (dateRange) {
                case 'today':
                    return orderDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return orderDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return orderDate >= monthAgo;
                default:
                    return true;
            }
        });

        setFilteredOrders(filtered);
    }, [searchQuery, statusFilter, dateRange, orders]);

    // Handle status update
    const handleUpdateStatus = async () => {
        if (!selectedOrder || !newStatus) return;

        try {
            setError('');
            setSuccess('');

            // In a real implementation, you would call orderApi.updateStatus()
            const updatedOrders = orders.map(order =>
                order.id === selectedOrder.id
                    ? { ...order, status: newStatus as OrderStatus, updatedAt: new Date() }
                    : order
            );

            setOrders(updatedOrders);
            setUpdateStatusDialogOpen(false);
            setSelectedOrder(null);
            setNewStatus('');
            setSuccess(`Order status updated to ${getStatusLabel(newStatus as OrderStatus)}`);

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error updating order status:', err);
            setError('Failed to update order status');
        }
    };

    // Open view dialog
    const openViewDialog = (order: Order) => {
        setSelectedOrder(order);
        setViewDialogOpen(true);
    };

    // Open update status dialog
    const openUpdateStatusDialog = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setUpdateStatusDialogOpen(true);
    };

    // Get status badge
    const getStatusBadge = (status: OrderStatus) => {
        const statusConfig = {
            [OrderStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
            [OrderStatus.CONFIRMED]: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
            [OrderStatus.PROCESSING]: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: RefreshCw },
            [OrderStatus.SHIPPED]: { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Truck },
            [OrderStatus.DELIVERED]: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: Package },
            [OrderStatus.CANCELLED]: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
        };

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} border flex items-center space-x-1`}>
                <Icon className="h-3 w-3" />
                <span>{getStatusLabel(status)}</span>
            </Badge>
        );
    };

    // Get status label
    const getStatusLabel = (status: OrderStatus) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Format date
    const formatDate = (date: Date | undefined) => {
        if (!date) return 'N/A';
        return format(new Date(date), 'MMM dd, yyyy HH:mm');
    };

    // Get order stats
    const getOrderStats = () => {
        const stats = {
            total: orders.length,
            pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
            revenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
            average: orders.length > 0
                ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length
                : 0,
        };

        return stats;
    };

    const stats = getOrderStats();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600 mt-2">
                    Manage customer orders and track order status
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                                <p className="text-xs text-gray-500 mt-1">All time</p>
                            </div>
                            <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <Package className="h-6 w-6 text-emerald-700" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
                                <p className="text-xs text-gray-500 mt-1">Require attention</p>
                            </div>
                            <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-yellow-700" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {formatCurrency(stats.revenue)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">All orders</p>
                            </div>
                            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <ShieldCheck className="h-6 w-6 text-blue-700" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Average Order</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {formatCurrency(stats.average)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Value per order</p>
                            </div>
                            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Truck className="h-6 w-6 text-purple-700" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-emerald-700 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {success}
                    </p>
                </div>
            )}

            {error && (
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Search */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search orders by ID, email, name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3">
                            {/* Status Filter */}
                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                                    <SelectItem value={OrderStatus.CONFIRMED}>Confirmed</SelectItem>
                                    <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
                                    <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                                    <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                                    <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Date Filter */}
                            <Select value={dateRange} onValueChange={(value) => setDateRange(value as any)}>
                                <SelectTrigger className="w-[140px]">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Date Range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Time</SelectItem>
                                    <SelectItem value="today">Today</SelectItem>
                                    <SelectItem value="week">This Week</SelectItem>
                                    <SelectItem value="month">This Month</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Export Button */}
                            <Button variant="outline" className="flex items-center">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Showing {filteredOrders.length} of {orders.length} orders
                </p>
                {(searchQuery || statusFilter !== 'all' || dateRange !== 'all') && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                            setDateRange('all');
                        }}
                        className="text-gray-600 hover:text-emerald-700"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Orders Table */}
            <Card>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12">
                                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            No orders found
                                        </h3>
                                        <p className="text-gray-600 max-w-md mx-auto">
                                            {searchQuery || statusFilter !== 'all' || dateRange !== 'all'
                                                ? 'No orders match your filters. Try adjusting your search criteria.'
                                                : 'No orders have been placed yet.'
                                            }
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOrders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-gray-900">{order.id}</p>
                                                {order.reference && (
                                                    <p className="text-xs text-gray-500">Ref: {order.reference}</p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {order.firstName} {order.lastName}
                                                </p>
                                                <p className="text-sm text-gray-600">{order.email}</p>
                                                <p className="text-xs text-gray-500">{order.phone}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-semibold text-emerald-700">
                                                {formatCurrency(order.totalAmount)}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(order.status)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-gray-100">
                                                {order.paymentMethod}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openViewDialog(order)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => openViewDialog(order)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openUpdateStatusDialog(order)}>
                                                            <RefreshCw className="h-4 w-4 mr-2" />
                                                            Update Status
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Truck className="h-4 w-4 mr-2" />
                                                            Track Shipping
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600">
                                                            <XCircle className="h-4 w-4 mr-2" />
                                                            Cancel Order
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* View Order Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    {selectedOrder && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                                <DialogDescription>
                                    Order #{selectedOrder.id} • {formatDate(selectedOrder.createdAt)}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                {/* Order Status and Amount */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        {getStatusBadge(selectedOrder.status)}
                                        <div>
                                            <p className="text-sm font-medium">Payment Method</p>
                                            <p className="text-sm text-gray-600">{selectedOrder.paymentMethod}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">Total Amount</p>
                                        <p className="text-2xl font-bold text-emerald-700">
                                            {formatCurrency(selectedOrder.totalAmount)}
                                        </p>
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center">
                                        <User className="h-4 w-4 mr-2" />
                                        Customer Information
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Name</p>
                                            <p className="font-medium">
                                                {selectedOrder.firstName} {selectedOrder.lastName}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-medium">{selectedOrder.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-medium">{selectedOrder.phone}</p>
                                        </div>
                                        {selectedOrder.reference && (
                                            <div>
                                                <p className="text-sm text-gray-600">Reference</p>
                                                <p className="font-medium">{selectedOrder.reference}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Shipping Information */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center">
                                        <Truck className="h-4 w-4 mr-2" />
                                        Shipping Address
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="font-medium">
                                            {selectedOrder.firstName} {selectedOrder.lastName}
                                        </p>
                                        <p className="text-gray-600">{selectedOrder.address}</p>
                                        <p className="text-gray-600">
                                            {selectedOrder.city}, {selectedOrder.state} {selectedOrder.zipCode}
                                        </p>
                                        <p className="text-gray-600">{selectedOrder.country}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                {selectedOrder.cartItems && selectedOrder.cartItems.length > 0 && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Order Items</h3>
                                        <div className="border rounded-lg overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Product</TableHead>
                                                        <TableHead>Color</TableHead>
                                                        <TableHead>Quantity</TableHead>
                                                        <TableHead className="text-right">Price</TableHead>
                                                        <TableHead className="text-right">Total</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {selectedOrder.cartItems.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                <p className="font-medium">{item.name}</p>
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.color && (
                                                                    <div className="flex items-center space-x-2">
                                                                        <div
                                                                            className="h-4 w-4 rounded-full border"
                                                                            style={{ backgroundColor: item.color }}
                                                                        />
                                                                        <span className="text-sm">{item.color}</span>
                                                                    </div>
                                                                )}
                                                            </TableCell>
                                                            <TableCell>{item.quantity}</TableCell>
                                                            <TableCell className="text-right">
                                                                {formatCurrency(item.price)}
                                                            </TableCell>
                                                            <TableCell className="text-right font-medium">
                                                                {formatCurrency(item.price * item.quantity)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                )}

                                {/* Order Notes */}
                                {selectedOrder.notes && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Order Notes</h3>
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setViewDialogOpen(false)}
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={() => {
                                        setViewDialogOpen(false);
                                        openUpdateStatusDialog(selectedOrder);
                                    }}
                                    className="bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Update Status
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Update Status Dialog */}
            <Dialog open={updateStatusDialogOpen} onOpenChange={setUpdateStatusDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    {selectedOrder && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Update Order Status</DialogTitle>
                                <DialogDescription>
                                    Update status for Order #{selectedOrder.id}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                {/* Current Status */}
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-2">Current Status</p>
                                    <div className="flex items-center space-x-2">
                                        {getStatusBadge(selectedOrder.status)}
                                        <span className="text-sm text-gray-500">
                                            Since {formatDate(selectedOrder.updatedAt || selectedOrder.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {/* Status Selector */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">New Status</label>
                                    <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatus)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select new status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                                            <SelectItem value={OrderStatus.CONFIRMED}>Confirmed</SelectItem>
                                            <SelectItem value={OrderStatus.PROCESSING}>Processing</SelectItem>
                                            <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                                            <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                                            <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status Description */}
                                {newStatus && (
                                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                                        <p className="text-sm font-medium text-emerald-800 mb-1">
                                            What happens when status is updated to {getStatusLabel(newStatus as OrderStatus)}?
                                        </p>
                                        <p className="text-sm text-emerald-700">
                                            {getStatusDescription(newStatus as OrderStatus)}
                                        </p>
                                    </div>
                                )}
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
                                    onClick={() => setUpdateStatusDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleUpdateStatus}
                                    disabled={!newStatus || newStatus === selectedOrder.status}
                                    className="bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900"
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Update Status
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Get status description
function getStatusDescription(status: OrderStatus): string {
    const descriptions = {
        [OrderStatus.PENDING]: 'Order has been placed but not yet confirmed. Payment may be pending verification.',
        [OrderStatus.CONFIRMED]: 'Order has been confirmed and payment has been verified. Ready for processing.',
        [OrderStatus.PROCESSING]: 'Order is being prepared for shipping. Items are being picked and packed.',
        [OrderStatus.SHIPPED]: 'Order has been shipped to the customer. Tracking information may be available.',
        [OrderStatus.DELIVERED]: 'Order has been successfully delivered to the customer.',
        [OrderStatus.CANCELLED]: 'Order has been cancelled. No further action required.',
    };

    return descriptions[status];
}