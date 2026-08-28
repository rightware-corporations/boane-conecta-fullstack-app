package mz.gov.boaneconecta.queue.entity;

import jakarta.persistence.*;
import lombok.*;
import mz.gov.boaneconecta.users.entity.User;
import org.hibernate.annotations.*;
import java.time.Instant;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "queue_desks")
public class QueueDesk {
    @Id @GeneratedValue(strategy = GenerationType.AUTO) private UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "queue_id", nullable = false) private MunicipalQueue queue;
    @Column(nullable = false, length = 30) private String code;
    @Column(name = "display_name", nullable = false, length = 100) private String displayName;
    @Enumerated(EnumType.STRING) @Builder.Default @Column(nullable = false, length = 20) private QueueDeskStatus status = QueueDeskStatus.CLOSED;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "current_staff_user_id") private User currentStaffUser;
    @Version private Long version;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at", nullable = false) private Instant updatedAt;
}
