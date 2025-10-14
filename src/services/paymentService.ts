// Payment Service - Xử lý thanh toán
import { apiService } from './index';

export const paymentService = {
  // Tạo PayOS payment link cho order
  async createPayOSLink(orderId: number, orderCode?: string) {
    console.log(`Creating PayOS payment link for order ${orderId}...`);
    
    // Get current domain for return/cancel URLs
    const baseUrl = window.location.origin;
    
    const response = await apiService.request<{
      paymentId: number;
      orderId: number;
      orderCode: string;
      amount: number;
      checkoutUrl: string;
      status: string;
    }>(`/api/payments/order/${orderId}/payos-link`, {
      method: 'POST',
      body: JSON.stringify({
        returnUrl: `${baseUrl}/payment-success`,
        cancelUrl: `${baseUrl}/payment-cancel${orderCode ? `?orderCode=${orderCode}` : ''}`
      }),
    });
    
    console.log('Create PayOS link API response:', response);
    return response;
  }
};
