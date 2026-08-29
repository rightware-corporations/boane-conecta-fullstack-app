package mz.gov.boaneconecta.appointments.dto;

import mz.gov.boaneconecta.appointments.entity.ScheduleRuleStatus;
import java.time.*;
import java.util.UUID;

public record AppointmentScheduleRuleResponse(
        UUID id, UUID serviceId, String serviceTitle, UUID departmentId, String departmentName,
        String locationCode, DayOfWeek dayOfWeek, LocalTime startLocalTime, LocalTime endLocalTime,
        Integer slotDurationMinutes, Integer capacityPerSlot, LocalDate effectiveFrom,
        LocalDate effectiveUntil, ScheduleRuleStatus status, Long version) {}
