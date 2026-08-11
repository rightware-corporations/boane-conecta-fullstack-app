package mz.gov.boaneconecta.municipalservices.dto;

import mz.gov.boaneconecta.municipalservices.entity.MunicipalServiceStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record MunicipalServiceResponse(
        UUID id,
        UUID departmentId,
        String departmentName,
        String title,
        String slug,
        String description,
        String processingTime,
        MunicipalServiceStatus status,
        List<ServiceRequirementResponse> requirements,
        List<ServiceFeeResponse> fees,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
