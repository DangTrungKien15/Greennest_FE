// Inventory Service - Quản lý tồn kho
import { apiService } from './index';

export const inventoryService = {
  // Get all inventories with pagination and filtering
  async getInventories(params?: {
    page?: number;
    limit?: number;
    search?: string;
    productId?: number;
    sku?: string;
  }) {
    console.log('Fetching inventories from API...');
    console.log('Inventories API params:', params);
    
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/api/inventories?${queryString}` : '/api/inventories';
    
    console.log('Inventories API endpoint:', endpoint);
    
    const response = await apiService.request<any>(endpoint);
    
    console.log('Inventories API response:', response);
    console.log('Inventories API response type:', typeof response);
    console.log('Inventories API response keys:', Object.keys(response || {}));
    
    // Handle different possible response formats
    if (Array.isArray(response)) {
      console.log('Response is direct array, wrapping in expected format');
      return {
        inventories: response,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: response.length,
          totalPages: Math.ceil(response.length / (params?.limit || 20))
        }
      };
    } else if (response && typeof response === 'object') {
      if (response.inventories && Array.isArray(response.inventories)) {
        console.log('Response has inventories array');
        return response;
      } else if (response.data && Array.isArray(response.data)) {
        console.log('Response has data array, mapping to inventories');
        return {
          inventories: response.data,
          pagination: response.pagination || {
            page: params?.page || 1,
            limit: params?.limit || 20,
            total: response.data.length,
            totalPages: Math.ceil(response.data.length / (params?.limit || 20))
          }
        };
      } else if (response.items && Array.isArray(response.items)) {
        console.log('Response has items array, mapping to inventories');
        return {
          inventories: response.items,
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
      inventories: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: 0,
        totalPages: 0
      }
    };
  },

  // Get inventory by ID
  async getInventoryById(id: number) {
    console.log(`Fetching inventory ${id} from API...`);
    const response = await apiService.request<{
      inventoryId: number;
      productId: number;
      sku: string;
      quantity: number;
      reservedQuantity: number;
      availableQuantity: number;
      location?: string;
      createdAt: string;
      updatedAt: string;
    }>(`/api/inventories/${id}`);
    
    console.log('Inventory by ID API response:', response);
    return response;
  },

  // Get inventory by SKU
  async getInventoryBySku(sku: string) {
    console.log(`Fetching inventory by SKU ${sku} from API...`);
    const response = await apiService.request<{
      inventoryId: number;
      productId: number;
      sku: string;
      stock: number; // API uses 'stock' instead of 'quantity'
      createdAt: string;
      updatedAt: string;
    }>(`/api/inventories/sku/${sku}`);
    
    console.log('Inventory by SKU API response:', response);
    return response;
  },

  // Create inventory
  async createInventory(inventoryData: {
    productId: number;
    sku: string;
    stock: number; // API uses 'stock' instead of 'quantity'
  }) {
    console.log('Creating inventory...');
    console.log('Inventory data:', inventoryData);
    
    const response = await apiService.request<{
      inventoryId: number;
      productId: number;
      sku: string;
      stock: number;
      createdAt: string;
      updatedAt: string;
    }>('/api/inventories', {
      method: 'POST',
      body: JSON.stringify(inventoryData),
    });
    
    console.log('Create inventory API response:', response);
    return response;
  },

  // Update inventory
  async updateInventory(id: number, inventoryData: {
    stock?: number; // API uses 'stock' instead of 'quantity'
  }) {
    console.log(`Updating inventory ${id}...`);
    console.log('Update inventory data:', inventoryData);
    
    const response = await apiService.request<{
      inventoryId: number;
      productId: number;
      sku: string;
      stock: number;
      createdAt: string;
      updatedAt: string;
    }>(`/api/inventories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(inventoryData),
    });
    
    console.log('Update inventory API response:', response);
    return response;
  },

  // Adjust inventory (add/subtract quantity)
  async adjustInventory(id: number, delta: number, reason?: string) {
    console.log(`Adjusting inventory ${id} by ${delta}...`);
    console.log('Adjust inventory data:', { delta, reason });
    
    const response = await apiService.request<{
      inventoryId: number;
      productId: number;
      sku: string;
      stock: number;
      createdAt: string;
      updatedAt: string;
    }>(`/api/inventories/${id}/adjust`, {
      method: 'POST',
      body: JSON.stringify({ delta, reason }),
    });
    
    console.log('Adjust inventory API response:', response);
    return response;
  },

  // Delete inventory
  async deleteInventory(id: number) {
    console.log(`Deleting inventory ${id}...`);
    const response = await apiService.request(`/api/inventories/${id}`, {
      method: 'DELETE',
    });
    
    console.log('Delete inventory API response:', response);
    return response;
  }
};
