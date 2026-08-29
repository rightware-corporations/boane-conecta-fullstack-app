package mz.gov.boaneconecta.queue.entity;

import jakarta.persistence.*;
import lombok.*;
import mz.gov.boaneconecta.users.entity.User;
import java.time.Instant;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "service_sessions")
public class ServiceSession {
    @Id @GeneratedValue(strategy = GenerationType.AUTO) private UUID id;
    @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "queue_ticket_id", nullable = false, unique = true) private QueueTicket queueTicket;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "desk_id", nullable = false) private QueueDesk desk;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "staff_user_id", nullable = false) private User staffUser;
    @Column(name = "started_at", nullable = false) private Instant startedAt;
    @Column(name = "ended_at") private Instant endedAt;
    @Column(name = "outcome_code", length = 80) private String outcomeCode;
    @Enumerated(EnumType.STRING) @Builder.Default @Column(nullable = false, length = 20) private ServiceSessionStatus status = ServiceSessionStatus.ACTIVE;
    @Version private Long version;
}
