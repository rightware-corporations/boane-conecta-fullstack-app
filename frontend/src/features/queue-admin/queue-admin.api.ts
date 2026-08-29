import { api } from '@/lib/api';
import type { ApiResponse } from '@/types';
import type { Appointment } from '@/features/appointments/types';

export type QueueConfig = { id: string; name: string; locationCode: string; departmentId: string; serviceId: string | null; mode: 'APPOINTMENT_ONLY' | 'WALK_IN_ONLY' | 'HYBRID'; status: 'OPEN' | 'PAUSED' | 'CLOSED'; version: number; desks: Array<{ id: string; code: string; displayName: string; status: string; currentStaffUserId: string | null; version: number }> };
export type DepartmentOption = { id: string; name: string; status: string };
export type ServiceOption = { id: string; departmentId: string; title: string; status: string };
export type ScheduleRuleStatus = 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'RETIRED';
export type ScheduleRule = { id: string; serviceId: string; serviceTitle: string; departmentId: string; departmentName: string; locationCode: string; dayOfWeek: string; startLocalTime: string; endLocalTime: string; slotDurationMinutes: number; capacityPerSlot: number; effectiveFrom: string; effectiveUntil: string | null; status: ScheduleRuleStatus; version: number };
export type ScheduleRuleInput = Omit<ScheduleRule, 'id' | 'serviceTitle' | 'departmentName' | 'status' | 'version'>;
export type SlotMaterialization = { from: string; to: string; created: number; existing: number };

const value = <T>(response: ApiResponse<T>): T => { if (!response.success || response.data === undefined || response.data === null) throw new Error(response.message || 'Operação indisponível.'); return response.data; };
export const listQueueConfigs = async () => value(await api.get<ApiResponse<QueueConfig[]>>('/admin/queues'));
export const listDepartments = async () => value(await api.get<ApiResponse<DepartmentOption[]>>('/admin/departments'));
export const listAdminServices = async () => value(await api.get<ApiResponse<ServiceOption[]>>('/admin/services'));
export const createQueue = async (body: { name: string; locationCode: string; departmentId: string; serviceId: string | null; mode: QueueConfig['mode'] }) => value(await api.post<ApiResponse<QueueConfig>>('/admin/queues', body));
export const changeQueueStatus = async (queue: QueueConfig, status: QueueConfig['status']) => value(await api.post<ApiResponse<QueueConfig>>(`/admin/queues/${queue.id}/status`, { status }, { headers: { 'If-Match': String(queue.version) } }));
export const createDesk = async (queueId: string, body: { code: string; displayName: string }) => value(await api.post<ApiResponse<QueueConfig>>(`/admin/queues/${queueId}/desks`, body));
export const listAdminAppointments = async () => value(await api.get<ApiResponse<Appointment[]>>('/admin/appointments'));
export const assistedCheckIn = async (appointmentId: string) => value(await api.post<ApiResponse<unknown>>(`/admin/appointments/${appointmentId}/check-in`, undefined, { headers: { 'Idempotency-Key': crypto.randomUUID() } }));
export const listScheduleRules = async () => value(await api.get<ApiResponse<ScheduleRule[]>>('/admin/appointment-schedule-rules'));
export const createScheduleRule = async (body: ScheduleRuleInput) => value(await api.post<ApiResponse<ScheduleRule>>('/admin/appointment-schedule-rules', body));
export const changeScheduleRuleStatus = async (rule: ScheduleRule, status: ScheduleRuleStatus) => value(await api.post<ApiResponse<ScheduleRule>>(`/admin/appointment-schedule-rules/${rule.id}/status`, { status }, { headers: { 'If-Match': String(rule.version) } }));
export const materializeAppointmentSlots = async (from: string, to: string) => value(await api.post<ApiResponse<SlotMaterialization>>(`/admin/appointments/slots/materialize?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`));
