package mz.gov.boaneconecta.queue.entity;

import jakarta.persistence.*;
import lombok.*;
import mz.gov.boaneconecta.users.entity.User;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "queue_staff_scopes", uniqueConstraints = @UniqueConstraint(columnNames = {"queue_id", "staff_user_id"}))
public class QueueStaffScope {
    @Id @GeneratedValue(strategy = GenerationType.AUTO) private UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "queue_id", nullable = false) private MunicipalQueue queue;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "staff_user_id", nullable = false) private User staffUser;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
}
