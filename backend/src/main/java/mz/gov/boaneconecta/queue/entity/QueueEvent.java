package mz.gov.boaneconecta.queue.entity;

import jakarta.persistence.*;
import lombok.*;
import mz.gov.boaneconecta.users.entity.User;
import java.time.Instant;
import java.util.UUID;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "queue_events")
public class QueueEvent {
    @Id private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "ticket_id") private QueueTicket ticket;
    @Column(name = "event_type", nullable = false, length = 60) private String eventType;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "actor_user_id") private User actorUser;
    @Column(length = 500) private String reason;
    @Column(name = "occurred_at", nullable = false) private Instant occurredAt;
}
