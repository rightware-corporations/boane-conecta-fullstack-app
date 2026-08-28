export type AppointmentStatus =
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_SERVICE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'RESCHEDULED';

export type Appointment = {
  id: string;
  appointmentNumber: string;
  slotId: string | null;
  serviceId: string | null;
  serviceName: string | null;
  locationCode: string | null;
  locationName: string | null;
  startTime: string | null;
  endTime: string | null;
  departmentName: string | null;
  reason: string | null;
  status: AppointmentStatus;
  slotStatus: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type AvailabilitySlot = {
  slotId: string;
  startsAt: string;
  endsAt: string;
  locationName: string;
  remainingCapacity: number;
  availability: string;
};

export type Availability = {
  serviceId: string;
  locationCode: string;
  days: Array<{ date: string; slots: AvailabilitySlot[] }>;
};

export type AppointmentHold = {
  holdId: string;
  slotId: string;
  expiresAt: string;
  version: number;
};

export type AppointmentConfirmation = {
  appointmentId: string;
  reference: string;
  status: AppointmentStatus;
  startsAt: string;
  availableActions: string[];
  version: number;
  replayed: boolean;
  checkInCredential: string | null;
};

export type QueueTicket = {
  id: string;
  ticketCode: string;
  status: string;
  peopleAhead: number | null;
  deskDisplayName: string | null;
  locationCode: string;
  lastUpdatedAt: string;
  availableActions: string[];
};

export type CheckInResponse = {
  appointmentId: string;
  appointmentStatus: AppointmentStatus;
  queueTicket: { id: string; code: string; status: string };
  replayed: boolean;
};
