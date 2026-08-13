package mz.gov.boaneconecta.appointments.dto;

import mz.gov.boaneconecta.appointments.entity.AppointmentStatus;
import mz.gov.boaneconecta.appointments.entity.SlotStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record AppointmentResponse(
        UUID id,
        String appointmentNumber,
        UUID citizenUserId,
        String citizenName,
        UUID slotId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        UUID departmentId,
        String departmentName,
        String reason,
        AppointmentStatus status,
        SlotStatus slotStatus,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
