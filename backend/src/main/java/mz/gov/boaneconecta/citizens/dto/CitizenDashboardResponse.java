package mz.gov.boaneconecta.citizens.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.*;
import java.util.List;
import java.util.UUID;

public record CitizenDashboardResponse(
        ProfileSummary profile,
        @JsonProperty("action_required") List<ActionRequiredItem> actionRequired,
        List<DraftSummary> drafts,
        @JsonProperty("active_requests") List<RequestSummary> activeRequests,
        @JsonProperty("next_appointment") AppointmentSummary nextAppointment,
        @JsonProperty("pending_payments") List<PaymentSummary> pendingPayments,
        @JsonProperty("recent_notifications") List<NotificationSummary> recentNotifications,
        @JsonProperty("unread_notifications") long unreadNotifications) {
    public record ProfileSummary(UUID id, @JsonProperty("full_name") String fullName, String email, String phone) {}
    public record ActionRequiredItem(String kind, String title, String description, String href,
                                     @JsonProperty("related_id") UUID relatedId) {}
    public record DraftSummary(UUID id, UUID serviceId, String serviceTitle, String currentStep,
                               long version, Instant lastSavedAt, Instant expiresAt) {}
    public record RequestSummary(UUID id, String reference, String serviceTitle, String title,
                                 String status, String statusLabel, String nextAction,
                                 LocalDateTime submittedAt, LocalDateTime updatedAt) {}
    public record AppointmentSummary(UUID id, String reference, String status, Instant startsAt,
                                     String departmentName) {}
    public record PaymentSummary(UUID id, String reference, BigDecimal amount, String currency,
                                 LocalDate dueDate, UUID requestId) {}
    public record NotificationSummary(UUID id, String title, String message, String type,
                                      boolean read, LocalDateTime createdAt) {}
}
