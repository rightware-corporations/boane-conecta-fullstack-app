import { api } from '@/lib/api';
import type {
  Announcement,
  Tender,
  Document,
  ContactMessage,
  Complaint,
  Faq,
  GalleryItem,
  NewsArticle,
  ApiResponse,
} from '@/types';

export const publicService = {
  async getNewsDetail(id: string): Promise<{ data?: NewsArticle; error?: string }> {
    try {
      const response = await api.get<ApiResponse<NewsArticle>>(`/public/news/${id}`);
      if (response.success && response.data) return { data: response.data };
      return { error: response.message || 'News article not found' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching news article' };
    }
  },

  async getRelatedNews(category: string, currentId: string): Promise<{ data?: NewsArticle[]; error?: string }> {
    try {
      const params = new URLSearchParams({ category, exclude: currentId, limit: '2' });
      const response = await api.get<ApiResponse<NewsArticle[]>>(`/public/news?${params}`);
      if (response.success) return { data: response.data || [] };
      return { error: response.message || 'Failed to fetch related news' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching related news' };
    }
  },

  async getAnnouncements(params?: { category?: string; active?: boolean; priority?: string }): Promise<{ data?: Announcement[]; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.active !== undefined) queryParams.append('active', params.active.toString());
      if (params?.priority) queryParams.append('priority', params.priority);
      const url = `/announcements${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<ApiResponse<Announcement[]>>(url);
      if (response.success) return { data: response.data };
      return { error: response.message || 'Failed to fetch announcements' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching announcements' };
    }
  },

  async getTenders(params?: { category?: string; status?: string }): Promise<{ data?: Tender[]; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.status) queryParams.append('status', params.status);
      const url = `/tenders${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<ApiResponse<Tender[]>>(url);
      if (response.success) return { data: response.data };
      return { error: response.message || 'Failed to fetch tenders' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching tenders' };
    }
  },

  async getPublicDocuments(params?: { category?: string; search?: string }): Promise<{ data?: Document[]; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.search) queryParams.append('search', params.search);
      const url = `/documents/public${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<ApiResponse<Document[]>>(url);
      if (response.success) return { data: response.data };
      return { error: response.message || 'Failed to fetch documents' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching documents' };
    }
  },

  async getGallery(params?: { category?: string; limit?: number }): Promise<{ data?: GalleryItem[]; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      const url = `/gallery${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<ApiResponse<GalleryItem[]>>(url);
      if (response.success) return { data: response.data };
      return { error: response.message || 'Failed to fetch gallery items' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching gallery' };
    }
  },

  async getFaqs(params?: { category?: string }): Promise<{ data?: Faq[]; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category) queryParams.append('category', params.category);
      const url = `/faqs${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<ApiResponse<Faq[]>>(url);
      if (response.success) return { data: response.data };
      return { error: response.message || 'Failed to fetch FAQs' };
    } catch (error: any) {
      return { error: error.message || 'Network error fetching FAQs' };
    }
  },

  async sendContactMessage(message: ContactMessage): Promise<{ error?: string }> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>('/contact/messages', message);
      if (response.success) return {};
      return { error: response.message || 'Failed to send message' };
    } catch (error: any) {
      return { error: error.message || 'Network error sending message' };
    }
  },

  async sendComplaint(complaint: Complaint): Promise<{ data?: { reference: string }; error?: string }> {
    try {
      const response = await api.post<ApiResponse<{ reference: string }>>('/public/complaints', complaint);
      if (response.success) return { data: response.data };
      return { error: response.message || 'Failed to send complaint' };
    } catch (error: any) {
      return { error: error.message || 'Network error sending complaint' };
    }
  },
};
