// Auth Service - Xử lý authentication
import { apiService } from './index';

export const authService = {
  async login(email: string, password: string) {
    return apiService.request<{
      user: {
        id: string;
        email: string;
        name: string;
        role: 'user' | 'admin';
        avatar?: string;
      };
      token: string;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(email: string, password: string, name: string) {
    return apiService.request<{
      user: {
        id: string;
        email: string;
        name: string;
        role: 'user';
        avatar?: string;
      };
      token: string;
    }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  async getProfile() {
    return apiService.request<{
      id: string;
      email: string;
      name: string;
      role: 'user' | 'admin';
      avatar?: string;
    }>('/api/auth/profile');
  }
};
