package mz.gov.boaneconecta.appointments.dto;

import jakarta.validation.constraints.*;

public record CheckInRequest(@NotNull CheckInMethod method,
        @Size(max = 500) String credential) {}
