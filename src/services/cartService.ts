// Cart Service - Xử lý giỏ hàng
import { apiService } from './index';

export const cartService = {
  // Lấy giỏ hàng theo userId (tự tạo nếu chưa có)
  async getCart(userId: string) {
    console.log(`Getting cart for user ${userId}...`);
    const response = await apiService.request<{
      cartId: number;
      userId: string;
      items: Array<{
        cartItemId: number;
        productId: number;
        quantity: number;
        product: {
          productId: number;
          name: string;
          description: string;
          price: number;
          imageUrl?: string;
          mainImage?: string;
          images?: string[];
          categoryId: number;
          stock: number;
          rating?: number;
        };
        createdAt: string;
        updatedAt: string;
      }>;
      totalAmount: number;
      itemCount: number;
      createdAt: string;
      updatedAt: string;
    }>(`/api/carts/${userId}`);
    
    console.log('Get cart API response:', response);
    return response;
  },

  // Lấy tất cả sản phẩm trong giỏ của user
  async getCartItems(userId: string) {
    console.log(`Getting cart items for user ${userId}...`);
    const response = await apiService.request<Array<{
      cartItemId: number;
      productId: number;
      quantity: number;
      product: {
        productId: number;
        name: string;
        description: string;
        price: number;
        mainImage: string;
        images?: string[];
        categoryId: number;
        stock: number;
        rating?: number;
      };
      createdAt: string;
      updatedAt: string;
    }>>(`/api/carts/${userId}/items`);
    
    console.log('Get cart items API response:', response);
    return response;
  },

  // Thêm sản phẩm vào giỏ (tự tạo giỏ nếu chưa có)
  async addToCart(userId: string, productId: number, quantity: number = 1) {
    console.log(`Adding product ${productId} to cart for user ${userId}...`);
    const response = await apiService.request<{
      message: string;
      cartItem: {
        cartItemId: number;
        productId: number;
        quantity: number;
        product: {
          productId: number;
          name: string;
          description: string;
          price: number;
          imageUrl?: string;
          mainImage?: string;
          images?: string[];
          categoryId: number;
          stock: number;
          rating?: number;
        };
        createdAt: string;
        updatedAt: string;
      };
    }>(`/api/carts/${userId}/items`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    
    console.log('Add to cart API response:', response);
    return response;
  },

  // Cập nhật số lượng 1 sản phẩm trong giỏ
  async updateCartItem(userId: string, productId: number, quantity: number) {
    console.log(`Updating cart item ${productId} for user ${userId} to quantity ${quantity}...`);
    const response = await apiService.request<{
      message: string;
      cartItem: {
        cartItemId: number;
        productId: number;
        quantity: number;
        product: {
          productId: number;
          name: string;
          description: string;
          price: number;
          imageUrl?: string;
          mainImage?: string;
          images?: string[];
          categoryId: number;
          stock: number;
          rating?: number;
        };
        createdAt: string;
        updatedAt: string;
      };
    }>(`/api/carts/${userId}/items`, {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
    
    console.log('Update cart item API response:', response);
    return response;
  },

  // Xoá 1 sản phẩm khỏi giỏ
  async removeFromCart(userId: string, productId: number) {
    console.log(`Removing product ${productId} from cart for user ${userId}...`);
    const response = await apiService.request<{
      message: string;
    }>(`/api/carts/${userId}/items`, {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
    
    console.log('Remove from cart API response:', response);
    return response;
  },

  // Xoá hết sản phẩm trong giỏ
  async clearCart(userId: string) {
    console.log(`Clearing cart for user ${userId}...`);
    const response = await apiService.request<{
      message: string;
    }>(`/api/carts/${userId}`, {
      method: 'DELETE',
    });
    
    console.log('Clear cart API response:', response);
    return response;
  }
};
