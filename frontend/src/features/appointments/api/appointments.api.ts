import { api } from '@/lib/api';
import type { ApiResponse } from '@/types';

import type {
  Appointment,
  AppointmentConfirmation,
  AppointmentHold,
  Availability,
  CheckInResponse,
  QueueTicket,
} from '../types';

function idempotencyKey(): string {
  return crypto.randomUUID();
}

function dataOf<T>(response: ApiResponse<T>, fallback: string): T {
  if (!response.success || response.data === undefined || response.data === null) {
    throw new Error(response.message || fallback);
  }
  return response.data;
}

export async function listAppointments(): Promise<Appointment[]> {
  const response = await api.get<ApiResponse<Appointment[]>>('/citizen/appointments');
  return dataOf(response, 'Não foi possível carregar os agendamentos.');
}

export async function getAppointment(id: string): Promise<Appointment> {
  const response = await api.get<ApiResponse<Appointment>>(`/citizen/appointments/${encodeURIComponent(id)}`);
  return dataOf(response, 'Não foi possível carregar o agendamento.');
}

export async function getAvailability(input: {
  serviceId: string;
  locationCode: string;
  from: string;
  to: string;
}): Promise<Availability> {
  const query = new URLSearchParams(input);
  const response = await api.get<ApiResponse<Availability>>(`/citizen/appointments/availability?${query}`);
  return dataOf(response, 'Não foi possível consultar a disponibilidade.');
}

export async function createHold(slotId: string): Promise<AppointmentHold> {
  const response = await api.post<ApiResponse<AppointmentHold>>(
    '/citizen/appointment-holds',
    { slotId },
    { headers: { 'Idempotency-Key': idempotencyKey() } },
  );
  return dataOf(response, 'Não foi possível reservar temporariamente este horário.');
}

export async function confirmHold(hold: AppointmentHold, reason: string): Promise<AppointmentConfirmation> {
  const response = await api.post<ApiResponse<AppointmentConfirmation>>(
    `/citizen/appointment-holds/${encodeURIComponent(hold.holdId)}/confirm`,
    { reason },
    { headers: { 'Idempotency-Key': idempotencyKey(), 'If-Match': String(hold.version) } },
  );
  return dataOf(response, 'Não foi possível confirmar o agendamento.');
}

export async function cancelAppointment(appointment: Appointment, reason: string): Promise<AppointmentConfirmation> {
  const response = await api.post<ApiResponse<AppointmentConfirmation>>(
    `/citizen/appointments/${encodeURIComponent(appointment.id)}/cancel`,
    { reason },
    { headers: { 'Idempotency-Key': idempotencyKey(), 'If-Match': String(appointment.version) } },
  );
  return dataOf(response, 'Não foi possível cancelar o agendamento.');
}

export async function checkIn(input: {
  appointmentId: string;
  method: 'QR' | 'MANUAL_CODE';
  credential: string;
}): Promise<CheckInResponse> {
  const response = await api.post<ApiResponse<CheckInResponse>>(
    `/citizen/appointments/${encodeURIComponent(input.appointmentId)}/check-in`,
    { method: input.method, credential: input.credential },
    { headers: { 'Idempotency-Key': idempotencyKey() } },
  );
  return dataOf(response, 'Não foi possível concluir o check-in.');
}

export async function getQueueTicket(ticketId: string): Promise<QueueTicket> {
  const response = await api.get<ApiResponse<QueueTicket>>(
    `/citizen/queue-tickets/${encodeURIComponent(ticketId)}`,
  );
  return dataOf(response, 'Não foi possível atualizar a senha digital.');
}
