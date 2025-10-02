// Payment Service - Xử lý thanh toán
import { apiService } from './index';

export const paymentService = {
  // Tạo PayOS payment link cho order
  async createPayOSLink(orderId: number) {
    console.log(`Creating PayOS payment link for order ${orderId}...`);
    const response = await apiService.request<{
      paymentId: number;
      orderId: number;
      orderCode: string;
      amount: number;
      checkoutUrl: string;
      status: string;
    }>(`/api/payments/order/${orderId}/payos-link`, {
      method: 'POST',
    });
    
    console.log('Create PayOS link API response:', response);
    return response;
  }
};
