package mz.gov.boaneconecta.requests.draft.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AttachDraftDocumentRequest(@NotNull UUID documentId) {
}
