// Cart Service - Xử lý giỏ hàng
import { apiService } from './index';

export const cartService = {
  async getCart() {
    return apiService.request<{
      items: Array<{
        id: string;
        product: {
          id: string;
          name: string;
          description: string;
          price: number;
          image: string;
          category: string;
          stock: number;
          rating: number;
        };
        quantity: number;
        createdAt: string;
      }>;
      total: number;
      itemCount: number;
    }>('/api/cart');
  },

  async addToCart(productId: string, quantity: number = 1) {
    return apiService.request<{
      message: string;
      item: {
        id: string;
        product: any;
        quantity: number;
      };
    }>('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  async updateCartItem(itemId: string, quantity: number) {
    return apiService.request<{
      message: string;
      item: any;
    }>(`/api/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  async removeFromCart(itemId: string) {
    return apiService.request<{
      message: string;
    }>(`/api/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  async clearCart() {
    return apiService.request<{
      message: string;
    }>('/api/cart/clear', {
      method: 'DELETE',
    });
  }
};
