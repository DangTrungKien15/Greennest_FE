// Product Service - Xử lý sản phẩm
import { apiService } from './index';

export const productService = {
  // Get all products with pagination, search, and filter
  async getProducts(params?: {
    page?: number;
    limit?: number;
    categoryId?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    console.log('Fetching products from API...');
    console.log('Products API params:', params);
    
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/products?${queryString}` : '/api/products';
    
    console.log('Products API endpoint:', endpoint);
    
    const response = await apiService.request<any>(endpoint);
    
    console.log('Products API response:', response);
    console.log('Products API response type:', typeof response);
    console.log('Products API response keys:', Object.keys(response || {}));
    
    // Handle different possible response formats
    if (Array.isArray(response)) {
      console.log('Response is direct array, wrapping in expected format');
      return {
        products: response,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: response.length,
          totalPages: Math.ceil(response.length / (params?.limit || 20))
        }
      };
    } else if (response && typeof response === 'object') {
      if (response.products && Array.isArray(response.products)) {
        console.log('Response has products array');
        return response;
      } else if (response.data && Array.isArray(response.data)) {
        console.log('Response has data array, mapping to products');
        return {
          products: response.data,
          pagination: response.pagination || {
            page: params?.page || 1,
            limit: params?.limit || 20,
            total: response.data.length,
            totalPages: Math.ceil(response.data.length / (params?.limit || 20))
          }
        };
      } else if (response.items && Array.isArray(response.items)) {
        console.log('Response has items array, mapping to products');
        return {
          products: response.items,
          pagination: response.pagination || {
            page: params?.page || 1,
            limit: params?.limit || 20,
            total: response.items.length,
            totalPages: Math.ceil(response.items.length / (params?.limit || 20))
          }
        };
      }
    }
    
    console.warn('Unexpected response format:', response);
    return {
      products: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: 0,
        totalPages: 0
      }
    };
  },

  // Get product by ID
  async getProduct(id: string) {
    console.log(`Fetching product ${id} from API...`);
    const response = await apiService.request<{
      productId: number;
      name: string;
      description: string;
      price: number;
      imageUrl?: string;
      mainImage?: string;
      images?: string[];
      categoryId: number;
      category?: {
        categoryId: number;
        name: string;
      };
      stock: number;
      rating?: number;
      createdAt: string;
      updatedAt: string;
    }>(`/api/products/${id}`);
    
    console.log('Product by ID API response:', response);
    return response;
  },

  // Get products by category ID
  async getProductsByCategory(categoryId: number, params?: {
    page?: number;
    limit?: number;
    q?: string; // API uses 'q' instead of 'search'
  }) {
    console.log(`Fetching products for category ${categoryId}...`);
    console.log('Category products API params:', params);
    
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `/api/categories/${categoryId}/products?${queryString}` 
      : `/api/categories/${categoryId}/products`;
    
    console.log('Products by category API endpoint:', endpoint);
    
    const response = await apiService.request<any>(endpoint);
    
    console.log('Products by category API response:', response);
    console.log('Products by category API response type:', typeof response);
    console.log('Products by category API response keys:', Object.keys(response || {}));
    
    // Handle different possible response formats
    if (Array.isArray(response)) {
      console.log('Response is direct array, wrapping in expected format');
      return {
        products: response,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: response.length,
          totalPages: Math.ceil(response.length / (params?.limit || 20))
        }
      };
    } else if (response && typeof response === 'object') {
      if (response.products && Array.isArray(response.products)) {
        console.log('Response has products array');
        return response;
      } else if (response.data && Array.isArray(response.data)) {
        console.log('Response has data array, mapping to products');
        return {
          products: response.data,
          pagination: response.pagination || {
            page: params?.page || 1,
            limit: params?.limit || 20,
            total: response.data.length,
            totalPages: Math.ceil(response.data.length / (params?.limit || 20))
          }
        };
      } else if (response.items && Array.isArray(response.items)) {
        console.log('Response has items array, mapping to products');
        return {
          products: response.items,
          pagination: response.pagination || {
            page: params?.page || 1,
            limit: params?.limit || 20,
            total: response.items.length,
            totalPages: Math.ceil(response.items.length / (params?.limit || 20))
          }
        };
      }
    }
    
    console.warn('Unexpected response format:', response);
    return {
      products: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: 0,
        totalPages: 0
      }
    };
  },

  // Create product (Admin only)
  async createProduct(productData: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    stock: number;
    imageUrl?: string;
    mainImage?: string;
    images?: string[];
  }) {
    console.log('Creating product...');
    const response = await apiService.request<{
      productId: number;
      name: string;
      description: string;
      price: number;
      imageUrl?: string;
      mainImage?: string;
      images?: string[];
      categoryId: number;
      stock: number;
      createdAt: string;
      updatedAt: string;
    }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    
    console.log('Create product API response:', response);
    return response;
  },

  // Update product (Admin only)
  async updateProduct(id: number, productData: {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: number;
    stock?: number;
    imageUrl?: string;
    mainImage?: string;
    images?: string[];
  }) {
    console.log(`Updating product ${id}...`);
    const response = await apiService.request<{
      productId: number;
      name: string;
      description: string;
      price: number;
      imageUrl?: string;
      mainImage?: string;
      images?: string[];
      categoryId: number;
      stock: number;
      createdAt: string;
      updatedAt: string;
    }>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    
    console.log('Update product API response:', response);
    return response;
  },

  // Delete product (Admin only)
  async deleteProduct(id: number) {
    console.log(`Deleting product ${id}...`);
    const response = await apiService.request(`/api/products/${id}`, {
      method: 'DELETE',
    });
    
    console.log('Delete product API response:', response);
    return response;
  }
};
