'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogoutButtonProps {
    variant?: 'default' | 'ghost' | 'outline';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
}

export default function LogoutButton({
    variant = 'ghost',
    size = 'default',
    className = ''
}: LogoutButtonProps) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminEmail');
        router.push('/admin/login');
    };

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleLogout}
            className={className}
        >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
        </Button>
    );
}