// Auth Service - Xử lý authentication
import { apiService } from './index';

// Helper function to decode JWT token
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export const authService = {
  async login(email: string, password: string) {
    console.log('AuthService login: Starting login process...');
    console.log('AuthService login: Email:', email);
    
    // Clear any existing token before login
    apiService.clearToken();
    
    const response = await apiService.request<{
      userId: string;
      email: string;
      firstName: string;
      lastName: string;
      role: 'USER' | 'ADMIN';
      phone?: string;
      image?: string;
      token: string;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Debug: Log API response
    console.log('AuthService login: API response received:', response);
    console.log('AuthService login: User role from API:', response.role);
    console.log('AuthService login: Token from API:', response.token ? 'Present' : 'Missing');

    // Decode JWT token to get user info
    const tokenPayload = decodeJWT(response.token);
    console.log('AuthService login: JWT Token payload:', tokenPayload);

    // Use JWT payload if API response is incomplete
    const userData = {
      userId: response.userId || tokenPayload?.sub?.toString() || '',
      email: response.email || tokenPayload?.email || email,
      firstName: response.firstName || tokenPayload?.firstName || '',
      lastName: response.lastName || tokenPayload?.lastName || '',
      role: response.role || tokenPayload?.role || 'USER',
      phone: response.phone || tokenPayload?.phone,
      image: response.image || tokenPayload?.image,
    };

    console.log('AuthService login: Final user data:', userData);

    // Transform response to match expected format
    return {
      user: userData,
      token: response.token // Use real token from backend
    };
  },

  async register(email: string, password: string, firstName: string, lastName: string, phone?: string, image?: string) {
    const response = await apiService.request<{
      userId: string;
      email: string;
      firstName: string;
      lastName: string;
      role: 'USER';
      phone?: string;
      image?: string;
      token: string;
    }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        password, 
        firstName, 
        lastName, 
        phone: phone || '', 
        image: image || '' 
      }),
    });

    // Transform response to match expected format
    return {
      user: {
        userId: response.userId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
        phone: response.phone,
        image: response.image,
      },
      token: response.token // Use real token from backend
    };
  },

  async getProfile() {
    return apiService.request<{
      userId: string;
      email: string;
      firstName: string;
      lastName: string;
      role: 'USER' | 'ADMIN';
      phone?: string;
      image?: string;
    }>('/api/auth/profile');
  }
};
