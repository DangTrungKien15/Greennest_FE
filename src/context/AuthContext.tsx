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
        // Check if user data exists in localStorage
        const savedUser = localStorage.getItem('greennest_user');
        const savedToken = localStorage.getItem('greennest_token');
        
        if (savedUser && savedToken) {
          console.log('AuthContext useEffect: Found saved auth data, restoring...');
          console.log('AuthContext useEffect: savedUser:', savedUser);
          console.log('AuthContext useEffect: savedToken:', savedToken);
          try {
            const userData = JSON.parse(savedUser);
            console.log('AuthContext useEffect: Parsed userData:', userData);
            setUser(userData);
            apiService.setToken(savedToken);
            console.log('AuthContext useEffect: Auth data restored successfully');
            console.log('AuthContext useEffect: User set to:', userData);
          } catch (parseError) {
            console.error('AuthContext useEffect: Error parsing saved user data:', parseError);
            // Clear invalid data
            localStorage.removeItem('greennest_user');
            localStorage.removeItem('greennest_token');
            apiService.clearToken();
          }
        } else {
          console.log('AuthContext useEffect: No saved auth data found');
          console.log('AuthContext useEffect: savedUser:', savedUser);
          console.log('AuthContext useEffect: savedToken:', savedToken);
        }
      } catch (error) {
        console.error('AuthContext useEffect: Error initializing auth:', error);
        // Clear invalid data
        localStorage.removeItem('greennest_user');
        localStorage.removeItem('greennest_token');
        apiService.clearToken();
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
