// Order Service - Xử lý đơn hàng
import { apiService } from './index';

export const orderService = {
  async createOrder(orderData: {
    items: Array<{
      productId: string;
      quantity: number;
    }>;
    shippingAddress: {
      name: string;
      phone: string;
      address: string;
      city: string;
      district: string;
      ward: string;
    };
    paymentMethod: 'cod' | 'bank_transfer' | 'payos';
    notes?: string;
  }) {
    return apiService.request<{
      order: {
        id: string;
        userId: string;
        items: any[];
        total: number;
        status: 'pending' | 'processing' | 'completed' | 'cancelled';
        shippingAddress: any;
        paymentMethod: string;
        notes?: string;
        createdAt: string;
      };
    }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/orders?${queryString}` : '/api/orders';
    
    return apiService.request<{
      orders: Array<{
        id: string;
        userId: string;
        items: any[];
        total: number;
        status: string;
        shippingAddress: any;
        paymentMethod: string;
        notes?: string;
        createdAt: string;
        updatedAt: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(endpoint);
  },

  async getOrder(id: string) {
    return apiService.request<{
      id: string;
      userId: string;
      items: any[];
      total: number;
      status: string;
      shippingAddress: any;
      paymentMethod: string;
      notes?: string;
      createdAt: string;
      updatedAt: string;
    }>(`/api/orders/${id}`);
  }
};
