// src/lib/api-client.ts
import axios, { AxiosResponse } from 'axios';
import { Admin, Category, Product, CartItem, Order, OrderStatus, User, SearchResult, SearchResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001/api';

export class CategoryService {
    private accessToken: string | null = null;

    constructor(accessToken?: string) {
        this.accessToken = accessToken || this.getStoredAccessToken();
    }

    private getStoredAccessToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    }

    private getAuthHeaders() {
        const token = this.accessToken || this.getStoredAccessToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async getAll(): Promise<Category[]> {
        try {
            const response: AxiosResponse<Category[]> = await axios.get(
                `${API_BASE_URL}/category/get-all`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching all categories:", error);
            throw error;
        }
    }

    async getById(id: string): Promise<Category> {
        try {
            const response: AxiosResponse<Category> = await axios.get(
                `${API_BASE_URL}/category/get-by-id/${id}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching category by ID:", error);
            throw error;
        }
    }
}

export class ProductService {
    private accessToken: string | null = null;

    constructor(accessToken?: string) {
        this.accessToken = accessToken || this.getStoredAccessToken();
    }

    private getStoredAccessToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    }

    private getAuthHeaders() {
        const token = this.accessToken || this.getStoredAccessToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    private getMultipartAuthHeaders() {
        const token = this.accessToken || this.getStoredAccessToken();
        const headers: Record<string, string> = {};

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async getAll(limit: number = 10, offset: number = 0): Promise<{ products: Product[], message: string }> {
        try {
            const response: AxiosResponse<{ products: Product[], message: string }> = await axios.get(
                `${API_BASE_URL}/product/get-all?limit=${limit}&offset=${offset}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching all products:", error);
            throw error;
        }
    }

    async getByCategory(categoryId: string, limit: number = 10, offset: number = 0): Promise<{ products: Product[], message: string }> {
        try {
            const response: AxiosResponse<{ products: Product[], message: string }> = await axios.get(
                `${API_BASE_URL}/product/get-by-category/${categoryId}?limit=${limit}&offset=${offset}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching products by category:", error);
            throw error;
        }
    }

    async getOne(id: string): Promise<{ product: Product, message: string }> {
        try {
            const response: AxiosResponse<{ product: Product, message: string }> = await axios.get(
                `${API_BASE_URL}/product/get-one/${id}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching product:", error);
            throw error;
        }
    }
}

export class SearchService {
    private accessToken: string | null = null;

    constructor(accessToken?: string) {
        this.accessToken = accessToken || this.getStoredAccessToken();
    }

    private getStoredAccessToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    }

    private getAuthHeaders() {
        const token = this.accessToken || this.getStoredAccessToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async search(query: string, limit: number = 20, offset: number = 0): Promise<SearchResponse> {
        try {
            const response: AxiosResponse<SearchResponse> = await axios.get(
                `${API_BASE_URL}/search/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error searching:", error);
            throw error;
        }
    }
}

export class CartService {
    private accessToken: string | null = null;

    constructor(accessToken?: string) {
        this.accessToken = accessToken || this.getStoredAccessToken();
    }

    private getStoredAccessToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    }

    private getAuthHeaders() {
        const token = this.accessToken || this.getStoredAccessToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async create(cartItem: Omit<CartItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ cartItem: CartItem, message: string }> {
        try {
            const response: AxiosResponse<{ cartItem: CartItem, message: string }> = await axios.post(
                `${API_BASE_URL}/cart/create`,
                cartItem,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error creating cart item:", error);
            throw error;
        }
    }

    async getAll(limit: number = 10, offset: number = 0): Promise<{ cartItems: CartItem[], message: string }> {
        try {
            const response: AxiosResponse<{ cartItems: CartItem[], message: string }> = await axios.get(
                `${API_BASE_URL}/cart/get-all?limit=${limit}&offset=${offset}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching all cart items:", error);
            throw error;
        }
    }

    async getByUser(userId: string, limit: number = 10, offset: number = 0): Promise<{ cartItems: CartItem[], message: string }> {
        try {
            const response: AxiosResponse<{ cartItems: CartItem[], message: string }> = await axios.get(
                `${API_BASE_URL}/cart/get-by-user/${userId}?limit=${limit}&offset=${offset}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching user cart items:", error);
            throw error;
        }
    }

    async getByOrderId(orderId: string, limit: number = 10, offset: number = 0): Promise<{ cartItems: CartItem[], message: string }> {
        try {
            const response: AxiosResponse<{ cartItems: CartItem[], message: string }> = await axios.get(
                `${API_BASE_URL}/cart/get-by-order-id/${orderId}?limit=${limit}&offset=${offset}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching order cart items:", error);
            throw error;
        }
    }

    async getOne(id: string): Promise<{ cartItem: CartItem, message: string }> {
        try {
            const response: AxiosResponse<{ cartItem: CartItem, message: string }> = await axios.get(
                `${API_BASE_URL}/cart/get-one/${id}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching cart item:", error);
            throw error;
        }
    }

    async update(id: string, updateData: Partial<Omit<CartItem, 'id' | 'userId' | 'productId' | 'createdAt' | 'updatedAt'>>): Promise<{ cartItem: CartItem, message: string }> {
        try {
            const response: AxiosResponse<{ cartItem: CartItem, message: string }> = await axios.put(
                `${API_BASE_URL}/cart/update/${id}`,
                updateData,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating cart item:", error);
            throw error;
        }
    }

    async deleteById(id: string): Promise<{ message: string }> {
        try {
            const response: AxiosResponse<{ message: string }> = await axios.delete(
                `${API_BASE_URL}/cart/delete-by-id/${id}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting cart item:", error);
            throw error;
        }
    }

    async clearUserCart(userId: string): Promise<{ message: string, deletedCount: number }> {
        try {
            const response: AxiosResponse<{ message: string, deletedCount: number }> = await axios.delete(
                `${API_BASE_URL}/cart/clear-user-cart/${userId}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error clearing user cart:", error);
            throw error;
        }
    }

    async assignToOrder(orderId: string, cartItemIds: string[]): Promise<{ cartItems: CartItem[], message: string }> {
        try {
            const response: AxiosResponse<{ cartItems: CartItem[], message: string }> = await axios.post(
                `${API_BASE_URL}/cart/assign-to-order/${orderId}`,
                { cartItemIds },
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error assigning cart items to order:", error);
            throw error;
        }
    }
}

export class OrderService {
    private accessToken: string | null = null;

    constructor(accessToken?: string) {
        this.accessToken = accessToken || this.getStoredAccessToken();
    }

    private getStoredAccessToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    }

    private getAuthHeaders() {
        const token = this.accessToken || this.getStoredAccessToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'cartItems' | 'reference'> & { cartItemIds?: string[] }): Promise<{ order: Order, message: string }> {
        try {
            const response: AxiosResponse<{ order: Order, message: string }> = await axios.post(
                `${API_BASE_URL}/order/create`,
                order,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    }

    async initializePayment(orderId: string, paymentData: { email: string; metadata?: Record<string, any> }): Promise<{ paymentUrl: string; reference: string; message: string }> {
        try {
            const response: AxiosResponse<{ paymentUrl: string; reference: string; message: string }> = await axios.post(
                `${API_BASE_URL}/order/initialize-payment/${orderId}`,
                paymentData,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error initializing payment:", error);
            throw error;
        }
    }

    async verifyPayment(paymentData: { reference: string; orderId: string }): Promise<{ order: Order; paymentStatus: string; message: string }> {
        try {
            const response: AxiosResponse<{ order: Order; paymentStatus: string; message: string }> = await axios.post(
                `${API_BASE_URL}/order/verify-payment`,
                paymentData,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error verifying payment:", error);
            throw error;
        }
    }

    async getAll(limit: number = 10, offset: number = 0): Promise<{ orders: Order[], message: string }> {
        try {
            const response: AxiosResponse<{ orders: Order[], message: string }> = await axios.get(
                `${API_BASE_URL}/order/get-all?limit=${limit}&offset=${offset}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching all orders:", error);
            throw error;
        }
    }

    async getByUser(userId: string, limit: number = 10, offset: number = 0): Promise<{ orders: Order[], message: string }> {
        try {
            const response: AxiosResponse<{ orders: Order[], message: string }> = await axios.get(
                `${API_BASE_URL}/order/get-by-user/${userId}?limit=${limit}&offset=${offset}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching user orders:", error);
            throw error;
        }
    }

    async getOne(id: string): Promise<{ order: Order, message: string }> {
        try {
            const response: AxiosResponse<{ order: Order, message: string }> = await axios.get(
                `${API_BASE_URL}/order/get-one/${id}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching order:", error);
            throw error;
        }
    }

    async updateStatus(id: string, statusData: { status: OrderStatus }): Promise<{ order: Order, message: string }> {
        try {
            const response: AxiosResponse<{ order: Order, message: string }> = await axios.put(
                `${API_BASE_URL}/order/update-status/${id}`,
                statusData,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    }

    async deleteById(id: string): Promise<{ message: string }> {
        try {
            const response: AxiosResponse<{ message: string }> = await axios.delete(
                `${API_BASE_URL}/order/delete-by-id/${id}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting order:", error);
            throw error;
        }
    }
}

export class UserService {
    private accessToken: string | null = null;

    constructor(accessToken?: string) {
        this.accessToken = accessToken || this.getStoredAccessToken();
    }

    private getStoredAccessToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    }

    private getAuthHeaders() {
        const token = this.accessToken || this.getStoredAccessToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ user: Omit<User, 'password'>, message: string }> {
        try {
            const response: AxiosResponse<{ user: Omit<User, 'password'>, message: string }> = await axios.post(
                `${API_BASE_URL}/user/create`,
                user,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

    async getAll(limit: number = 10, offset: number = 0): Promise<{
        users: Omit<User, 'password'>[],
        pagination: { limit: number, offset: number, total: number },
        message: string
    }> {
        try {
            const response: AxiosResponse<{
                users: Omit<User, 'password'>[],
                pagination: { limit: number, offset: number, total: number },
                message: string
            }> = await axios.get(
                `${API_BASE_URL}/user/get-all?limit=${limit}&offset=${offset}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw error;
        }
    }

    async getByUuid(uuid: string): Promise<{ user: Omit<User, 'password'> }> {
        try {
            const response: AxiosResponse<{ user: Omit<User, 'password'> }> = await axios.get(
                `${API_BASE_URL}/user/get-by-uuid/${uuid}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching user by UUID:", error);
            throw error;
        }
    }

    async getByEmail(email: string): Promise<{ user: Omit<User, 'password'> | null, message?: string }> {
        try {
            const response: AxiosResponse<{ user: Omit<User, 'password'> | null, message?: string }> = await axios.get(
                `${API_BASE_URL}/user/get-by-email/${email}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching user by email:", error);
            throw error;
        }
    }

    async getByPhone(phone: string): Promise<{ user: Omit<User, 'password'> | null, message?: string }> {
        try {
            const response: AxiosResponse<{ user: Omit<User, 'password'> | null, message?: string }> = await axios.get(
                `${API_BASE_URL}/user/get-by-phone/${phone}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching user by phone:", error);
            throw error;
        }
    }

    async getRegisteredUsers(limit: number = 10, offset: number = 0): Promise<{
        users: Omit<User, 'password'>[],
        pagination: { limit: number, offset: number, total: number },
        message: string
    }> {
        try {
            const response: AxiosResponse<{
                users: Omit<User, 'password'>[],
                pagination: { limit: number, offset: number, total: number },
                message: string
            }> = await axios.get(
                `${API_BASE_URL}/user/get-registered-users?limit=${limit}&offset=${offset}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching registered users:", error);
            throw error;
        }
    }

    async getGuestUsers(limit: number = 10, offset: number = 0): Promise<{
        users: Omit<User, 'password'>[],
        pagination: { limit: number, offset: number, total: number },
        message: string
    }> {
        try {
            const response: AxiosResponse<{
                users: Omit<User, 'password'>[],
                pagination: { limit: number, offset: number, total: number },
                message: string
            }> = await axios.get(
                `${API_BASE_URL}/user/get-guest-users?limit=${limit}&offset=${offset}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching guest users:", error);
            throw error;
        }
    }

    async update(uuid: string, updateData: Partial<Omit<User, 'id' | 'guestUuid' | 'createdAt' | 'updatedAt'>>): Promise<{ user: Omit<User, 'password'>, message: string }> {
        try {
            const response: AxiosResponse<{ user: Omit<User, 'password'>, message: string }> = await axios.put(
                `${API_BASE_URL}/user/update/${uuid}`,
                updateData,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    async deleteByUuid(uuid: string): Promise<{ message: string }> {
        try {
            const response: AxiosResponse<{ message: string }> = await axios.delete(
                `${API_BASE_URL}/user/delete-by-uuid/${uuid}`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }

    async convertToRegistered(uuid: string, userData: { email: string; password: string; phone?: string; firstName?: string; lastName?: string }): Promise<{ user: Omit<User, 'password'>, message: string }> {
        try {
            const response: AxiosResponse<{ user: Omit<User, 'password'>, message: string }> = await axios.post(
                `${API_BASE_URL}/user/convert-to-registered/${uuid}`,
                userData,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error converting user to registered:", error);
            throw error;
        }
    }

    async profile(): Promise<{ message: string, user: Omit<User, 'password'> }> {
        try {
            const response: AxiosResponse<{ message: string, user: Omit<User, 'password'> }> = await axios.get(
                `${API_BASE_URL}/user/profile`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    }
}

export class AdminService {
    private accessToken: string | null = null;

    constructor(accessToken?: string) {
        this.accessToken = accessToken || this.getStoredAccessToken();
    }

    private getStoredAccessToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    }

    private getAuthHeaders() {
        const token = this.accessToken || this.getStoredAccessToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async create(adminData: { email: string; password: string }): Promise<{ admin: Omit<Admin, 'password'>, message: string }> {
        try {
            const response: AxiosResponse<{ admin: Omit<Admin, 'password'>, message: string }> = await axios.post(
                `${API_BASE_URL}/admin/create`,
                adminData,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error creating admin:", error);
            throw error;
        }
    }

    async login(credentials: { email: string; password: string }): Promise<{ token: string, message: string }> {
        try {
            const response: AxiosResponse<{ token: string, message: string }> = await axios.post(
                `${API_BASE_URL}/admin/login`,
                credentials,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error logging in admin:", error);
            throw error;
        }
    }

    async profile(): Promise<{ message: string, adminProfile: { email: string, createdAt: Date } }> {
        try {
            const response: AxiosResponse<{ message: string, adminProfile: { email: string, createdAt: Date } }> = await axios.get(
                `${API_BASE_URL}/admin/profile`,
                { headers: this.getAuthHeaders() }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching admin profile:", error);
            throw error;
        }
    }
}

// Convenience exports for backward compatibility
export const categoryApi = new CategoryService();
export const productApi = new ProductService();
export const searchApi = new SearchService();
export const cartApi = new CartService();
export const orderApi = new OrderService();
export const userApi = new UserService();
export const adminApi = new AdminService();