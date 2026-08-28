package mz.gov.boaneconecta.requests.draft.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SaveDraftAnswersRequest(
        @NotBlank String stepKey,
        @NotNull JsonNode answers) {
}
