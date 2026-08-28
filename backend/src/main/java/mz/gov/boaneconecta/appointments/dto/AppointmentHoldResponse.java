package mz.gov.boaneconecta.appointments.dto;
import java.time.Instant;
import java.util.UUID;
public record AppointmentHoldResponse(UUID holdId, UUID slotId, Instant expiresAt, Long version) {}
