package mz.gov.boaneconecta.districts.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import mz.gov.boaneconecta.districts.entity.DistrictStatus;

public record DistrictRequest(
        @NotBlank @Size(max = 150) String name,
        @Size(max = 180) String slug,
        String description,
        DistrictStatus status) {
}
