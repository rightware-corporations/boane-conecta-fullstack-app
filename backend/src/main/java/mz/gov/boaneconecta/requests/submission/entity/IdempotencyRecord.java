package mz.gov.boaneconecta.requests.submission.entity;

import jakarta.persistence.*;
import lombok.*;
import mz.gov.boaneconecta.users.entity.User;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;
import java.util.UUID;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "idempotency_records")
public class IdempotencyRecord {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "citizen_user_id") private User citizenUser;
    @Column(nullable = false, length = 80) private String operation;
    @Column(name = "idempotency_key_hash", nullable = false, length = 64) private String keyHash;
    @Column(name = "request_fingerprint", nullable = false, length = 64) private String requestFingerprint;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private IdempotencyState state;
    @Column(name = "response_resource_id") private UUID responseResourceId;
    @Column(name = "response_reference", length = 80) private String responseReference;
    @Column(name = "expires_at", nullable = false) private Instant expiresAt;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @Column(name = "completed_at") private Instant completedAt;

    public void complete(UUID resourceId, String reference, Instant now) {
        state = IdempotencyState.COMPLETED;
        responseResourceId = resourceId;
        responseReference = reference;
        completedAt = now;
    }
}
