// Base API Service - Core functionality
const API_BASE_URL = 'https://greennestbe.onrender.com';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('greennest_token');
    console.log('ApiService initialized with token:', this.token ? 'Present' : 'Missing');
    console.log('Token value:', this.token);
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('greennest_token', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('greennest_token');
  }

  // Refresh token from localStorage
  refreshToken() {
    this.token = localStorage.getItem('greennest_token');
    console.log('Token refreshed from localStorage:', this.token ? 'Present' : 'Missing');
    return this.token;
  }

  // Get current token
  getToken() {
    return this.token;
  }

  // Generic request method
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Refresh token from localStorage before each request
    this.refreshToken();
    
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'omit',
      ...options,
    };

    // Only add Authorization header for non-auth endpoints
    if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      config.headers = {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...config.headers,
      };
    }

    // Only set Content-Type for JSON requests, not for FormData
    if (!(options.body instanceof FormData)) {
      config.headers = {
        'Content-Type': 'application/json',
        ...config.headers,
      };
    }

    try {
      console.log(`Making API request to: ${url}`);
      console.log('Request config:', {
        method: config.method || 'GET',
        headers: config.headers,
        hasAuth: !!(config.headers as any)?.Authorization
      });
      
      const response = await fetch(url, config);
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        
        // Handle different error formats from backend
        let errorMessage = '';
        if (errorData.errMessage) {
          errorMessage = errorData.errMessage;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

}

// Create singleton instance
const apiService = new ApiService(API_BASE_URL);

export default apiService;
