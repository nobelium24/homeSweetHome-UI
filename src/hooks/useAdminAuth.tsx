// src/hooks/useAdminAuth.ts
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminService } from '@/lib/apiClient';

export function useAdminAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [adminEmail, setAdminEmail] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            const email = localStorage.getItem('adminEmail');

            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                const adminService = new AdminService(token);
                await adminService.profile();
                setIsAuthenticated(true);
                setAdminEmail(email);
            } catch (error) {
                // Token invalid or expired
                localStorage.removeItem('authToken');
                localStorage.removeItem('adminEmail');
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminEmail');
        setIsAuthenticated(false);
        setAdminEmail(null);
        router.push('/admin/login');
    };

    return {
        isAuthenticated,
        isLoading,
        adminEmail,
        logout,
    };
}