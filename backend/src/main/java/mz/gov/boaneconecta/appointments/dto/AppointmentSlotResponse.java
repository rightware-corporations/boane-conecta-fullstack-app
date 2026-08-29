package mz.gov.boaneconecta.appointments.dto;

import mz.gov.boaneconecta.appointments.entity.SlotStatus;

import java.time.Instant;
import java.util.UUID;

public record AppointmentSlotResponse(
        UUID id,
        UUID departmentId,
        String departmentName,
        Instant startTime,
        Instant endTime,
        Integer capacity,
        SlotStatus status) {
}
