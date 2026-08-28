export interface CitizenProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  nuit: string | null;
  documentType: string | null;
  documentNumber: string | null;
  birthDate: string | null;
  gender: string | null;
  address: string | null;
  districtName: string | null;
}

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  serviceId: string;
  serviceTitle: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  submittedAt: string;
  completedAt: string | null;
  updatedAt: string;
}

export interface CitizenRequestDetail {
  id: string; reference: string; serviceId: string; serviceTitle: string; title: string;
  status: string; statusLabel: string; nextAction: string; submittedAt: string;
  timeline: Array<{ status: string; label: string; occurredAt: string }>;
  documents: Array<{ id: string; title: string; documentType: string; status: string }>;
  availableActions: string[];
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
  category: string;
  relatedId: string | null;
  actionHref: string | null;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface CitizenDocument {
  id: string;
  title: string;
  documentType: string | null;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  status: 'RECEIVED' | 'SCANNING' | 'VALID' | 'REJECTED' | 'EXPIRED' | 'REPLACED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface CitizenDashboard {
  profile: { id: string; full_name: string; email: string; phone: string | null };
  action_required: Array<{ kind: 'PAYMENT' | 'DRAFT'; title: string; description: string; href: string; related_id: string }>;
  drafts: Array<{ id: string; serviceId: string; serviceTitle: string; currentStep: string | null; version: number; lastSavedAt: string | null; expiresAt: string }>;
  active_requests: Array<{ id: string; reference: string; serviceTitle: string | null; title: string; status: string; statusLabel: string; nextAction: string; submittedAt: string; updatedAt: string }>;
  next_appointment: { id: string; reference: string; status: string; startsAt: string; departmentName: string | null } | null;
  pending_payments: Array<{ id: string; reference: string; amount: number; currency: string; dueDate: string | null; requestId: string | null }>;
  recent_notifications: Notification[];
  unread_notifications: number;
}
