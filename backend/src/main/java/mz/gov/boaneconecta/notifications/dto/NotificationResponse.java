package mz.gov.boaneconecta.notifications.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(UUID id, UUID userId, String userName, String title, String message, String type, boolean read, LocalDateTime readAt, LocalDateTime createdAt) {
}
