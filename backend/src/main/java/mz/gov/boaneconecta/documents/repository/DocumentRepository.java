package mz.gov.boaneconecta.documents.repository;

import mz.gov.boaneconecta.documents.entity.Document;
import mz.gov.boaneconecta.documents.entity.DocumentStatus;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    List<Document> findByOwnerUserOrderByCreatedAtDesc(User ownerUser);
    List<Document> findByOwnerUserAndStatusOrderByCreatedAtDesc(User ownerUser, DocumentStatus status);
    List<Document> findByOwnerUserAndStatusNotOrderByCreatedAtDesc(User ownerUser, DocumentStatus status);
    Optional<Document> findByIdAndOwnerUser(UUID id, User ownerUser);
    List<Document> findAllByOrderByCreatedAtDesc();
    List<Document> findByStatusOrderByCreatedAtDesc(DocumentStatus status);
}
