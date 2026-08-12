package mz.gov.boaneconecta.documents.dto;

import mz.gov.boaneconecta.documents.entity.DocumentStatus;
import mz.gov.boaneconecta.documents.entity.Visibility;

import java.time.LocalDateTime;
import java.util.UUID;

public record DocumentResponse(
        UUID id,
        UUID ownerUserId,
        String ownerName,
        String title,
        String documentType,
        String fileName,
        String originalFileName,
        String mimeType,
        Long fileSize,
        Visibility visibility,
        DocumentStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
