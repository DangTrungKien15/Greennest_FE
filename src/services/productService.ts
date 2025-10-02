// Product Service - Xử lý sản phẩm
import { apiService } from './index';

export const productService = {
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
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
    const endpoint = queryString ? `/api/products?${queryString}` : '/api/products';
    
    return apiService.request<{
      products: Array<{
        id: string;
        name: string;
        description: string;
        price: number;
        image: string;
        category: string;
        stock: number;
        rating: number;
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

  async getProduct(id: string) {
    return apiService.request<{
      id: string;
      name: string;
      description: string;
      price: number;
      image: string;
      category: string;
      stock: number;
      rating: number;
      createdAt: string;
      updatedAt: string;
    }>(`/api/products/${id}`);
  }
};
