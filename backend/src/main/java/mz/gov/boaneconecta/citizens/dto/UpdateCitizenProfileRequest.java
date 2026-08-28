package mz.gov.boaneconecta.citizens.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record UpdateCitizenProfileRequest(
        @NotBlank @Size(max = 150) String fullName,
        @Size(max = 50) String phone,
        @Size(max = 50) String nuit,
        @Size(max = 50) String documentType,
        @Size(max = 80) String documentNumber,
        LocalDate birthDate,
        @Size(max = 30) String gender,
        @Size(max = 1000) String address) {}
