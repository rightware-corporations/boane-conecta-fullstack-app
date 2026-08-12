package mz.gov.boaneconecta.requests.dto;

import mz.gov.boaneconecta.requests.entity.RequestStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record RequestStatusHistoryResponse(
        UUID id,
        RequestStatus oldStatus,
        RequestStatus newStatus,
        String comment,
        UUID changedByUserId,
        String changedByUserName,
        LocalDateTime createdAt) {
}
