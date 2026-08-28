package mz.gov.boaneconecta.municipalservices.forms.entity;

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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
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
@Table(name = "service_form_versions", uniqueConstraints =
        @UniqueConstraint(name = "uq_form_version_number", columnNames = {"definition_id", "version_number"}))
public class ServiceFormVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "definition_id", nullable = false)
    private ServiceFormDefinition definition;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "service_version_id", nullable = false)
    private MunicipalServiceVersion serviceVersion;

    @Column(name = "version_number", nullable = false)
    private int versionNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DefinitionStatus status;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "schema_json", nullable = false, columnDefinition = "jsonb")
    private JsonNode schema;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "eligibility_json", nullable = false, columnDefinition = "jsonb")
    private JsonNode eligibility;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "document_requirements_json", nullable = false, columnDefinition = "jsonb")
    private JsonNode documentRequirements;

    @Column(name = "declaration_version", nullable = false, length = 80)
    private String declarationVersion;

    @Column(name = "declaration_text", nullable = false, columnDefinition = "TEXT")
    private String declarationText;

    @Column(name = "schema_checksum", nullable = false, length = 80)
    private String schemaChecksum;

    @Column(name = "published_at")
    private Instant publishedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public void publish(Instant now) {
        status = DefinitionStatus.PUBLISHED;
        publishedAt = now;
    }

    public void retire() {
        status = DefinitionStatus.RETIRED;
    }
}
