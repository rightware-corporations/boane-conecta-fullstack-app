package mz.gov.boaneconecta.departments.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import mz.gov.boaneconecta.departments.entity.DepartmentStatus;

public record DepartmentRequest(
        @NotBlank @Size(max = 150) String name,
        @Size(max = 180) String slug,
        String description,
        DepartmentStatus status) {
}
