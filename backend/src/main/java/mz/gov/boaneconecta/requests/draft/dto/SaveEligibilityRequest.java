package mz.gov.boaneconecta.requests.draft.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotNull;

public record SaveEligibilityRequest(@NotNull JsonNode answers) {
}
