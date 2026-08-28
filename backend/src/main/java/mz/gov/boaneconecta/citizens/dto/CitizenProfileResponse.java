package mz.gov.boaneconecta.citizens.dto;

import java.time.LocalDate;
import java.util.UUID;

public record CitizenProfileResponse(UUID id, String fullName, String email, String phone,
        Boolean emailVerified, String nuit, String documentType, String documentNumber,
        LocalDate birthDate, String gender, String address, String districtName) {}
