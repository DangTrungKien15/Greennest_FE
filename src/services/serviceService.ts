// Service Service - Xử lý dịch vụ
import { apiService } from './index';

export const serviceService = {
  async getServices() {
    return apiService.request<Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      image: string;
      duration: string;
      createdAt: string;
      updatedAt: string;
    }>>('/api/services');
  },

  async getService(id: string) {
    return apiService.request<{
      id: string;
      name: string;
      description: string;
      price: number;
      image: string;
      duration: string;
      createdAt: string;
      updatedAt: string;
    }>(`/api/services/${id}`);
  }
};
