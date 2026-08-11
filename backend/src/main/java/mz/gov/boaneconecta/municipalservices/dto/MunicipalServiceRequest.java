package mz.gov.boaneconecta.municipalservices.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalServiceStatus;

import java.util.UUID;

public record MunicipalServiceRequest(
        UUID departmentId,
        @NotBlank @Size(max = 180) String title,
        @Size(max = 200) String slug,
        String description,
        @Size(max = 100) String processingTime,
        MunicipalServiceStatus status) {
}
