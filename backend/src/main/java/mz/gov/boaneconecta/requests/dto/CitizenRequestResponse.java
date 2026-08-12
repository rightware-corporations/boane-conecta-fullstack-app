package mz.gov.boaneconecta.requests.dto;

import mz.gov.boaneconecta.core.Priority;
import mz.gov.boaneconecta.requests.entity.RequestStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record CitizenRequestResponse(
        UUID id,
        String requestNumber,
        UUID citizenUserId,
        String citizenName,
        UUID serviceId,
        String serviceTitle,
        String title,
        String description,
        RequestStatus status,
        Priority priority,
        LocalDateTime submittedAt,
        LocalDateTime completedAt,
        UUID assignedToUserId,
        String assignedToUserName,
        List<RequestStatusHistoryResponse> history,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
