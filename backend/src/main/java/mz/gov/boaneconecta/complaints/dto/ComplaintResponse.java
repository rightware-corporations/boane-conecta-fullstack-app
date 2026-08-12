package mz.gov.boaneconecta.complaints.dto;

import mz.gov.boaneconecta.complaints.entity.ComplaintStatus;
import mz.gov.boaneconecta.core.Priority;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ComplaintResponse(
        UUID id,
        String complaintNumber,
        UUID citizenUserId,
        String citizenUserName,
        String subject,
        String description,
        ComplaintStatus status,
        Priority priority,
        UUID assignedToUserId,
        String assignedToUserName,
        List<ComplaintStatusHistoryResponse> history,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
