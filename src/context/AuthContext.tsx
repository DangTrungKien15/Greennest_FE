import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService, apiService } from '../services';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, phone?: string, image?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('greennest_token');
        const savedUser = localStorage.getItem('greennest_user');
        console.log('AuthContext useEffect: Initializing auth...');
        console.log('AuthContext useEffect: Retrieved token:', token ? 'Exists' : 'None');
        console.log('AuthContext useEffect: Retrieved savedUser string:', savedUser);
        
        if (token && savedUser) {
          // Set token first
          apiService.setToken(token);
          
          try {
            // Try to verify token with API
            const userData = await authService.getProfile();
            console.log('AuthContext useEffect: API verification successful:', userData);
            setUser(userData);
          } catch (error) {
            // If API verification fails, use saved user data
            console.warn('Token verification failed, using saved user data');
            const userData = JSON.parse(savedUser);
            console.log('AuthContext useEffect: Parsed user data from localStorage:', userData);
            setUser(userData);
          }
        }
      } catch (error) {
        // Clear invalid data
        console.error('AuthContext useEffect: Error initializing auth:', error);
        apiService.clearToken();
        localStorage.removeItem('greennest_user');
        localStorage.removeItem('greennest_token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      console.log('AuthContext login: Response from authService.login:', response);
      console.log('AuthContext login: response.user:', response.user);
      console.log('AuthContext login: response.user type:', typeof response.user);
      console.log('AuthContext login: response.user keys:', Object.keys(response.user));
      
      setUser(response.user);
      // Set real token from backend
      if (response.token) {
        apiService.setToken(response.token);
        localStorage.setItem('greennest_token', response.token);
      }
      console.log('AuthContext login: User object before saving to localStorage:', response.user);
      localStorage.setItem('greennest_user', JSON.stringify(response.user));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, phone?: string, image?: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register(email, password, firstName, lastName, phone, image);
      
      setUser(response.user);
      // Set real token from backend
      if (response.token) {
        apiService.setToken(response.token);
        localStorage.setItem('greennest_token', response.token);
      }
      localStorage.setItem('greennest_user', JSON.stringify(response.user));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    apiService.clearToken();
    localStorage.removeItem('greennest_user');
    localStorage.removeItem('greennest_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
