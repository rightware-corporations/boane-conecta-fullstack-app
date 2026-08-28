package mz.gov.boaneconecta.requests.submission.entity;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.Instant;
import java.util.UUID;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "domain_outbox_events")
public class DomainOutboxEvent {
    @Id private UUID id;
    @Column(name = "aggregate_type", nullable = false, length = 80) private String aggregateType;
    @Column(name = "aggregate_id", nullable = false) private UUID aggregateId;
    @Column(name = "event_type", nullable = false, length = 120) private String eventType;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "payload_json", nullable = false, columnDefinition = "jsonb") private JsonNode payload;
    @Column(name = "occurred_at", nullable = false) private Instant occurredAt;
    @Column(nullable = false, length = 20) private String status;
    @Column(name = "attempt_count", nullable = false) private int attemptCount;
    @Column(name = "next_attempt_at", nullable = false) private Instant nextAttemptAt;

    public void processed(Instant now) { status = "PROCESSED"; processedAt = now; }
    public void failed(String error, Instant nextAttempt) {
        status = attemptCount >= 9 ? "FAILED" : "PENDING";
        attemptCount++;
        lastError = error == null ? "UNKNOWN" : error.substring(0, Math.min(error.length(), 1000));
        nextAttemptAt = nextAttempt;
    }

    @Column(name = "processed_at") private Instant processedAt;
    @Column(name = "last_error", columnDefinition = "TEXT") private String lastError;
}
