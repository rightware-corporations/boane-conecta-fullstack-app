import { Profile, UserRole } from './auth';

export interface AdminUser extends Profile {
  email: string;
  last_login: string | null;
  active: boolean;
}

export interface DashboardMetrics {
  overview: {
    total_users: number;
    total_services: number;
    total_requests: number;
    total_projects: number;
    total_revenue: number;
  };
  requests_by_status: {
    submitted: number;
    processing: number;
    approved: number;
    rejected: number;
    completed: number;
    cancelled: number;
  };
  payments_by_status: {
    pending: number;
    paid: number;
    failed: number;
    cancelled: number;
  };
  popular_services: Array<{
    service_name: string;
    request_count: number;
  }>;
  recent_activity: Array<{
    id: string;
    type: 'user_registration' | 'service_request' | 'payment' | 'project_update';
    description: string;
    user_name: string | null;
    created_at: string;
  }>;
  revenue_by_month: Array<{
    month: string;
    amount: number;
  }>;
  user_growth: Array<{
    month: string;
    count: number;
  }>;
}

export interface AdminServiceRequest {
  id: string;
  reference_number: string;
  service_id: string;
  service_name: string;
  citizen_name: string;
  citizen_email: string | null;
  citizen_phone: string;
  citizen_nuit: string | null;
  status: 'submitted' | 'processing' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'not_required';
  payment_method: string | null;
  payment_reference: string | null;
  total_amount: number;
  notes: string | null;
  admin_notes: string | null;
  attachments: string[] | null;
  processed_by: string | null;
  processing_history: Array<{
    status: string;
    comment: string | null;
    user_name: string;
    created_at: string;
  }>;
  submitted_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}