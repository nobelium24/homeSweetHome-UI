// src/app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminService } from '@/lib/apiClient';
import Sidebar from '@/components/admin/SideBar';
import Header from '@/components/admin/Header';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [adminEmail, setAdminEmail] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            // Only check authentication for non-login pages
            if (pathname === '/admin/login') {
                setIsLoading(false);
                return;
            }

            const token = localStorage.getItem('authToken');

            if (!token) {
                // No token, redirect to login
                router.push('/admin/login');
                return;
            }

            try {
                // Verify token is still valid by calling profile endpoint
                const adminService = new AdminService(token);
                const profile = await adminService.profile();
                setAdminEmail(profile.adminProfile.email);
            } catch (error) {
                // Token invalid or expired
                localStorage.removeItem('authToken');
                localStorage.removeItem('adminEmail');
                router.push('/admin/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, pathname]);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <Header adminEmail={adminEmail} />
                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}