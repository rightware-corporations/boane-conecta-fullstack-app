package mz.gov.boaneconecta.appointments.entity;

import jakarta.persistence.*;
import lombok.*;
import mz.gov.boaneconecta.users.entity.User;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "appointment_holds")
public class AppointmentHold {
    @Id @GeneratedValue(strategy = GenerationType.AUTO) private UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "slot_id", nullable = false) private AppointmentSlot slot;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "citizen_user_id", nullable = false) private User citizenUser;
    @Column(name = "token_hash", nullable = false, unique = true, length = 64) private String tokenHash;
    @Column(name = "idempotency_key_hash", length = 64) private String idempotencyKeyHash;
    @Column(name = "request_fingerprint", nullable = false, length = 64) private String requestFingerprint;
    @Enumerated(EnumType.STRING) @Builder.Default @Column(nullable = false, length = 20) private AppointmentHoldStatus status = AppointmentHoldStatus.ACTIVE;
    @Column(name = "expires_at", nullable = false) private Instant expiresAt;
    @Column(name = "consumed_at") private Instant consumedAt;
    @Column(name = "cancelled_at") private Instant cancelledAt;
    @Version private Long version;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
}
