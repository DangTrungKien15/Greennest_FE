// Admin Service - Xử lý admin dashboard
import { apiService } from './index';

export const adminService = {
  async getAdminStats() {
    return apiService.request<{
      totalRevenue: number;
      totalOrders: number;
      totalCustomers: number;
      totalProducts: number;
      revenueGrowth: number;
      ordersGrowth: number;
    }>('/api/admin/stats');
  },

  async getAdminOrders(params?: {
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
    const endpoint = queryString ? `/api/admin/orders?${queryString}` : '/api/admin/orders';
    
    return apiService.request<{
      orders: any[];
      pagination: any;
    }>(endpoint);
  }
};
