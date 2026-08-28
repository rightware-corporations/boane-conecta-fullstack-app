package mz.gov.boaneconecta.requests.draft.service;

import com.fasterxml.jackson.databind.JsonNode;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.documents.entity.Document;
import mz.gov.boaneconecta.documents.entity.DocumentStatus;
import mz.gov.boaneconecta.documents.repository.DocumentRepository;
import mz.gov.boaneconecta.requests.draft.dto.DraftDocumentMutationResponse;
import mz.gov.boaneconecta.requests.draft.dto.DraftDocumentResponse;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraft;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraftDocument;
import mz.gov.boaneconecta.requests.draft.repository.RequestDraftDocumentRepository;
import mz.gov.boaneconecta.requests.draft.repository.RequestDraftRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class DraftDocumentService {
    private final RequestDraftService draftService;
    private final RequestDraftRepository draftRepository;
    private final RequestDraftDocumentRepository linkRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    public DraftDocumentService(
            RequestDraftService draftService,
            RequestDraftRepository draftRepository,
            RequestDraftDocumentRepository linkRepository,
            DocumentRepository documentRepository,
            UserRepository userRepository) {
        this.draftService = draftService;
        this.draftRepository = draftRepository;
        this.linkRepository = linkRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public DraftDocumentMutationResponse attach(
            UUID citizenUserId,
            UUID draftId,
            String requirementKey,
            UUID documentId,
            long expectedVersion) {
        RequestDraft draft = draftService.requireEditableDraft(citizenUserId, draftId, expectedVersion);
        User citizen = userRepository.findById(citizenUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Document document = documentRepository.findByIdAndOwnerUser(documentId, citizen)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        JsonNode requirement = requireRequirement(draft, requirementKey);
        validateDocument(requirement, document);

        Instant now = Instant.now();
        linkRepository.findByDraftAndRequirementKeyAndActiveTrue(draft, requirementKey)
                .ifPresent(existing -> {
                    existing.replace(now);
                    linkRepository.save(existing);
                });
        RequestDraftDocument link = linkRepository.saveAndFlush(RequestDraftDocument.builder()
                .draft(draft)
                .requirementKey(requirementKey)
                .document(document)
                .active(true)
                .build());
        draft.touch(now);
        draftRepository.saveAndFlush(draft);
        return new DraftDocumentMutationResponse(draftService.toResponse(draft), toResponse(link));
    }

    @Transactional
    public DraftDocumentMutationResponse detach(
            UUID citizenUserId,
            UUID draftId,
            String requirementKey,
            long expectedVersion) {
        RequestDraft draft = draftService.requireEditableDraft(citizenUserId, draftId, expectedVersion);
        RequestDraftDocument link = linkRepository.findByDraftAndRequirementKeyAndActiveTrue(draft, requirementKey)
                .orElseThrow(() -> new ResourceNotFoundException("Draft document not found"));
        DraftDocumentResponse removed = toResponse(link);
        Instant now = Instant.now();
        link.replace(now);
        linkRepository.save(link);
        draft.touch(now);
        draftRepository.saveAndFlush(draft);
        return new DraftDocumentMutationResponse(draftService.toResponse(draft), removed);
    }

    @Transactional(readOnly = true)
    public List<DraftDocumentResponse> list(UUID citizenUserId, UUID draftId) {
        RequestDraft draft = draftService.requireOwnedDraft(citizenUserId, draftId);
        return linkRepository.findByDraftAndActiveTrueOrderByCreatedAt(draft).stream()
                .map(this::toResponse)
                .toList();
    }

    private JsonNode requireRequirement(RequestDraft draft, String requirementKey) {
        for (JsonNode requirement : draft.getFormVersion().getDocumentRequirements()) {
            if (requirementKey.equals(requirement.path("key").asText())) {
                return requirement;
            }
        }
        throw new ResourceNotFoundException("Document requirement not found");
    }

    private void validateDocument(JsonNode requirement, Document document) {
        if (document.getStatus() != DocumentStatus.VALID) {
            throw new IllegalArgumentException("Document has not passed security validation");
        }
        List<String> accepted = new ArrayList<>();
        requirement.path("acceptedMimeTypes").forEach(value -> accepted.add(value.asText()));
        if (!accepted.contains(document.getDetectedMimeType())) {
            throw new IllegalArgumentException("Document type is not accepted for this requirement");
        }
        long maximum = requirement.path("maxSizeBytes").asLong(0);
        if (maximum <= 0 || document.getFileSize() == null || document.getFileSize() > maximum) {
            throw new IllegalArgumentException("Document exceeds the allowed size for this requirement");
        }
    }

    private DraftDocumentResponse toResponse(RequestDraftDocument link) {
        Document document = link.getDocument();
        Instant attachedAt = link.getCreatedAt() == null
                ? Instant.now()
                : link.getCreatedAt();
        return new DraftDocumentResponse(
                link.getId(),
                link.getRequirementKey(),
                document.getId(),
                document.getTitle(),
                document.getOriginalFileName(),
                document.getDetectedMimeType(),
                document.getFileSize(),
                document.getStatus(),
                attachedAt);
    }
}
