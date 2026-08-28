package mz.gov.boaneconecta.notifications.service;

import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.notifications.dto.CreateNotificationRequest;
import mz.gov.boaneconecta.notifications.dto.NotificationResponse;
import mz.gov.boaneconecta.notifications.dto.CitizenNotificationResponse;
import mz.gov.boaneconecta.notifications.entity.Notification;
import mz.gov.boaneconecta.notifications.repository.NotificationRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public NotificationResponse create(CreateNotificationRequest request) {
        User user = requireUser(request.userId());
        Notification notification = Notification.builder()
                .user(user)
                .title(request.title().trim())
                .message(request.message().trim())
                .type(clean(request.type()))
                .build();
        return toResponse(notificationRepository.saveAndFlush(notification));
    }

    @Transactional(readOnly = true)
    public List<CitizenNotificationResponse> listCitizen(UUID userId) {
        User user = requireUser(userId);
        return notificationRepository
                .findByUserAndExpiresAtIsNullOrUserAndExpiresAtAfterOrderByCreatedAtDesc(user, user, Instant.now())
                .stream().map(this::toCitizenResponse).toList();
    }

    @Transactional(readOnly = true)
    public long unreadCount(UUID userId) {
        return notificationRepository.countByUserAndReadAtIsNull(requireUser(userId));
    }

    @Transactional
    public CitizenNotificationResponse markRead(UUID userId, UUID notificationId) {
        User user = requireUser(userId);
        Notification notification = notificationRepository.findByIdAndUser(notificationId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (notification.getReadAt() == null) {
            notification.setReadAt(LocalDateTime.now());
        }
        return toCitizenResponse(notificationRepository.saveAndFlush(notification));
    }

    @Transactional
    public List<CitizenNotificationResponse> markAllRead(UUID userId) {
        User user = requireUser(userId);
        LocalDateTime now = LocalDateTime.now();
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        for (Notification notification : notifications) {
            if (notification.getReadAt() == null) {
                notification.setReadAt(now);
            }
        }
        return notificationRepository.saveAllAndFlush(notifications).stream().map(this::toCitizenResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> listAdmin() {
        return notificationRepository.findAll().stream()
                .sorted((left, right) -> right.getCreatedAt().compareTo(left.getCreatedAt()))
                .map(this::toResponse)
                .toList();
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private NotificationResponse toResponse(Notification notification) {
        User user = notification.getUser();
        return new NotificationResponse(notification.getId(), user == null ? null : user.getId(), user == null ? null : user.getFullName(), notification.getTitle(), notification.getMessage(), notification.getType(), notification.getReadAt() != null, notification.getReadAt(), notification.getCreatedAt());
    }

    private CitizenNotificationResponse toCitizenResponse(Notification notification) {
        return new CitizenNotificationResponse(notification.getId(), notification.getTitle(), notification.getMessage(),
                notification.getType(), notification.getCategory(), notification.getRelatedId(), notification.getActionHref(),
                notification.getReadAt() != null, notification.getReadAt(), notification.getCreatedAt());
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim().toUpperCase();
    }
}
