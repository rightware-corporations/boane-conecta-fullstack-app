import { api } from '@/lib/api';
import type { 
  ServiceRequest,
  AdminServiceRequest, 
  ApiResponse, 
  PaginatedResponse 
} from '@/types';

export const requestsService = {
  // Public endpoints
  async createServiceRequest(data: {
    service_id: string;
    citizen_name: string;
    citizen_email?: string;
    citizen_phone: string;
    citizen_nuit?: string;
    notes?: string;
    attachments?: string[];
  }): Promise<{ data?: ServiceRequest; error?: string }> {
    try {
      const response = await api.post<ApiResponse<ServiceRequest>>('/service-requests', data);
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Failed to create service request' };
    } catch (error: any) {
      return { error: error.message || 'Network error creating service request' };
    }
  },

  async getServiceRequestByNumber(requestNumber: string, nuit?: string): Promise<{ data?: ServiceRequest; error?: string }> {
    try {
      const body: any = { reference_number: requestNumber };
      if (nuit) body.nuit = nuit;

      const response = await api.post<ApiResponse<ServiceRequest>>('/service-requests/lookup', body);
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Service request not found' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching service request' };
    }
  },

  // Admin endpoints
  async getAdminServiceRequests(params?: {
    page?: number;
    limit?: number;
    status?: string;
    payment_status?: string;
    search?: string;
    service_id?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<{ data?: AdminServiceRequest[]; pagination?: any; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.payment_status) queryParams.append('payment_status', params.payment_status);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.service_id) queryParams.append('service_id', params.service_id);
      if (params?.date_from) queryParams.append('date_from', params.date_from);
      if (params?.date_to) queryParams.append('date_to', params.date_to);

      const url = `/admin/service-requests${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<PaginatedResponse<AdminServiceRequest>>(url);
      
      if (response.success) {
        return { data: response.data, pagination: response.pagination };
      }
      return { error: 'Failed to fetch service requests' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching service requests' };
    }
  },

  async updateServiceRequest(id: string, updates: {
    status?: string;
    payment_status?: string;
    admin_notes?: string;
    processed_by?: string;
  }): Promise<{ data?: AdminServiceRequest; error?: string }> {
    try {
      const response = await api.patch<ApiResponse<AdminServiceRequest>>(`/admin/service-requests/${id}`, updates);
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Failed to update service request' };
    } catch (error: any) {
      return { error: error.message || 'Network error updating service request' };
    }
  },

  async getServiceRequestById(id: string): Promise<{ data?: AdminServiceRequest; error?: string }> {
    try {
      const response = await api.get<ApiResponse<AdminServiceRequest>>(`/admin/service-requests/${id}`);
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Service request not found' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching service request' };
    }
  },
};