package mz.gov.boaneconecta.appointments.dto;

import jakarta.validation.constraints.NotNull;
import mz.gov.boaneconecta.appointments.entity.ScheduleRuleStatus;

public record ScheduleRuleStatusRequest(@NotNull ScheduleRuleStatus status) {}
