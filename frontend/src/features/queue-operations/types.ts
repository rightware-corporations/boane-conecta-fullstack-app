export type StaffQueueTicket = {
  id: string;
  code: string;
  status: 'WAITING' | 'CALLED' | 'SERVING' | 'COMPLETED' | 'NO_SHOW' | 'TRANSFERRED';
  createdAt: string;
  calledAt: string | null;
  serviceStartedAt: string | null;
  availableActions: string[];
};

export type StaffQueueDesk = {
  id: string;
  code: string;
  displayName: string;
  status: 'CLOSED' | 'OPEN' | 'PAUSED' | 'SERVING';
  currentStaffUserId: string | null;
  currentTicket: StaffQueueTicket | null;
  activeSessionId: string | null;
};

export type StaffQueueSnapshot = {
  queueId: string;
  queueName: string;
  locationCode: string;
  queueStatus: 'OPEN' | 'PAUSED' | 'CLOSED';
  generatedAt: string;
  desks: StaffQueueDesk[];
  waiting: StaffQueueTicket[];
};

export type QueueOperation = {
  ticketId: string | null;
  ticketCode: string | null;
  ticketStatus: string | null;
  deskId: string | null;
  deskName: string | null;
  sessionId: string | null;
  outcome: string;
  replayed: boolean;
};
