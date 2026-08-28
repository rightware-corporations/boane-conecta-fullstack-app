package mz.gov.boaneconecta.requests.draft.repository;

import mz.gov.boaneconecta.requests.draft.entity.RequestDraft;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraftDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RequestDraftDocumentRepository extends JpaRepository<RequestDraftDocument, UUID> {
    Optional<RequestDraftDocument> findByDraftAndRequirementKeyAndActiveTrue(RequestDraft draft, String requirementKey);
    List<RequestDraftDocument> findByDraftAndActiveTrueOrderByCreatedAt(RequestDraft draft);
}
