package mz.gov.boaneconecta.appointments.dto;

import mz.gov.boaneconecta.appointments.entity.AppointmentStatus;
import mz.gov.boaneconecta.queue.entity.QueueTicketStatus;
import java.util.UUID;

public record CheckInResponse(UUID appointmentId, AppointmentStatus appointmentStatus,
        QueueTicketProjection queueTicket, boolean replayed) {
    public record QueueTicketProjection(UUID id, String code, QueueTicketStatus status) {}
}
