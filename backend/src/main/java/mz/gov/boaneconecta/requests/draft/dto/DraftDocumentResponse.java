package mz.gov.boaneconecta.requests.draft.dto;

import mz.gov.boaneconecta.documents.entity.DocumentStatus;

import java.time.Instant;
import java.util.UUID;

public record DraftDocumentResponse(
        UUID linkId,
        String requirementKey,
        UUID documentId,
        String title,
        String originalFileName,
        String detectedMimeType,
        Long fileSize,
        DocumentStatus status,
        Instant attachedAt) {
}
