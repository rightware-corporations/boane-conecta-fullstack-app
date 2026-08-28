package mz.gov.boaneconecta.appointments.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record RescheduleAppointmentRequest(@NotNull UUID holdId, @NotNull Long holdVersion) {}
