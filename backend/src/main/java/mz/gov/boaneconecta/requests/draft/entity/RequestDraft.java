package mz.gov.boaneconecta.requests.draft.entity;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.municipalservices.forms.entity.MunicipalServiceVersion;
import mz.gov.boaneconecta.municipalservices.forms.entity.ServiceFormVersion;
import mz.gov.boaneconecta.requests.entity.CitizenRequest;
import mz.gov.boaneconecta.users.entity.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "request_drafts")
public class RequestDraft {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "citizen_user_id", nullable = false)
    private User citizenUser;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "service_id", nullable = false)
    private MunicipalService service;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "service_version_id", nullable = false)
    private MunicipalServiceVersion serviceVersion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "form_version_id", nullable = false)
    private ServiceFormVersion formVersion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RequestDraftStatus status;

    @Column(name = "current_step_key", length = 100)
    private String currentStepKey;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private JsonNode answers;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "eligibility_answers", nullable = false, columnDefinition = "jsonb")
    private JsonNode eligibilityAnswers;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "eligibility_result", columnDefinition = "jsonb")
    private JsonNode eligibilityResult;

    @Version
    @Column(nullable = false)
    private long version;

    @Column(name = "last_saved_at")
    private Instant lastSavedAt;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_request_id")
    private CitizenRequest submittedRequest;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public boolean isEditable(Instant now) {
        return (status == RequestDraftStatus.IN_PROGRESS || status == RequestDraftStatus.READY_FOR_REVIEW)
                && expiresAt.isAfter(now);
    }

    public void expire() {
        status = RequestDraftStatus.EXPIRED;
    }

    public void saveAnswers(JsonNode answers, String stepKey, Instant savedAt) {
        this.answers = answers;
        this.currentStepKey = stepKey;
        this.lastSavedAt = savedAt;
        if (status == RequestDraftStatus.READY_FOR_REVIEW) {
            status = RequestDraftStatus.IN_PROGRESS;
        }
    }

    public void saveEligibility(JsonNode answers, JsonNode result, Instant savedAt) {
        this.eligibilityAnswers = answers;
        this.eligibilityResult = result;
        this.lastSavedAt = savedAt;
        if (status == RequestDraftStatus.READY_FOR_REVIEW) {
            status = RequestDraftStatus.IN_PROGRESS;
        }
    }

    public void markReadyForReview() {
        status = RequestDraftStatus.READY_FOR_REVIEW;
    }

    public void touch(Instant savedAt) {
        lastSavedAt = savedAt;
        if (status == RequestDraftStatus.READY_FOR_REVIEW) {
            status = RequestDraftStatus.IN_PROGRESS;
        }
    }

    public void markSubmitted(CitizenRequest request, Instant savedAt) {
        this.submittedRequest = request;
        this.status = RequestDraftStatus.SUBMITTED;
        this.lastSavedAt = savedAt;
    }
}
