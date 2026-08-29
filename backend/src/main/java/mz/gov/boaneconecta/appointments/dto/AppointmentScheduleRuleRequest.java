package mz.gov.boaneconecta.appointments.dto;

import jakarta.validation.constraints.*;
import java.time.*;
import java.util.UUID;

public record AppointmentScheduleRuleRequest(
        @NotNull UUID serviceId,
        @NotNull UUID departmentId,
        @NotBlank @Size(max = 40) String locationCode,
        @NotNull DayOfWeek dayOfWeek,
        @NotNull LocalTime startLocalTime,
        @NotNull LocalTime endLocalTime,
        @NotNull @Min(5) @Max(480) Integer slotDurationMinutes,
        @NotNull @Min(1) @Max(500) Integer capacityPerSlot,
        @NotNull LocalDate effectiveFrom,
        LocalDate effectiveUntil) {}
