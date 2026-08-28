package mz.gov.boaneconecta.requests.draft.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateRequestDraftRequest(
        @NotNull UUID serviceId,
        Boolean resumeExisting) {
    public boolean shouldResumeExisting() {
        return resumeExisting == null || resumeExisting;
    }
}
