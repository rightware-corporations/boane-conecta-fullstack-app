import { api, getErrorMessage } from '@/lib/api';
import type {
  Project,
  ApiResponse,
  PaginatedResponse,
  Pagination,
} from '@/types';

export const projectsService = {
  // Public endpoints
  async getPublicProjects(params?: {
    category?: string;
    status?: string;
    search?: string;
  }): Promise<{ data?: Project[]; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);

      const url = `/projects${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<ApiResponse<Project[]>>(url);

      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Failed to fetch projects' };
    } catch (error) {
      return { error: getErrorMessage(error, 'Network error fetching projects') };
    }
  },

  async getProjectById(id: string): Promise<{ data?: Project; error?: string }> {
    try {
      const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Project not found' };
    } catch (error) {
      return { error: getErrorMessage(error, 'Network error fetching project') };
    }
  },

  // Admin endpoints
  async getAdminProjects(params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
  }): Promise<{ data?: Project[]; pagination?: Pagination; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.search) queryParams.append('search', params.search);

      const url = `/admin/projects${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<PaginatedResponse<Project>>(url);

      if (response.success) {
        return { data: response.data, pagination: response.pagination };
      }
      return { error: 'Failed to fetch projects' };
    } catch (error) {
      return { error: getErrorMessage(error, 'Network error fetching projects') };
    }
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<{ data?: Project; error?: string }> {
    try {
      const response = await api.post<ApiResponse<Project>>('/admin/projects', project);
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Failed to create project' };
    } catch (error) {
      return { error: getErrorMessage(error, 'Network error creating project') };
    }
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<{ data?: Project; error?: string }> {
    try {
      const response = await api.patch<ApiResponse<Project>>(`/admin/projects/${id}`, updates);
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Failed to update project' };
    } catch (error) {
      return { error: getErrorMessage(error, 'Network error updating project') };
    }
  },

  async deleteProject(id: string): Promise<{ error?: string }> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/admin/projects/${id}`);
      if (response.success) {
        return {};
      }
      return { error: response.message || 'Failed to delete project' };
    } catch (error) {
      return { error: getErrorMessage(error, 'Network error deleting project') };
    }
  },
};
