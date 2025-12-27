// src/app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    Package,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { productApi, orderApi, userApi, logApi } from '@/lib/apiClient';
import { ProductStats, OrderStats, LogStats, OrderStatus } from '@/types';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [productStats, setProductStats] = useState<ProductStats | null>(null);
    const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
    const [logStats, setLogStats] = useState<LogStats | null>(null);
    const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'year'>('week');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel
                const [productData, orderData, logData] = await Promise.all([
                    productApi.getStats(),
                    orderApi.getStats(timeframe),
                    logApi.getLogStats('day')
                ]);

                setProductStats(productData.stats);
                setOrderStats(orderData.stats);
                setLogStats(logData.stats);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [timeframe]);

    const statCards = [
        {
            title: 'Total Revenue',
            value: orderStats ? `$${orderStats.totalRevenue.toLocaleString()}` : '$0',
            icon: DollarSign,
            color: 'bg-emerald-500',
            change: '+12.5%',
            trend: 'up',
            description: `From ${timeframe}`
        },
        {
            title: 'Total Orders',
            value: orderStats ? orderStats.totalOrders.toLocaleString() : '0',
            icon: ShoppingCart,
            color: 'bg-blue-500',
            change: '+8.2%',
            trend: 'up',
            description: `${orderStats?.averageOrderValue ? `Avg: $${orderStats.averageOrderValue}` : ''}`
        },
        {
            title: 'Total Products',
            value: productStats ? productStats.totalProducts.toLocaleString() : '0',
            icon: Package,
            color: 'bg-purple-500',
            change: '+3.1%',
            trend: 'up',
            description: `${productStats?.totalCategories ? `${productStats.totalCategories} categories` : ''}`
        },
        {
            title: 'System Health',
            value: logStats ? `${(100 - (logStats.errorRate * 100)).toFixed(1)}%` : '100%',
            icon: CheckCircle,
            color: logStats?.errorRate && logStats.errorRate > 0.1 ? 'bg-amber-500' : 'bg-emerald-500',
            change: logStats?.errorRate ? `${(logStats.errorRate * 100).toFixed(1)}% errors` : '0% errors',
            trend: logStats?.errorRate && logStats.errorRate > 0.1 ? 'down' : 'up',
            description: 'Uptime'
        }
    ];

    const orderStatusStats = orderStats ? [
        { status: OrderStatus.PENDING, count: orderStats.pendingOrders, color: 'bg-yellow-500' },
        { status: OrderStatus.CONFIRMED, count: orderStats.confirmedOrders, color: 'bg-blue-500' },
        { status: OrderStatus.PROCESSING, count: orderStats.processingOrders, color: 'bg-purple-500' },
        { status: OrderStatus.SHIPPED, count: orderStats.shippedOrders, color: 'bg-indigo-500' },
        { status: OrderStatus.DELIVERED, count: orderStats.deliveredOrders, color: 'bg-emerald-500' },
        { status: OrderStatus.CANCELLED, count: orderStats.cancelledOrders, color: 'bg-red-500' },
    ] : [];

    const getStatusLabel = (status: OrderStatus) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">
                    Overview of your furniture store performance
                </p>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Timeframe:</span>
                </div>
                <div className="flex space-x-2">
                    {(['today', 'week', 'month', 'year'] as const).map((time) => (
                        <Button
                            key={time}
                            variant={timeframe === time ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setTimeframe(time)}
                            className={timeframe === time ? 'bg-emerald-600' : ''}
                        >
                            {time.charAt(0).toUpperCase() + time.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                {stat.title}
                            </CardTitle>
                            <div className={`${stat.color} h-10 w-10 rounded-lg flex items-center justify-center`}>
                                <stat.icon className="h-5 w-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="flex items-center mt-2">
                                {stat.trend === 'up' ? (
                                    <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                )}
                                <span className={`text-sm ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {stat.change}
                                </span>
                                <span className="text-sm text-gray-500 ml-2">{stat.description}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Status */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Order Status</CardTitle>
                        <CardDescription>
                            Distribution of orders by status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {orderStatusStats.map((statusStat) => (
                                <div key={statusStat.status} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`h-3 w-3 rounded-full ${statusStat.color}`} />
                                        <span className="text-sm font-medium">{getStatusLabel(statusStat.status)}</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm font-semibold">{statusStat.count}</span>
                                        <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${statusStat.color} rounded-full`}
                                                style={{
                                                    width: `${orderStats ? (statusStat.count / orderStats.totalOrders) * 100 : 0}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Stock Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Stock Status</CardTitle>
                        <CardDescription>
                            Inventory overview
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {productStats ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">In Stock</span>
                                        <span className="text-sm font-semibold">
                                            {productStats.totalProducts - productStats.outOfStock - productStats.lowStock}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{
                                                width: `${((productStats.totalProducts - productStats.outOfStock - productStats.lowStock) / productStats.totalProducts) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Low Stock</span>
                                        <span className="text-sm font-semibold">{productStats.lowStock}</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-amber-500 rounded-full"
                                            style={{
                                                width: `${(productStats.lowStock / productStats.totalProducts) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Out of Stock</span>
                                        <span className="text-sm font-semibold">{productStats.outOfStock}</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500 rounded-full"
                                            style={{
                                                width: `${(productStats.outOfStock / productStats.totalProducts) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Loading stock data...
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest system events and updates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {logStats ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-red-50 rounded-lg">
                                        <div className="text-2xl font-bold text-red-600">{logStats.errors}</div>
                                        <div className="text-sm text-gray-600">Errors</div>
                                    </div>
                                    <div className="p-4 bg-amber-50 rounded-lg">
                                        <div className="text-2xl font-bold text-amber-600">{logStats.warnings}</div>
                                        <div className="text-sm text-gray-600">Warnings</div>
                                    </div>
                                    <div className="p-4 bg-emerald-50 rounded-lg">
                                        <div className="text-2xl font-bold text-emerald-600">
                                            {logStats.avgResponseTime}ms
                                        </div>
                                        <div className="text-sm text-gray-600">Avg Response</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold">Top Endpoints</h4>
                                    {logStats.topEndpoints.slice(0, 3).map((endpoint, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <code className="text-xs text-gray-700">{endpoint.endpoint}</code>
                                            <Badge variant="secondary">{endpoint.count} requests</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Loading activity data...
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common administrative tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <Button className="h-auto py-4 flex flex-col items-center justify-center space-y-2 bg-emerald-600 hover:bg-emerald-700">
                                <Package className="h-6 w-6" />
                                <span>Add Product</span>
                            </Button>

                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center space-y-2">
                                <ShoppingCart className="h-6 w-6" />
                                <span>Process Orders</span>
                            </Button>

                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center space-y-2">
                                <Users className="h-6 w-6" />
                                <span>Manage Users</span>
                            </Button>

                            <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center space-y-2">
                                <AlertCircle className="h-6 w-6" />
                                <span>View Logs</span>
                            </Button>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-semibold mb-2">System Info</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Last Updated</span>
                                    <span className="font-medium">Just now</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Data Refresh</span>
                                    <span className="font-medium">Auto (5min)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Dashboard Version</span>
                                    <span className="font-medium">v1.2.0</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}