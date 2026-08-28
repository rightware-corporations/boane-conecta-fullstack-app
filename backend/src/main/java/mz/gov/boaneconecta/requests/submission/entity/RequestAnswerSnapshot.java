package mz.gov.boaneconecta.requests.submission.entity;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import mz.gov.boaneconecta.municipalservices.forms.entity.MunicipalServiceVersion;
import mz.gov.boaneconecta.municipalservices.forms.entity.ServiceFormVersion;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraft;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.Instant;
import java.util.UUID;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
@Entity @Table(name = "request_answer_snapshots")
public class RequestAnswerSnapshot {
    @Id private UUID id;
    @OneToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "draft_id") private RequestDraft draft;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "service_version_id") private MunicipalServiceVersion serviceVersion;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "form_version_id") private ServiceFormVersion formVersion;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "answers_json", nullable = false, columnDefinition = "jsonb") private JsonNode answers;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "eligibility_json", nullable = false, columnDefinition = "jsonb") private JsonNode eligibility;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "document_manifest_json", nullable = false, columnDefinition = "jsonb") private JsonNode documentManifest;
    @Column(name = "declaration_version", nullable = false, length = 80) private String declarationVersion;
    @Column(name = "declaration_accepted_at", nullable = false) private Instant declarationAcceptedAt;
    @Column(name = "schema_checksum", nullable = false, length = 80) private String schemaChecksum;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
}
