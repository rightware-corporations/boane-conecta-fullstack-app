import { api, getErrorMessage } from '@/lib/api';
import type {
  AdminUser,
  UserRole,
  ApiResponse,
  PaginatedResponse,
  Pagination,
} from '@/types';

export const usersService = {
  // Admin endpoints for user management
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
    active?: boolean;
  }): Promise<{ data?: AdminUser[]; pagination?: Pagination; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.role) queryParams.append('role', params.role);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.active !== undefined) queryParams.append('active', params.active.toString());

      const url = `/admin/users${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<PaginatedResponse<AdminUser>>(url);

      if (response.success) {
        return { data: response.data, pagination: response.pagination };
      }
      return { error: 'Failed to fetch users' };
    } catch (error) {
      return { error: getErrorMessage(error, 'Network error fetching users') };
    }
  },

  async getUserById(id: string): Promise<{ data?: AdminUser; error?: string }> {
    try {
      const response = await api.get<ApiResponse<AdminUser>>(`/admin/users/${id}`);
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'User not found' };
    } catch (error) {
      return { error: getErrorMessage(error, 'Network error fetching user') };
    }
  },

  async updateUser(id: string, updates: {
    role?: UserRole;
    active?: boolean;
    full_name?: string;
  }): Promise<{ data?: AdminUser; error?: string }> {
    try {
      const response = await api.patch<ApiResponse<AdminUser>>(`/admin/users/${id}`, updates);
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Failed to update user' };
    } catch (error) {
      return { error: getErrorMessage(error, 'Network error updating user') };
    }
  },

  async inviteUser(data: {
    email: string;
    full_name: string;
    role: UserRole;
  }): Promise<{ error?: string }> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>('/admin/users/invite', data);
      if (response.success) {
        return {};
      }
      return { error: response.message || 'Failed to invite user' };
    } catch (error) {
      return { error: getErrorMessage(error, 'Network error inviting user') };
    }
  },

  async deleteUser(id: string): Promise<{ error?: string }> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/admin/users/${id}`);
      if (response.success) {
        return {};
      }
      return { error: response.message || 'Failed to delete user' };
    } catch (error) {
      return { error: getErrorMessage(error, 'Network error deleting user') };
    }
  },
};
