package mz.gov.boaneconecta.municipalservices.forms.dto;

import com.fasterxml.jackson.databind.JsonNode;
import mz.gov.boaneconecta.municipalservices.forms.entity.DefinitionStatus;

import java.time.Instant;
import java.util.UUID;

public record RequestDefinitionVersionResponse(
        UUID serviceId,
        UUID serviceVersionId,
        int serviceVersion,
        UUID formDefinitionId,
        UUID formVersionId,
        int formVersion,
        DefinitionStatus status,
        String definitionKey,
        String name,
        String serviceTitle,
        String serviceDescription,
        String processingTime,
        boolean onlineSubmissionEnabled,
        JsonNode schema,
        JsonNode eligibility,
        JsonNode documentRequirements,
        String declarationVersion,
        String declarationText,
        String schemaChecksum,
        Instant publishedAt) {
}
