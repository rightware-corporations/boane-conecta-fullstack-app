package mz.gov.boaneconecta.complaints.dto;

import jakarta.validation.constraints.NotNull;
import mz.gov.boaneconecta.complaints.entity.ComplaintStatus;

public record UpdateComplaintStatusRequest(
        @NotNull ComplaintStatus status,
        String comment) {
}
