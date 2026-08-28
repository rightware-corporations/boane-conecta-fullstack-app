package mz.gov.boaneconecta.documents.repository;

import mz.gov.boaneconecta.documents.entity.Document;
import mz.gov.boaneconecta.documents.entity.DocumentStatus;
import mz.gov.boaneconecta.documents.entity.DocumentVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DocumentVersionRepository extends JpaRepository<DocumentVersion, UUID> {
    Optional<DocumentVersion> findByDocumentAndVersionNumber(Document document, int versionNumber);
    List<DocumentVersion> findTop50ByStatusOrderByCreatedAtAsc(DocumentStatus status);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select v from DocumentVersion v where v.status = :status order by v.createdAt")
    List<DocumentVersion> findBatchForUpdate(@Param("status") DocumentStatus status, Pageable pageable);
}
