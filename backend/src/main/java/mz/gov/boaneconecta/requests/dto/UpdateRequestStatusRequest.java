package mz.gov.boaneconecta.requests.dto;

import jakarta.validation.constraints.NotNull;
import mz.gov.boaneconecta.requests.entity.RequestStatus;

public record UpdateRequestStatusRequest(
        @NotNull RequestStatus status,
        String comment) {
}
