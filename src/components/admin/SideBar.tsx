// src/components/admin/Sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    FolderTree,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    Home,
    LogOut,
    Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { cn } from '@/lib/utils';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    subItems?: NavItem[];
}

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { logout } = useAdminAuth();

    // Set mounted state to prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems: NavItem[] = [
        {
            label: 'Dashboard',
            href: '/admin/dashboard',
            icon: <LayoutDashboard className="h-5 w-5" />
        },
        {
            label: 'Categories',
            href: '/admin/categories',
            icon: <FolderTree className="h-5 w-5" />
        },
        {
            label: 'Products',
            href: '/admin/products',
            icon: <Package className="h-5 w-5" />
        },
        {
            label: 'Orders',
            href: '/admin/orders',
            icon: <ShoppingCart className="h-5 w-5" />
        },
        {
            label: 'Users',
            href: '/admin/users',
            icon: <Users className="h-5 w-5" />
        },
        {
            label: 'Logs',
            href: '/admin/logs',
            icon: <FileText className="h-5 w-5" />
        },
        {
            label: 'Settings',
            href: '/admin/settings',
            icon: <Settings className="h-5 w-5" />
        }
    ];

    const isActive = (href: string) => {
        if (href === '/admin/dashboard') {
            return pathname === '/admin/dashboard';
        }
        return pathname.startsWith(href);
    };

    // Don't render during SSR to prevent hydration mismatch
    if (!mounted) {
        return (
            <aside className="w-64 bg-emerald-900 text-white">
                <div className="h-screen flex flex-col">
                    {/* Loading placeholder */}
                    <div className="p-6 border-b border-emerald-800">
                        <div className="h-8 w-8 rounded-full bg-white animate-pulse"></div>
                    </div>
                </div>
            </aside>
        );
    }

    return (
        <aside
            className={cn(
                "bg-emerald-900 text-white transition-all duration-300 flex-shrink-0",
                isCollapsed ? "w-20" : "w-64"
            )}
            style={{ height: '100vh' }}
        >
            <div className="h-full flex flex-col fixed bg-emerald-900" style={{ width: isCollapsed ? '5rem' : '16rem' }}>
                {/* Logo */}
                <div className="p-4 border-b border-emerald-800">
                    <div className="flex items-center justify-between">
                        {!isCollapsed ? (
                            <div className="flex items-center space-x-3 min-w-0">
                                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                    <span className="text-emerald-900 font-bold text-base">HSH</span>
                                </div>
                                <div className="min-w-0">
                                    <h1 className="font-bold text-lg truncate">Home Sweet Home</h1>
                                    <p className="text-xs text-emerald-300 truncate">Admin Portal</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center w-full">
                                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                                    <span className="text-emerald-900 font-bold text-base">HSH</span>
                                </div>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-emerald-300 hover:text-white hover:bg-emerald-800 flex-shrink-0"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            {isCollapsed ? (
                                <ChevronRight className="h-4 w-4" />
                            ) : (
                                <ChevronLeft className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center rounded-lg transition-colors",
                                        isCollapsed ? "justify-center px-2 py-3" : "justify-start px-3 py-3",
                                        isActive(item.href)
                                            ? "bg-emerald-800 text-white"
                                            : "text-emerald-300 hover:bg-emerald-800 hover:text-white"
                                    )}
                                >
                                    <div className={cn(
                                        "flex-shrink-0",
                                        isActive(item.href) ? "text-white" : "text-emerald-400"
                                    )}>
                                        {item.icon}
                                    </div>
                                    {!isCollapsed && (
                                        <span className="ml-3 font-medium truncate">{item.label}</span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-emerald-800">
                    {/* Back to Home */}
                    <Link
                        href="/"
                        className={cn(
                            "flex items-center rounded-lg text-emerald-300 hover:bg-emerald-800 hover:text-white transition-colors mb-2",
                            isCollapsed ? "justify-center px-2 py-3" : "justify-start px-3 py-3"
                        )}
                    >
                        <Home className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium truncate">Back to Home</span>
                        )}
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className={cn(
                            "flex items-center w-full rounded-lg text-emerald-300 hover:bg-emerald-800 hover:text-white transition-colors",
                            isCollapsed ? "justify-center px-2 py-3" : "justify-start px-3 py-3"
                        )}
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && (
                            <span className="ml-3 font-medium truncate">Logout</span>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
}