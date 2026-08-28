package mz.gov.boaneconecta.requests.draft.dto;

public record DraftValidationIssue(
        String stepKey,
        String fieldKey,
        String requirementKey,
        String code,
        String message) {
}
