package mz.gov.boaneconecta.districts.dto;

import mz.gov.boaneconecta.districts.entity.DistrictStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record DistrictResponse(
        UUID id,
        String name,
        String slug,
        String description,
        DistrictStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
