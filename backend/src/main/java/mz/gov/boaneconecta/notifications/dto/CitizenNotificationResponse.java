package mz.gov.boaneconecta.notifications.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record CitizenNotificationResponse(
        UUID id, String title, String message, String type, String category,
        UUID relatedId, String actionHref, boolean read, LocalDateTime readAt, LocalDateTime createdAt) {}
