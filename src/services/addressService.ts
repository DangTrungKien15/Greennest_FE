// Address Service - Xử lý quản lý địa chỉ
import { apiService } from './index';
import { Address, AddressResponse } from '../types';

export const addressService = {
  // Lấy tất cả địa chỉ của user (có phân trang và lọc)
  async getAddresses(userId: string, page: number = 1, limit: number = 20, isDefault?: boolean) {
    console.log(`Getting addresses for user ${userId}...`);
    
    let url = `/api/addresses/user/${userId}?page=${page}&limit=${limit}`;
    if (isDefault !== undefined) {
      url += `&isDefault=${isDefault}`;
    }
    
    const response = await apiService.request<AddressResponse>(url);
    console.log('Get addresses API response:', response);
    return response;
  },

  // Lấy địa chỉ mặc định của user
  async getDefaultAddress(userId: string) {
    console.log(`Getting default address for user ${userId}...`);
    const response = await this.getAddresses(userId, 1, 1, true);
    
    if (response.items.length > 0) {
      return response.items[0];
    }
    return null;
  },

  // Thêm địa chỉ mới
  async addAddress(userId: string, addressData: {
    address: string;
    wardCode: string;
    district: string;
    province: string;
    country: string;
    isDefault?: boolean;
  }) {
    console.log(`Adding new address for user ${userId}...`);
    const response = await apiService.request<{
      message: string;
      address: Address;
    }>(`/api/addresses`, {
      method: 'POST',
      body: JSON.stringify({
        userId: parseInt(userId),
        ...addressData
      }),
    });
    
    console.log('Add address API response:', response);
    return response;
  },

  // Cập nhật địa chỉ
  async updateAddress(addressId: number, addressData: {
    address?: string;
    wardCode?: string;
    district?: string;
    province?: string;
    country?: string;
    isDefault?: boolean;
  }) {
    console.log(`Updating address ${addressId}...`);
    const response = await apiService.request<{
      message: string;
      address: Address;
    }>(`/api/addresses/${addressId}`, {
      method: 'PATCH',
      body: JSON.stringify(addressData),
    });
    
    console.log('Update address API response:', response);
    return response;
  },

  // Xóa địa chỉ
  async deleteAddress(addressId: number) {
    console.log(`Deleting address ${addressId}...`);
    const response = await apiService.request<{
      message: string;
    }>(`/api/addresses/${addressId}`, {
      method: 'DELETE',
    });
    
    console.log('Delete address API response:', response);
    return response;
  },

  // Đặt địa chỉ làm mặc định (sử dụng API chuyên dụng)
  async setDefaultAddress(userId: string, addressId: number) {
    console.log(`Setting address ${addressId} as default for user ${userId}...`);
    const response = await apiService.request<{
      message: string;
    }>(`/api/addresses/default`, {
      method: 'POST',
      body: JSON.stringify({
        userId: parseInt(userId),
        addressId: addressId
      }),
    });
    
    console.log('Set default address API response:', response);
    return response;
  }
};
