package mz.gov.boaneconecta.complaints.dto;

import mz.gov.boaneconecta.complaints.entity.ComplaintStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ComplaintStatusHistoryResponse(
        UUID id,
        ComplaintStatus oldStatus,
        ComplaintStatus newStatus,
        String comment,
        UUID changedByUserId,
        String changedByUserName,
        LocalDateTime createdAt) {
}
