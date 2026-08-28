package mz.gov.boaneconecta.queue.entity;

import jakarta.persistence.*;
import lombok.*;
import mz.gov.boaneconecta.appointments.entity.Appointment;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.users.entity.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "queue_tickets")
public class QueueTicket {
    @Id @GeneratedValue(strategy = GenerationType.AUTO) private UUID id;
    @Column(name = "ticket_number", nullable = false, length = 30) private String ticketNumber;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "queue_id", nullable = false) private MunicipalQueue queue;
    @Column(name = "business_date", nullable = false) private LocalDate businessDate;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "citizen_user_id") private User citizenUser;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "appointment_id") private Appointment appointment;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "source_ticket_id") private QueueTicket sourceTicket;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "department_id", nullable = false) private Department department;
    @Enumerated(EnumType.STRING) @Builder.Default @Column(nullable = false, length = 30) private QueueTicketStatus status = QueueTicketStatus.WAITING;
    @Column(name = "sequence_number", nullable = false) private Integer sequenceNumber;
    @Enumerated(EnumType.STRING) @Builder.Default @Column(name = "priority_class", nullable = false, length = 30) private QueuePriorityClass priorityClass = QueuePriorityClass.NORMAL;
    @Column(name = "priority_reason", length = 500) private String priorityReason;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "called_desk_id") private QueueDesk calledDesk;
    @Column(name = "called_at") private LocalDateTime calledAt;
    @Column(name = "service_started_at") private LocalDateTime serviceStartedAt;
    @Column(name = "completed_at") private LocalDateTime completedAt;
    @Version private Long version;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;
    @UpdateTimestamp @Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt;
}
