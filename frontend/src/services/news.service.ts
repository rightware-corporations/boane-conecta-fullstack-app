import { api } from '@/lib/api';
import type { 
  NewsArticle, 
  ApiResponse, 
  PaginatedResponse 
} from '@/types';

export const newsService = {
  // Public endpoints
  async getPublicNews(params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<{ data?: NewsArticle[]; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const url = `/news${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<ApiResponse<NewsArticle[]>>(url);
      
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Failed to fetch news' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching news' };
    }
  },

  async getNewsById(id: string): Promise<{ data?: NewsArticle; error?: string }> {
    try {
      const response = await api.get<ApiResponse<NewsArticle>>(`/news/${id}`);
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'News article not found' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching news article' };
    }
  },

  // Admin endpoints  
  async getAdminNews(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<{ data?: NewsArticle[]; pagination?: any; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);

      const url = `/admin/news${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<PaginatedResponse<NewsArticle>>(url);
      
      if (response.success) {
        return { data: response.data, pagination: response.pagination };
      }
      return { error: 'Failed to fetch news' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching news' };
    }
  },

  async createNews(news: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>): Promise<{ data?: NewsArticle; error?: string }> {
    try {
      const response = await api.post<ApiResponse<NewsArticle>>('/admin/news', news);
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Failed to create news article' };
    } catch (error: any) {
      return { error: error.message || 'Network error creating news article' };
    }
  },

  async updateNews(id: string, updates: Partial<NewsArticle>): Promise<{ data?: NewsArticle; error?: string }> {
    try {
      const response = await api.patch<ApiResponse<NewsArticle>>(`/admin/news/${id}`, updates);
      if (response.success) {
        return { data: response.data };
      }
      return { error: response.message || 'Failed to update news article' };
    } catch (error: any) {
      return { error: error.message || 'Network error updating news article' };
    }
  },

  async deleteNews(id: string): Promise<{ error?: string }> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/admin/news/${id}`);
      if (response.success) {
        return {};
      }
      return { error: response.message || 'Failed to delete news article' };
    } catch (error: any) {
      return { error: error.message || 'Network error deleting news article' };
    }
  },
};