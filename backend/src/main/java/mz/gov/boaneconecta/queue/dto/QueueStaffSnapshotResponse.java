package mz.gov.boaneconecta.queue.dto;

import mz.gov.boaneconecta.queue.entity.QueueDeskStatus;
import mz.gov.boaneconecta.queue.entity.QueueStatus;
import mz.gov.boaneconecta.queue.entity.QueueTicketStatus;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record QueueStaffSnapshotResponse(
        UUID queueId,
        String queueName,
        String locationCode,
        QueueStatus queueStatus,
        Instant generatedAt,
        List<Desk> desks,
        List<Ticket> waiting) {
    public record Desk(UUID id, String code, String displayName, QueueDeskStatus status,
            UUID currentStaffUserId, Ticket currentTicket, UUID activeSessionId) {}
    public record Ticket(UUID id, String code, QueueTicketStatus status, Instant createdAt,
            Instant calledAt, Instant serviceStartedAt, List<String> availableActions) {}
}
