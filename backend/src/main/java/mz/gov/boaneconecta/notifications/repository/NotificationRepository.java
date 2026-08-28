package mz.gov.boaneconecta.notifications.repository;

import mz.gov.boaneconecta.notifications.entity.Notification;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.time.Instant;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    Optional<Notification> findByIdAndUser(UUID id, User user);

    long countByUserAndReadAtIsNull(User user);
    List<Notification> findByUserAndExpiresAtIsNullOrUserAndExpiresAtAfterOrderByCreatedAtDesc(
            User userWithoutExpiry, User userWithFutureExpiry, Instant now);
}
