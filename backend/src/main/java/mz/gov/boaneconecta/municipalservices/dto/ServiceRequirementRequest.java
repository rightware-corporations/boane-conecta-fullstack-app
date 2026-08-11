package mz.gov.boaneconecta.municipalservices.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ServiceRequirementRequest(
        @NotBlank @Size(max = 180) String title,
        String description,
        Boolean required) {
}
