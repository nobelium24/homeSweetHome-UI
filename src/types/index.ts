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

export enum ApplicationLogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
    HTTP = 'http'
}

export enum LogSource {
    API = 'api',
    DATABASE = 'database',
    AUTH = 'auth',
    PAYMENT = 'payment',
    EMAIL = 'email',
    SYSTEM = 'system',
    UNKNOWN = 'unknown'
}

export interface ApplicationLog {
    id: string;
    level: ApplicationLogLevel;
    source: LogSource;
    message: string;
    meta?: Record<string, any>;
    userId?: string;
    requestId?: string;
    endpoint?: string;
    method?: string;
    ip?: string;
    userAgent?: string;
    statusCode?: number;
    responseTime?: number;
    errorStack?: string;
    timestamp: Date;
}

export interface Level {
    level: ApplicationLogLevel;
    page: number;
    limit: number;
}

export interface LogFilters {
    level?: ApplicationLogLevel | ApplicationLogLevel[];
    source?: LogSource | LogSource[];
    search?: string;
    startDate?: Date;
    endDate?: Date;
    userId?: string;
    statusCode?: number;
}

export interface LogStats {
    timeframe: string;
    totalLogs: number;
    errors: number;
    warnings: number;
    avgResponseTime: number;
    topEndpoints: Array<{ endpoint: string; count: number }>;
    errorRate: number;
    byLevel: Array<{ level: ApplicationLogLevel; count: number }>;
    bySource: Array<{ source: LogSource; count: number }>;
}


// Add these interfaces to your existing types file

// Product statistics types
export interface ProductStats {
    totalProducts: number;
    totalCategories: number;
    outOfStock: number;
    lowStock: number;
    averagePrice: number;
    totalValue: number;
    topProducts: Array<{
        id: string;
        name: string;
        salesCount: number;
        revenue: number;
    }>;
    productsByCategory: Array<{
        categoryId: string;
        categoryName?: string;
        count: number;
    }>;
}

export interface StockStatus {
    outOfStock: number;
    lowStock: number;
    inStock: number;
}

export interface TopProduct {
    id: string;
    name: string;
    categoryName?: string;
    salesCount: number;
    revenue: number;
    price: number;
    quantity: number;
    image?: string;
}

export interface CategoryProductCount {
    categoryId: string;
    count: number;
}

// Order statistics types
export interface OrderStats {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    pendingOrders: number;
    confirmedOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    recentOrders: Order[];
    topUsers: Array<{
        userId: string;
        orderCount: number;
        totalSpent: number;
    }>;
    ordersByDate: Array<{
        date: string;
        count: number;
        revenue: number;
    }>;
}

export interface RevenueDataPoint {
    date: string;
    revenue: number;
}

export interface TopUser {
    userId: string;
    orderCount: number;
    totalSpent: number;
}

// export interface IProductRepository {
//     create(payload: Product): Promise<Product>;
//     getAll(limit: number, offset: number): Promise<Product[]>;
//     getByCategory(limit: number, offset: number, categoryId: string): Promise<Product[]>;
//     getOne(id: string): Promise<Product>;
//     update(id: string, payload: Partial<Product>): Promise<Product>;
//     deleteById(id: string): Promise<void>;
//     getStats(): Promise<ProductStats>;
//     getStockStatus(): Promise<StockStatus>;
//     getTopProductsBySales(limit: number): Promise<TopProduct[]>;
//     getProductsByCategory(): Promise<CategoryProductCount[]>;
// }

// // Update your IOrderRepository interface if needed
// export interface IOrderRepository {
//     create(payload: Order): Promise<Order>;
//     getAll(limit: number, offset: number): Promise<Order[]>;
//     getByUser(limit: number, offset: number, userId: string): Promise<Order[]>;
//     getOne(id: string): Promise<Order>;
//     update(id: string, payload: Partial<Order>): Promise<Order>;
//     deleteById(id: string): Promise<void>;
//     getStats(timeframe: 'today' | 'week' | 'month' | 'year' | 'all'): Promise<OrderStats>;
//     getRevenueByDate(startDate: Date, endDate: Date): Promise<RevenueDataPoint[]>;
//     getTopUsers(limit: number): Promise<TopUser[]>;
// }