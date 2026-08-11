import { Profile } from './auth';

export interface CitizenProfile extends Profile {
  // Additional citizen-specific fields if needed
  email_notifications: boolean;
  sms_notifications: boolean;
  preferred_contact_method: 'email' | 'sms' | 'both';
}

export interface ServiceRequest {
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
  attachments: string[] | null;
  processed_by: string | null;
  submitted_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface License {
  id: string;
  type: string;
  title: string;
  description: string | null;
  status: 'active' | 'expired' | 'suspended' | 'pending_renewal';
  issue_date: string;
  expiry_date: string;
  renewal_date: string | null;
  document_url: string | null;
  payment_status: 'paid' | 'pending' | 'overdue';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  reference: string;
  type: 'service_request' | 'license_renewal' | 'fine' | 'other';
  related_id: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  payment_method: 'mpesa' | 'emola' | 'visa' | 'cash' | 'bank_transfer';
  provider_reference: string | null;
  receipt_url: string | null;
  description: string;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  service_id: string | null;
  service_name: string;
  date: string;
  time: string;
  location: string;
  counter: string | null;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  notes: string | null;
  instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category: 'service_request' | 'payment' | 'appointment' | 'license' | 'general';
  related_id: string | null;
  read: boolean;
  created_at: string;
}

export interface CitizenDocument {
  id: string;
  name: string;
  type: string;
  category: string;
  file_url: string;
  file_size: number;
  file_type: string;
  validation_status: 'pending' | 'valid' | 'invalid' | 'expired';
  expiry_date: string | null;
  uploaded_at: string;
  validated_at: string | null;
  validated_by: string | null;
}

export interface CitizenDashboard {
  profile: CitizenProfile;
  stats: {
    active_licenses: number;
    pending_requests: number;
    pending_payments: number;
    upcoming_appointments: number;
    unread_notifications: number;
  };
  recent_activity: Array<{
    id: string;
    type: 'service_request' | 'payment' | 'appointment' | 'license';
    title: string;
    description: string;
    date: string;
    status?: string;
  }>;
  upcoming_appointments: Appointment[];
  pending_payments: Payment[];
  recent_notifications: Notification[];
}