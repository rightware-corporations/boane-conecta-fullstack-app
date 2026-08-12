package mz.gov.boaneconecta.complaints.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AssignComplaintRequest(
        @NotNull UUID assignedToUserId) {
}
