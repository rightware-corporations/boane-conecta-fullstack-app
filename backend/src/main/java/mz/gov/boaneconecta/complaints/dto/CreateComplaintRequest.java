package mz.gov.boaneconecta.complaints.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import mz.gov.boaneconecta.core.Priority;

public record CreateComplaintRequest(
        @NotBlank @Size(max = 200) String subject,
        @NotBlank String description,
        Priority priority) {
}
