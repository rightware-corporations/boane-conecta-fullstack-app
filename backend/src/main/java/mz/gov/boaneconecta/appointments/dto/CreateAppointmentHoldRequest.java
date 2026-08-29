package mz.gov.boaneconecta.appointments.dto;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
public record CreateAppointmentHoldRequest(@NotNull UUID slotId) {}
