package mz.gov.boaneconecta.auth.dto;

import mz.gov.boaneconecta.users.entity.UserStatus;

import java.util.List;
import java.util.UUID;

public record CurrentUserResponse(
        UUID id,
        String fullName,
        String email,
        String phone,
        UserStatus status,
        boolean emailVerified,
        List<String> roles) {
}
