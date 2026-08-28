package mz.gov.boaneconecta.requests.submission.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;

public record SubmitRequestDraftRequest(
        @NotBlank String declarationVersion,
        @AssertTrue(message = "The declaration must be accepted") boolean declarationAccepted) {}
