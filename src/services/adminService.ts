// Admin Service - Xử lý admin dashboard
import { apiService } from './index';

export const adminService = {
  // Dashboard overview (tổng quan)
  async getDashboardOverview() {
    console.log('Fetching dashboard overview from API...');
    const response = await apiService.request<{
      userCount: number;
      productCount: number;
      orderCount: number;
      revenue: number;
      reviewCount: number;
      ordersByStatus: Array<{
        status: string;
        count: number;
      }>;
    }>('/api/dashboard/overview');
    
    console.log('Dashboard overview API response:', response);
    return response;
  },

  // Revenue by days (last 7 days)
  async getRevenueByDays() {
    console.log('Fetching revenue by days from API...');
    const response = await apiService.request<Array<{
      date: string;
      total: string;
    }>>('/api/dashboard/revenue/days');
    
    console.log('Revenue by days API response:', response);
    return response;
  },

  // Top selling products
  async getTopProducts() {
    console.log('Fetching top products from API...');
    const response = await apiService.request<Array<{
      productId: number;
      soldQuantity: string;
      revenue: string;
      product: {
        productId: number;
        name: string;
        imageUrl: string;
      };
    }>>('/api/dashboard/top-products');
    
    console.log('Top products API response:', response);
    return response;
  },

  // New users
  async getNewUsers() {
    console.log('Fetching new users from API...');
    const response = await apiService.request<Array<{
      userId: number;
      email: string;
      createdAt: string;
    }>>('/api/dashboard/new-users');
    
    console.log('New users API response:', response);
    return response;
  },

  async getAdminStats() {
    console.log('Fetching admin stats from API...');
    const response = await apiService.request<{
      totalRevenue: number;
      totalOrders: number;
      totalCustomers: number;
      totalProducts: number;
      revenueGrowth: number;
      ordersGrowth: number;
      conversionRate?: number;
      averageOrderValue?: number;
    }>('/api/admin/stats');
    
    console.log('Admin stats API response:', response);
    return response;
  },

  async getAdminOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    console.log('Fetching admin orders from API...');
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
    
    const response = await apiService.request<{
      orders: any[];
      pagination: any;
    }>(endpoint);
    
    console.log('Admin orders API response:', response);
    return response;
  },

  // ===== USER MANAGEMENT APIs =====
  
  // Get all users with pagination
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) {
    console.log('Fetching users from API...');
    console.log('Users API params:', params);
    
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/users?${queryString}` : '/api/users';
    
    console.log('Users API endpoint:', endpoint);
    
    const response = await apiService.request<any>(endpoint);
    
    console.log('Users API response:', response);
    console.log('Users API response type:', typeof response);
    console.log('Users API response keys:', Object.keys(response || {}));
    
    // Handle different possible response formats
    if (Array.isArray(response)) {
      // If response is directly an array
      console.log('Response is direct array, wrapping in expected format');
      return {
        users: response,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: response.length,
          totalPages: Math.ceil(response.length / (params?.limit || 20))
        }
      };
    } else if (response && typeof response === 'object') {
      // If response has users property
      if (response.users && Array.isArray(response.users)) {
        console.log('Response has users array');
        return response;
      }
      // If response has data property
      else if (response.data && Array.isArray(response.data)) {
        console.log('Response has data array, mapping to users');
        return {
          users: response.data,
          pagination: response.pagination || {
            page: params?.page || 1,
            limit: params?.limit || 20,
            total: response.data.length,
            totalPages: Math.ceil(response.data.length / (params?.limit || 20))
          }
        };
      }
      // If response has items property
      else if (response.items && Array.isArray(response.items)) {
        console.log('Response has items array, mapping to users');
        return {
          users: response.items,
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
      users: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: 0,
        totalPages: 0
      }
    };
  },

  // Get user by ID
  async getUserById(id: number) {
    console.log(`Fetching user ${id} from API...`);
    const response = await apiService.request<{
      userId: number;
      email: string;
      firstName: string;
      lastName: string;
      role: 'USER' | 'ADMIN' | 'STAFF' | 'SHIPPER';
      phone?: string;
      image?: string;
      createdAt: string;
    }>(`/api/users/${id}`);
    
    console.log('User by ID API response:', response);
    return response;
  },

  // Update user (cannot change role)
  async updateUser(id: number, userData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    image?: string;
  }) {
    console.log(`Updating user ${id}...`);
    const response = await apiService.request<{
      userId: number;
      email: string;
      firstName: string;
      lastName: string;
      role: 'USER' | 'ADMIN' | 'STAFF' | 'SHIPPER';
      phone?: string;
      image?: string;
    }>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    
    console.log('Update user API response:', response);
    return response;
  },

  // Delete user
  async deleteUser(id: number) {
    console.log(`Deleting user ${id}...`);
    const response = await apiService.request(`/api/users/${id}`, {
      method: 'DELETE',
    });
    
    console.log('Delete user API response:', response);
    return response;
  },

  // Create ADMIN account
  async createAdminAccount(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    console.log('Creating ADMIN account...');
    const response = await apiService.request<{
      userId: number;
      email: string;
      firstName: string;
      lastName: string;
      role: 'ADMIN';
      phone?: string;
    }>('/api/users/admin', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    console.log('Create ADMIN API response:', response);
    return response;
  },

  // Create STAFF account
  async createStaffAccount(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    console.log('Creating STAFF account...');
    const response = await apiService.request<{
      userId: number;
      email: string;
      firstName: string;
      lastName: string;
      role: 'STAFF';
      phone?: string;
    }>('/api/users/staff', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    console.log('Create STAFF API response:', response);
    return response;
  },

  // Create SHIPPER account
  async createShipperAccount(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    console.log('Creating SHIPPER account...');
    const response = await apiService.request<{
      userId: number;
      email: string;
      firstName: string;
      lastName: string;
      role: 'SHIPPER';
      phone?: string;
    }>('/api/users/shipper', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    console.log('Create SHIPPER API response:', response);
    return response;
  },

  // Get users count
  async getUsersCount() {
    console.log('Fetching users count from API...');
    const response = await apiService.request<{
      count: number;
    }>('/api/users/count');
    
    console.log('Users count API response:', response);
    return response;
  },

  // ===== ROLE MANAGEMENT APIs =====
  
  // Get all roles
  async getRoles() {
    console.log('Fetching roles from API...');
    const response = await apiService.request<Array<{
      id: number;
      name: string;
      description?: string;
      createdAt: string;
    }>>('/api/roles');
    
    console.log('Roles API response:', response);
    console.log('Roles API response type:', typeof response);
    console.log('Roles API response is array:', Array.isArray(response));
    
    // Ensure we return an array
    if (Array.isArray(response)) {
      return response;
    } else {
      console.warn('Roles API returned non-array response:', response);
      return [];
    }
  },

  // Get role by ID
  async getRoleById(id: number) {
    console.log(`Fetching role ${id} from API...`);
    const response = await apiService.request<{
      id: number;
      name: string;
      description?: string;
      createdAt: string;
    }>(`/api/roles/${id}`);
    
    console.log('Role by ID API response:', response);
    return response;
  },

  // Create role
  async createRole(roleData: {
    name: string;
    description?: string;
  }) {
    console.log('Creating role...');
    const response = await apiService.request<{
      id: number;
      name: string;
      description?: string;
      createdAt: string;
    }>('/api/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
    
    console.log('Create role API response:', response);
    return response;
  },

  // Update role
  async updateRole(id: number, roleData: {
    name?: string;
    description?: string;
  }) {
    console.log(`Updating role ${id}...`);
    const response = await apiService.request<{
      id: number;
      name: string;
      description?: string;
      createdAt: string;
    }>(`/api/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
    
    console.log('Update role API response:', response);
    return response;
  },

  // Delete role
  async deleteRole(id: number) {
    console.log(`Deleting role ${id}...`);
    const response = await apiService.request(`/api/roles/${id}`, {
      method: 'DELETE',
    });
    
    console.log('Delete role API response:', response);
    return response;
  },

  // ===== CATEGORY MANAGEMENT APIs =====
  
  // Get all categories with pagination and search
  async getCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    console.log('Fetching categories from API...');
    console.log('Categories API params:', params);
    
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/categories?${queryString}` : '/api/categories';
    
    console.log('Categories API endpoint:', endpoint);
    
    const response = await apiService.request<any>(endpoint);
    
    console.log('Categories API response:', response);
    console.log('Categories API response type:', typeof response);
    console.log('Categories API response keys:', Object.keys(response || {}));
    
    // Handle different possible response formats
    if (Array.isArray(response)) {
      console.log('Response is direct array, wrapping in expected format');
      return {
        categories: response,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: response.length,
          totalPages: Math.ceil(response.length / (params?.limit || 20))
        }
      };
    } else if (response && typeof response === 'object') {
      if (response.categories && Array.isArray(response.categories)) {
        console.log('Response has categories array');
        return response;
      } else if (response.data && Array.isArray(response.data)) {
        console.log('Response has data array, mapping to categories');
        return {
          categories: response.data,
          pagination: response.pagination || {
            page: params?.page || 1,
            limit: params?.limit || 20,
            total: response.data.length,
            totalPages: Math.ceil(response.data.length / (params?.limit || 20))
          }
        };
      } else if (response.items && Array.isArray(response.items)) {
        console.log('Response has items array, mapping to categories');
        return {
          categories: response.items,
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
      categories: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: 0,
        totalPages: 0
      }
    };
  },

  // Get category by ID
  async getCategoryById(id: number) {
    console.log(`Fetching category ${id} from API...`);
    const response = await apiService.request<{
      categoryId: number;
      name: string;
      description?: string;
      imageUrl?: string;
      createdAt: string;
      updatedAt: string;
    }>(`/api/categories/${id}`);
    
    console.log('Category by ID API response:', response);
    return response;
  },

  // Create category
  async createCategory(categoryData: {
    name: string;
    description?: string;
    imageUrl?: string;
  }) {
    console.log('Creating category...');
    const response = await apiService.request<{
      categoryId: number;
      name: string;
      description?: string;
      imageUrl?: string;
      createdAt: string;
      updatedAt: string;
    }>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    
    console.log('Create category API response:', response);
    return response;
  },

  // Update category
  async updateCategory(id: number, categoryData: {
    name?: string;
    description?: string;
    imageUrl?: string;
  }) {
    console.log(`Updating category ${id}...`);
    const response = await apiService.request<{
      categoryId: number;
      name: string;
      description?: string;
      imageUrl?: string;
      createdAt: string;
      updatedAt: string;
    }>(`/api/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    });
    
    console.log('Update category API response:', response);
    return response;
  },

  // Delete category
  async deleteCategory(id: number) {
    console.log(`Deleting category ${id}...`);
    const response = await apiService.request(`/api/categories/${id}`, {
      method: 'DELETE',
    });
    
    console.log('Delete category API response:', response);
    return response;
  },

  // ===== PRODUCT MANAGEMENT APIs =====
  
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
  async getProductById(id: number) {
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

  // Create product with file upload
  async createProduct(productData: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    discount?: number;
    image?: File;
  }) {
    console.log('Creating product with file upload...');
    
    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    formData.append('categoryId', productData.categoryId.toString());
    
    if (productData.discount !== undefined) {
      formData.append('discount', productData.discount.toString());
    }
    
    // Add image file if provided
    if (productData.image) {
      formData.append('image', productData.image);
    }
    
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    const response = await apiService.request<{
      productId: number;
      name: string;
      description: string;
      price: number;
      imageUrl: string;
      categoryId: number;
      totalStock: number;
      createdAt: string;
      updatedAt: string;
    }>('/api/products', {
      method: 'POST',
      body: formData,
      // Remove Content-Type header to let browser set it with boundary
      headers: {
        // Don't set Content-Type, let browser set it with boundary for multipart/form-data
      }
    });
    
    console.log('Create product API response:', response);
    return response;
  },

  // Update product with file upload
  async updateProduct(id: number, productData: {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: number;
    discount?: number;
    image?: File;
  }) {
    console.log(`Updating product ${id}...`);
    console.log('Update product data:', productData);
    
    // Create FormData for multipart/form-data
    const formData = new FormData();
    
    if (productData.name !== undefined) {
      formData.append('name', productData.name);
    }
    if (productData.description !== undefined) {
      formData.append('description', productData.description);
    }
    if (productData.price !== undefined) {
      formData.append('price', productData.price.toString());
    }
    if (productData.categoryId !== undefined) {
      formData.append('categoryId', productData.categoryId.toString());
    }
    if (productData.discount !== undefined) {
      formData.append('discount', productData.discount.toString());
    }
    
    // Add image file if provided
    if (productData.image) {
      formData.append('image', productData.image);
    }
    
    console.log('Update FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    const response = await apiService.request<{
      productId: number;
      name: string;
      description: string;
      price: number;
      imageUrl: string;
      categoryId: number;
      totalStock: number;
      createdAt: string;
      updatedAt: string;
    }>(`/api/products/${id}`, {
      method: 'PUT',
      body: formData,
      // Remove Content-Type header to let browser set it with boundary
      headers: {
        // Don't set Content-Type, let browser set it with boundary for multipart/form-data
      }
    });
    
    console.log('Update product API response:', response);
    return response;
  },

  // Delete product
  async deleteProduct(id: number) {
    console.log(`Deleting product ${id}...`);
    const response = await apiService.request(`/api/products/${id}`, {
      method: 'DELETE',
    });
    
    console.log('Delete product API response:', response);
    return response;
  }
};
