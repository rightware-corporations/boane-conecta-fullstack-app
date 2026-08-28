package mz.gov.boaneconecta.documents.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mz.gov.boaneconecta.users.entity.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "documents")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "owner_user_id")
    private User ownerUser;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(name = "document_type", length = 80)
    private String documentType;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "original_file_name", length = 255)
    private String originalFileName;

    @Column(name = "file_path", columnDefinition = "TEXT")
    private String filePath;

    @Column(name = "storage_bucket", length = 120)
    private String storageBucket;

    @Column(name = "storage_key", columnDefinition = "TEXT")
    private String storageKey;

    @Column(name = "detected_mime_type", length = 100)
    private String detectedMimeType;

    @Column(length = 64)
    private String sha256;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 30)
    private DocumentClassification classification = DocumentClassification.PERSONAL;

    @Column(name = "current_version_number", nullable = false)
    @Builder.Default
    private Integer currentVersionNumber = 1;

    @Column(name = "scan_failure_code", length = 80)
    private String scanFailureCode;

    @Column(name = "mime_type", length = 100)
    private String mimeType;

    @Column(name = "file_size")
    private Long fileSize;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 30)
    private Visibility visibility = Visibility.PRIVATE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 30)
    private DocumentStatus status = DocumentStatus.RECEIVED;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

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
}
