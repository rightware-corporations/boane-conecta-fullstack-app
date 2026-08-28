package mz.gov.boaneconecta.queue.dto;

import mz.gov.boaneconecta.queue.entity.QueueTicketStatus;
import java.util.UUID;

public record QueueOperationResponse(UUID ticketId, String ticketCode, QueueTicketStatus ticketStatus,
        UUID deskId, String deskName, UUID sessionId, String outcome, boolean replayed) {}
