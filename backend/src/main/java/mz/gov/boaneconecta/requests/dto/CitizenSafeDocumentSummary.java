package mz.gov.boaneconecta.requests.dto;

import mz.gov.boaneconecta.documents.entity.DocumentStatus;
import java.util.UUID;

public record CitizenSafeDocumentSummary(UUID id, String title, String fileName, DocumentStatus status) {}
