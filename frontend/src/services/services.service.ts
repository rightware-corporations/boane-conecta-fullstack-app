import { api } from '@/lib/api';
import type { 
  Service, 
  ApiResponse, 
  PaginatedResponse 
} from '@/types';

export const servicesService = {
  // Public endpoints
  async getPublicServices(params?: { 
    category?: string; 
    search?: string; 
    active?: boolean 
  }): Promise<{ data?: Service[]; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.active !== undefined) queryParams.append('active', params.active.toString());

      const url = `/services${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<ApiResponse<Service[]>>(url);
      
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Failed to fetch services' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching services' };
    }
  },

  async getServiceById(id: string): Promise<{ data?: Service; error?: string }> {
    try {
      const response = await api.get<ApiResponse<Service>>(`/services/${id}`);
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Service not found' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching service' };
    }
  },

  // Admin endpoints
  async getAdminServices(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<{ data?: Service[]; pagination?: any; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);

      const url = `/admin/services${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<PaginatedResponse<Service>>(url);
      
      if (response.success) {
        return { data: response.data, pagination: response.pagination };
      }
      return { error: 'Failed to fetch services' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching services' };
    }
  },

  async createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<{ data?: Service; error?: string }> {
    try {
      const response = await api.post<ApiResponse<Service>>('/admin/services', service);
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Failed to create service' };
    } catch (error: any) {
      return { error: error.message || 'Network error creating service' };
    }
  },

  async updateService(id: string, updates: Partial<Service>): Promise<{ data?: Service; error?: string }> {
    try {
      const response = await api.patch<ApiResponse<Service>>(`/admin/services/${id}`, updates);
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Failed to update service' };
    } catch (error: any) {
      return { error: error.message || 'Network error updating service' };
    }
  },

  async deleteService(id: string): Promise<{ error?: string }> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/admin/services/${id}`);
      if (response.success) {
        return {};
      }
      return { error: response.message || 'Failed to delete service' };
    } catch (error: any) {
      return { error: error.message || 'Network error deleting service' };
    }
  },
};