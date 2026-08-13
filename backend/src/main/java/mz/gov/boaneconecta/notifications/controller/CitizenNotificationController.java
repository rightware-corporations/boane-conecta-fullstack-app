package mz.gov.boaneconecta.notifications.controller;

import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import mz.gov.boaneconecta.notifications.dto.NotificationResponse;
import mz.gov.boaneconecta.notifications.dto.UnreadCountResponse;
import mz.gov.boaneconecta.notifications.service.NotificationService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/citizen/notifications")
public class CitizenNotificationController {
    private final NotificationService notificationService;

    public CitizenNotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ApiResponse<List<NotificationResponse>> list(@AuthenticationPrincipal UserDetailsImpl principal) {
        return ApiResponse.success("Notifications retrieved", notificationService.listCitizen(principal.getId()));
    }

    @GetMapping("/unread-count")
    public ApiResponse<UnreadCountResponse> unreadCount(@AuthenticationPrincipal UserDetailsImpl principal) {
        return ApiResponse.success("Unread count retrieved", new UnreadCountResponse(notificationService.unreadCount(principal.getId())));
    }

    @PatchMapping("/{id}/read")
    public ApiResponse<NotificationResponse> markRead(@AuthenticationPrincipal UserDetailsImpl principal, @PathVariable UUID id) {
        return ApiResponse.success("Notification marked as read", notificationService.markRead(principal.getId(), id));
    }

    @PatchMapping("/read-all")
    public ApiResponse<List<NotificationResponse>> markAllRead(@AuthenticationPrincipal UserDetailsImpl principal) {
        return ApiResponse.success("Notifications marked as read", notificationService.markAllRead(principal.getId()));
    }
}
