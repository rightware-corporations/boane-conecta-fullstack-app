package mz.gov.boaneconecta.appointments.dto;

import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateAppointmentRequest(
        UUID slotId,
        @Size(max = 1000) String reason) {
}
