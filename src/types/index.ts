// src/types/index.ts
export interface Admin {
    id?: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type ObjectPayload = {
    [key: string]: any;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Image {
    publicId: string;
    secureUrl: string;
}

export interface Product {
    id?: string;
    categoryId: string;
    name: string;
    description: string;
    colors: string[];
    price: number;
    quantity?: number;
    images: Image[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CartItem {
    id?: string;
    productId: string;
    quantity: number;
    price: number;
    name: string;
    color?: string;
    orderId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId: string;
}

export interface Order {
    id?: string;
    userId: string;
    totalAmount: number;
    reference?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
    status: OrderStatus;
    notes?: string;
    paymentMethod: string;
    cartItems?: CartItem[];
    createdAt?: Date;
    updatedAt?: Date;
}

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export interface User {
    id?: string;
    guestUuid: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    isRegistered: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SearchResult {
    type: 'product' | 'category';
    id: string;
    name: string;
    description: string;
    relevance: number;
    metadata: Record<string, any>;
}

export interface SearchResponse {
    query: string;
    results: SearchResult[];
    count: number;
    pagination: {
        limit: number;
        offset: number;
    };
    message: string;
}
