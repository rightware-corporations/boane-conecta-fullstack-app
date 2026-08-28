package mz.gov.boaneconecta.appointments.dto;

import mz.gov.boaneconecta.appointments.entity.AppointmentStatus;
import mz.gov.boaneconecta.appointments.entity.SlotStatus;

import java.time.Instant;
import java.util.UUID;

public record AppointmentResponse(
        UUID id,
        String appointmentNumber,
        UUID citizenUserId,
        String citizenName,
        UUID slotId,
        UUID serviceId,
        String serviceName,
        String locationCode,
        String locationName,
        Instant startTime,
        Instant endTime,
        UUID departmentId,
        String departmentName,
        String reason,
        AppointmentStatus status,
        SlotStatus slotStatus,
        Long version,
        Instant createdAt,
        Instant updatedAt) {
}
