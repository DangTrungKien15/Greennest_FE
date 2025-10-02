// Order Service - Xử lý đơn hàng
import { apiService } from './index';

export const orderService = {
  // Tạo order từ giỏ hàng
  async createOrderFromCart(userId: string, addressId: number, notes?: string) {
    console.log(`Creating order from cart for user ${userId}...`);
    const response = await apiService.request<{
      orderId: number;
      orderCode: string;
      totalAmount: number | string;
      status: string;
      message: string;
    }>(`/api/orders/from-cart`, {
      method: 'POST',
      body: JSON.stringify({
        userId: parseInt(userId),
        addressId: addressId,
        notes: notes || ''
      }),
    });
    
    console.log('Create order from cart API response:', response);
    return response;
  },

  // Lấy danh sách orders với pagination và filter
  async getOrders(params: {
    page?: number;
    limit?: number;
    q?: string;
    status?: string;
  } = {}) {
    console.log('Getting orders with params:', params);
    
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.q) queryParams.append('q', params.q);
    if (params.status) queryParams.append('status', params.status);
    
    const endpoint = `/api/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await apiService.request<{
      items: Array<{
        orderId: number;
        orderCode: string;
        userId: number;
        addressId: number;
        totalAmount: number | string;
        totalPrice?: number | string;
        grandTotal?: number | string;
        status: string;
        notes?: string;
        createdAt: string;
        updatedAt: string;
        user?: {
          userId: number;
          email: string;
          fullName: string;
        };
        orderItems?: Array<{
          orderItemId: number;
          productId: number;
          quantity: number;
          price: number;
          product?: {
            productId: number;
            name: string;
            image?: string;
          };
        }>;
      }>;
      total: number;
      page: number;
      limit: number;
      pages: number;
    }>(endpoint);
    
    console.log('Get orders API response:', response);
    return response;
  },

  // Lấy thống kê tổng doanh thu
  async getRevenueStats() {
    console.log('Getting revenue stats...');
    const response = await apiService.request<{
      totalRevenue: number;
      totalOrders: number;
      averageOrderValue: number;
      revenueByStatus: {
        PENDING: number;
        PAID: number;
        SHIPPED: number;
        COMPLETED: number;
        CANCELED: number;
      };
    }>(`/api/orders/stats/revenue`);
    
    console.log('Get revenue stats API response:', response);
    return response;
  },

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(orderId: number, status: string) {
    console.log(`Updating order ${orderId} status to ${status}...`);
    const response = await apiService.request<{
      message: string;
      order: {
        orderId: number;
        orderCode: string;
        status: string;
        updatedAt: string;
      };
    }>(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    
    console.log('Update order status API response:', response);
    return response;
  },

  // Lấy thông tin order
  async getOrder(orderId: number) {
    console.log(`Getting order ${orderId}...`);
    const response = await apiService.request<{
      orderId: number;
      orderCode: string;
      userId: number;
      addressId: number;
      totalAmount: number | string;
      status: string;
      notes?: string;
      createdAt: string;
      updatedAt: string;
    }>(`/api/orders/${orderId}`);
    
    console.log('Get order API response:', response);
    return response;
  }
};