package mz.gov.boaneconecta.requests.submission.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import mz.gov.boaneconecta.requests.submission.dto.*;
import mz.gov.boaneconecta.requests.submission.service.RequestSubmissionService;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/citizen/request-drafts")
@PreAuthorize("hasRole('CITIZEN')")
public class CitizenRequestSubmissionController {
    private final RequestSubmissionService service;
    public CitizenRequestSubmissionController(RequestSubmissionService service) { this.service = service; }

    @PostMapping("/{draftId}/submit")
    public ResponseEntity<ApiResponse<RequestSubmissionResponse>> submit(
            @AuthenticationPrincipal UserDetailsImpl principal, @PathVariable UUID draftId,
            @RequestHeader(HttpHeaders.IF_MATCH) String ifMatch,
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @Valid @RequestBody SubmitRequestDraftRequest request) {
        RequestSubmissionResponse response = service.submit(principal.getId(), draftId, ifMatch, idempotencyKey, request);
        return ResponseEntity.status(response.replayed() ? HttpStatus.OK : HttpStatus.CREATED)
                .body(ApiResponse.success(response.replayed() ? "Submission replayed" : "Request submitted", response));
    }
}
