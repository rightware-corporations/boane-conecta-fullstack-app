package mz.gov.boaneconecta.requests.draft.dto;

import java.util.List;

public record DraftValidationResponse(
        boolean valid,
        List<DraftValidationIssue> fieldErrors,
        List<DraftValidationIssue> documentErrors,
        List<DraftValidationIssue> globalErrors,
        RequestDraftResponse draft) {
}
