// src/app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminService } from '@/lib/apiClient';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                // No token, redirect to login
                if (pathname !== '/admin/login') {
                    router.push('/admin/login');
                }
                setIsLoading(false);
                return;
            }

            try {
                const adminService = new AdminService(token);
                // Try to get profile to validate token
                await adminService.profile();
                setIsAuthenticated(true);

                // If on login page but authenticated, redirect to dashboard
                if (pathname === '/admin/login') {
                    router.push('/admin/dashboard');
                }
            } catch (error) {
                // Token invalid or expired
                localStorage.removeItem('authToken');
                localStorage.removeItem('adminEmail');

                if (pathname !== '/admin/login') {
                    router.push('/admin/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, pathname]);

    // Don't protect login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}