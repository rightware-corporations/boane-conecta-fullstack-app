package mz.gov.boaneconecta.requests.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mz.gov.boaneconecta.core.Priority;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.users.entity.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.Instant;
import java.util.UUID;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraft;
import mz.gov.boaneconecta.requests.submission.entity.RequestAnswerSnapshot;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "citizen_requests")
public class CitizenRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "request_number", nullable = false, unique = true, length = 50)
    private String requestNumber;

    @ManyToOne
    @JoinColumn(name = "citizen_user_id", nullable = false)
    private User citizenUser;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private MunicipalService service;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 40)
    private RequestStatus status = RequestStatus.SUBMITTED;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(length = 30)
    private Priority priority = Priority.NORMAL;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @ManyToOne
    @JoinColumn(name = "assigned_to_user_id")
    private User assignedToUser;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_draft_id", unique = true)
    private RequestDraft sourceDraft;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_snapshot_id")
    private RequestAnswerSnapshot answerSnapshot;

    @Column(name = "declaration_version", length = 80)
    private String declarationVersion;

    @Column(name = "declaration_accepted_at")
    private Instant declarationAcceptedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
