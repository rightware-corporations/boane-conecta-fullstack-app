package mz.gov.boaneconecta.municipalservices.forms.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateRequestDefinitionVersionRequest(
        @NotBlank @Pattern(regexp = "[a-z0-9][a-z0-9_-]{1,99}") String definitionKey,
        @NotBlank @Size(max = 180) String name,
        @NotNull JsonNode schema,
        @NotNull JsonNode eligibility,
        @NotNull JsonNode documentRequirements,
        @NotBlank @Size(max = 80) String declarationVersion,
        @NotBlank @Size(max = 4000) String declarationText,
        boolean onlineSubmissionEnabled) {
}
