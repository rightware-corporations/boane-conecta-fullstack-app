package mz.gov.boaneconecta.documents.entity;

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

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "document_versions", uniqueConstraints =
        @UniqueConstraint(name = "uq_document_version", columnNames = {"document_id", "version_number"}))
public class DocumentVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "version_number", nullable = false)
    private int versionNumber;

    @Column(name = "storage_bucket", length = 120)
    private String storageBucket;

    @Column(name = "storage_key", columnDefinition = "TEXT")
    private String storageKey;

    @Column(name = "legacy_file_path", columnDefinition = "TEXT")
    private String legacyFilePath;

    @Column(name = "original_file_name", length = 255)
    private String originalFileName;

    @Column(name = "detected_mime_type", length = 100)
    private String detectedMimeType;

    @Column(name = "file_size", nullable = false)
    private long fileSize;

    @Column(length = 64)
    private String sha256;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DocumentStatus status;

    @Column(name = "scan_failure_code", length = 80)
    private String scanFailureCode;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public void markScanning() {
        status = DocumentStatus.SCANNING;
    }

    public void markValid() {
        status = DocumentStatus.VALID;
        scanFailureCode = null;
    }

    public void reject(String failureCode) {
        status = DocumentStatus.REJECTED;
        scanFailureCode = failureCode;
    }

    public void relocate(String bucket, String key) {
        this.storageBucket = bucket;
        this.storageKey = key;
    }
}
