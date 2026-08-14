package mz.gov.boaneconecta.citizens.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record CitizenDashboardResponse(
        ProfileResponse profile,
        StatsResponse stats,
        @JsonProperty("recent_activity") List<ActivityResponse> recentActivity,
        @JsonProperty("upcoming_appointments") List<Object> upcomingAppointments,
        @JsonProperty("pending_payments") List<Object> pendingPayments,
        @JsonProperty("recent_notifications") List<Object> recentNotifications
) {
    public record ProfileResponse(
            UUID id,
            @JsonProperty("user_id") UUID userId,
            @JsonProperty("full_name") String fullName,
            String role,
            String phone,
            @JsonProperty("avatar_url") String avatarUrl,
            String nuit,
            String bi,
            String address,
            String district,
            String neighborhood,
            boolean verified,
            @JsonProperty("email_notifications") boolean emailNotifications,
            @JsonProperty("sms_notifications") boolean smsNotifications,
            @JsonProperty("preferred_contact_method") String preferredContactMethod,
            @JsonProperty("created_at") LocalDateTime createdAt,
            @JsonProperty("updated_at") LocalDateTime updatedAt
    ) {
    }

    public record StatsResponse(
            @JsonProperty("active_licenses") long activeLicenses,
            @JsonProperty("pending_requests") long pendingRequests,
            @JsonProperty("pending_payments") long pendingPayments,
            @JsonProperty("upcoming_appointments") long upcomingAppointments,
            @JsonProperty("unread_notifications") long unreadNotifications
    ) {
    }

    public record ActivityResponse(
            UUID id,
            String type,
            String title,
            String description,
            LocalDateTime date,
            String status
    ) {
    }
}
