package mz.gov.boaneconecta.appointments.dto;

import mz.gov.boaneconecta.appointments.entity.SlotStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record AppointmentSlotResponse(
        UUID id,
        UUID departmentId,
        String departmentName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Integer capacity,
        SlotStatus status) {
}
