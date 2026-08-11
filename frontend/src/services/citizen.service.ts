import { api } from '@/lib/api';
import type {
  CitizenProfile,
  CitizenDashboard,
  ServiceRequest,
  License,
  Payment,
  Appointment,
  Notification,
  CitizenDocument,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const citizenService = {
  // Profile
  async getProfile(): Promise<{ data?: CitizenProfile; error?: string }> {
    try {
      const response = await api.get<ApiResponse<CitizenProfile>>('/citizen/me');
      if (response.success) return { data: response.data };
      return { error: response.message || 'Failed to fetch profile' };
    } catch (error: any) {
      return { error: error.message || 'Network error' };
    }
  },

  async updateProfile(updates: Partial<CitizenProfile>): Promise<{ data?: CitizenProfile; error?: string }> {
    try {
      const response = await api.patch<ApiResponse<CitizenProfile>>('/citizen/me', updates);
      if (response.success) return { data: response.data };
      return { error: response.message || 'Failed to update profile' };
    } catch (error: any) {
      return { error: error.message || 'Network error' };
    }
  },

  // Dashboard
  async getDashboard(): Promise<{ data?: CitizenDashboard; error?: string }> {
    try {
      const response = await api.get<ApiResponse<CitizenDashboard>>('/citizen/dashboard');
      if (response.success) return { data: response.data };
      return { error: response.message || 'Failed to fetch dashboard' };
    } catch (error: any) {
      return { error: error.message || 'Network error' };
    }
  },

  // Service Requests
  async getRequests(params?: { status?: string; page?: number }): Promise<{ data?: ServiceRequest[]; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      if (params?.page) queryParams.append('page', params.page.toString());
      const url = `/citizen/requests${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<PaginatedResponse<ServiceRequest>>(url);
      if (response.success) return { data: response.data };
      return { error: 'Failed to fetch requests' };
    } catch (error: any) {
      return { error: error.message || 'Network error' };
    }
  },

  // Licenses
  async getLicenses(params?: { status?: string }): Promise<{ data?: License[]; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      const url = `/citizen/licenses${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<ApiResponse<License[]>>(url);
      if (response.success) return { data: response.data };
      return { error: 'Failed to fetch licenses' };
    } catch (error: any) {
      return { error: error.message || 'Network error' };
    }
  },

  // Documents
  async getDocuments(): Promise<{ data?: CitizenDocument[]; error?: string }> {
    try {
      const response = await api.get<ApiResponse<CitizenDocument[]>>('/citizen/documents');
      if (response.success) return { data: response.data };
      return { error: 'Failed to fetch documents' };
    } catch (error: any) {
      return { error: error.message || 'Network error' };
    }
  },

  async uploadDocument(formData: FormData): Promise<{ data?: CitizenDocument; error?: string }> {
    try {
      const response = await api.upload<ApiResponse<CitizenDocument>>('/citizen/documents', formData);
      if (response.success) return { data: response.data };
      return { error: 'Failed to upload document' };
    } catch (error: any) {
      return { error: error.message || 'Network error' };
    }
  },

  // Payments
  async getPayments(params?: { status?: string }): Promise<{ data?: Payment[]; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      const url = `/citizen/payments${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<ApiResponse<Payment[]>>(url);
      if (response.success) return { data: response.data };
      return { error: 'Failed to fetch payments' };
    } catch (error: any) {
      return { error: error.message || 'Network error' };
    }
  },

  // Appointments
  async getAppointments(params?: { status?: string }): Promise<{ data?: Appointment[]; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append('status', params.status);
      const url = `/citizen/appointments${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<ApiResponse<Appointment[]>>(url);
      if (response.success) return { data: response.data };
      return { error: 'Failed to fetch appointments' };
    } catch (error: any) {
      return { error: error.message || 'Network error' };
    }
  },

  // Notifications
  async getNotifications(): Promise<{ data?: Notification[]; error?: string }> {
    try {
      const response = await api.get<ApiResponse<Notification[]>>('/citizen/notifications');
      if (response.success) return { data: response.data };
      return { error: 'Failed to fetch notifications' };
    } catch (error: any) {
      return { error: error.message || 'Network error' };
    }
  },

  async markNotificationRead(id: string): Promise<{ error?: string }> {
    try {
      const response = await api.patch<ApiResponse<void>>(`/citizen/notifications/${id}`, { read: true });
      if (response.success) return {};
      return { error: 'Failed to update notification' };
    } catch (error: any) {
      return { error: error.message || 'Network error' };
    }
  },

  // Payments initiation
  async initiatePayment(data: {
    type: string;
    related_id: string;
    payment_method: string;
    phone_number?: string;
  }): Promise<{ data?: { payment_id: string; reference: string }; error?: string }> {
    try {
      const response = await api.post<ApiResponse<{ payment_id: string; reference: string }>>('/payments/initiate', data);
      if (response.success) return { data: response.data };
      return { error: response.message || 'Failed to initiate payment' };
    } catch (error: any) {
      return { error: error.message || 'Network error' };
    }
  },
};