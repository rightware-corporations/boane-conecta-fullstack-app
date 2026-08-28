package mz.gov.boaneconecta.requests.draft.dto;

import com.fasterxml.jackson.databind.JsonNode;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraftStatus;

import java.time.Instant;
import java.util.UUID;

public record RequestDraftResponse(
        UUID id,
        UUID serviceId,
        UUID serviceVersionId,
        UUID formVersionId,
        RequestDraftStatus status,
        String currentStepKey,
        JsonNode answers,
        JsonNode eligibilityAnswers,
        JsonNode eligibilityResult,
        long version,
        Instant lastSavedAt,
        Instant expiresAt,
        UUID submittedRequestId,
        Instant createdAt,
        Instant updatedAt) {
}
