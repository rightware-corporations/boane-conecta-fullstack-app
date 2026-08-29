package mz.gov.boaneconecta.queue.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record QueueStaffScopeRequest(@NotNull UUID userId) {}
