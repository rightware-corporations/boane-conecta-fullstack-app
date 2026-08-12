package mz.gov.boaneconecta.requests.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AssignRequestRequest(
        @NotNull UUID assignedToUserId) {
}
