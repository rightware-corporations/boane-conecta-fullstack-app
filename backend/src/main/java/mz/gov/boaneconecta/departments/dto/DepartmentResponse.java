package mz.gov.boaneconecta.departments.dto;

import mz.gov.boaneconecta.departments.entity.DepartmentStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record DepartmentResponse(
        UUID id,
        String name,
        String slug,
        String description,
        DepartmentStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
