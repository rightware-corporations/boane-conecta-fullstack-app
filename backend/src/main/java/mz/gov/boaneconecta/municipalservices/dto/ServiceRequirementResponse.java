package mz.gov.boaneconecta.municipalservices.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ServiceRequirementResponse(
        UUID id,
        UUID serviceId,
        String title,
        String description,
        boolean required,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
