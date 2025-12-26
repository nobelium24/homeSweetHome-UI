'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [adminEmail, setAdminEmail] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const email = localStorage.getItem('adminEmail');

        if (token) {
            setIsAuthenticated(true);
            setAdminEmail(email);
        }

        setIsLoading(false);
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