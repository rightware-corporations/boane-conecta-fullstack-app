import { api } from '@/lib/api';
import type { 
  AuthSession, 
  LoginCredentials, 
  RegisterData, 
  User, 
  Profile,
  ApiResponse 
} from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ data?: AuthSession; error?: string }> {
    try {
      const response = await api.post<ApiResponse<AuthSession>>('/auth/login', credentials);
      if (response.success && response.data) {
        return { data: response.data };
      }
      return { error: response.message || 'Login failed' };
    } catch (error: any) {
      return { error: error.message || 'Network error during login' };
    }
  },

  async register(data: RegisterData): Promise<{ error?: string }> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>('/auth/register', data);
      if (response.success) {
        return {};
      }
      return { error: response.message || 'Registration failed' };
    } catch (error: any) {
      return { error: error.message || 'Network error during registration' };
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Error during logout:', error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('auth_token');
    }
  },

  async refreshToken(): Promise<{ data?: AuthSession; error?: string }> {
    try {
      const response = await api.post<ApiResponse<AuthSession>>('/auth/refresh');
      if (response.success && response.data) {
        return { data: response.data };
      }
      return { error: response.message || 'Token refresh failed' };
    } catch (error: any) {
      return { error: error.message || 'Network error during token refresh' };
    }
  },

  async me(): Promise<{ data?: { user: User; profile: Profile }; error?: string }> {
    try {
      const response = await api.get<ApiResponse<{ user: User; profile: Profile }>>('/auth/me');
      if (response.success && response.data) {
        return { data: response.data };
      }
      return { error: response.message || 'Failed to fetch user data' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching user data' };
    }
  },
};