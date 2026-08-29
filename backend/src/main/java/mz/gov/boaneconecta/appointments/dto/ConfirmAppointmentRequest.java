package mz.gov.boaneconecta.appointments.dto;

import jakarta.validation.constraints.Size;

public record ConfirmAppointmentRequest(@Size(max = 500) String reason) {}
