// src/app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    LogOut,
    Users,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    Calendar,
    DollarSign
} from 'lucide-react';
import { AdminService } from '@/lib/apiClient';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [adminEmail, setAdminEmail] = useState('');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
    });

    useEffect(() => {
        const email = localStorage.getItem('adminEmail');
        if (email) {
            setAdminEmail(email);
        }

        // In a real app, you'd fetch these stats from your API
        // For now, using dummy data
        setStats({
            totalUsers: 1247,
            totalProducts: 89,
            totalOrders: 356,
            totalRevenue: 124560,
        });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminEmail');
        router.push('/admin/login');
    };

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            color: 'bg-blue-500',
            change: '+12%',
        },
        {
            title: 'Total Products',
            value: stats.totalProducts.toLocaleString(),
            icon: Package,
            color: 'bg-emerald-500',
            change: '+5%',
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders.toLocaleString(),
            icon: ShoppingCart,
            color: 'bg-purple-500',
            change: '+23%',
        },
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-amber-500',
            change: '+18%',
        },
    ];

    const quickActions = [
        { label: 'Manage Products', icon: Package, href: '/admin/products' },
        { label: 'View Orders', icon: ShoppingCart, href: '/admin/orders' },
        { label: 'User Management', icon: Users, href: '/admin/users' },
        { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
        { label: 'Calendar', icon: Calendar, href: '/admin/calendar' },
        { label: 'Settings', icon: Settings, href: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-sm text-gray-600">
                                Welcome back, {adminEmail || 'Admin'}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-xs text-emerald-600 mt-2">{stat.change} from last month</p>
                                </div>
                                <div className={`${stat.color} h-12 w-12 rounded-lg flex items-center justify-center`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {quickActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => router.push(action.href)}
                                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors group"
                            >
                                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors">
                                    <action.icon className="h-5 w-5 text-emerald-700" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 text-center">
                                    {action.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Activity & Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((order) => (
                                <div key={order} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
                                    <div>
                                        <p className="font-medium text-gray-900">Order #{1000 + order}</p>
                                        <p className="text-sm text-gray-600">John Doe • Today</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-emerald-700">$299.99</p>
                                        <span className="inline-block px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                                            Completed
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">System Status</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">API Health</span>
                                    <span className="text-sm font-medium text-emerald-600">Healthy</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-full"></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Server Load</span>
                                    <span className="text-sm font-medium text-emerald-600">42%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-2/5"></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Storage</span>
                                    <span className="text-sm font-medium text-emerald-600">78% Used</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 w-4/5"></div>
                                </div>
                            </div>

                            <div className="pt-6 border-t">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Stats</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">24</div>
                                        <div className="text-xs text-gray-600">Today's Orders</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">8</div>
                                        <div className="text-xs text-gray-600">Pending Reviews</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">15</div>
                                        <div className="text-xs text-gray-600">Low Stock Items</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">3</div>
                                        <div className="text-xs text-gray-600">Support Tickets</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}