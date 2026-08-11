import { api } from '@/lib/api';
import type { 
  DashboardMetrics, 
  ApiResponse 
} from '@/types';

export const dashboardService = {
  async getAdminMetrics(): Promise<{ data?: DashboardMetrics; error?: string }> {
    try {
      const response = await api.get<ApiResponse<DashboardMetrics>>('/admin/dashboard');
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Failed to fetch dashboard metrics' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching dashboard metrics' };
    }
  },
};