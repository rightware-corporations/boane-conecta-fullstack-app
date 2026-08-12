package mz.gov.boaneconecta.documents.dto;

import jakarta.validation.constraints.NotNull;
import mz.gov.boaneconecta.documents.entity.DocumentStatus;

public record UpdateDocumentStatusRequest(@NotNull DocumentStatus status) {
}
