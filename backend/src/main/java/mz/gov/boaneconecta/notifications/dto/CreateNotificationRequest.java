package mz.gov.boaneconecta.notifications.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CreateNotificationRequest(
        @NotNull UUID userId,
        @NotBlank @Size(max = 180) String title,
        @NotBlank String message,
        @Size(max = 50) String type) {
}
