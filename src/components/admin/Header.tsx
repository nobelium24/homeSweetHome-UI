'use client';

import { Bell, Search, User, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
    adminEmail: string;
}

export default function Header({ adminEmail }: HeaderProps) {
    const notifications = [
        { id: 1, text: 'New order received', time: '5 min ago', read: false },
        { id: 2, text: 'Product low in stock', time: '1 hour ago', read: false },
        { id: 3, text: 'System update completed', time: '2 hours ago', read: true },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="bg-white border-b">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Search */}
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search dashboard..."
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative"
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <DropdownMenuItem key={notification.id} className="p-3">
                                            <div className="flex items-start space-x-3">
                                                <div className={`h-2 w-2 rounded-full mt-2 ${notification.read ? 'bg-gray-300' : 'bg-emerald-500'}`} />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{notification.text}</p>
                                                    <p className="text-xs text-gray-500">{notification.time}</p>
                                                </div>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="justify-center text-emerald-600">
                                    View all notifications
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* User Profile */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center space-x-2">
                                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <User className="h-4 w-4 text-emerald-700" />
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium">Admin</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[120px]">
                                            {adminEmail}
                                        </p>
                                    </div>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}