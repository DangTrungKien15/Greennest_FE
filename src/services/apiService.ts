// Base API Service - Core functionality
const API_BASE_URL = 'https://greennestbe.onrender.com';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('greennest_token');
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

  // Generic request method
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'omit',
      ...options,
    };

    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, config);
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
