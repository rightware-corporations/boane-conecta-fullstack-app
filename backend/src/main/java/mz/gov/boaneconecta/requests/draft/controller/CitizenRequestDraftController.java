package mz.gov.boaneconecta.requests.draft.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import mz.gov.boaneconecta.requests.draft.dto.CreateRequestDraftRequest;
import mz.gov.boaneconecta.requests.draft.dto.RequestDraftResponse;
import mz.gov.boaneconecta.requests.draft.dto.SaveDraftAnswersRequest;
import mz.gov.boaneconecta.requests.draft.dto.SaveEligibilityRequest;
import mz.gov.boaneconecta.requests.draft.dto.AttachDraftDocumentRequest;
import mz.gov.boaneconecta.requests.draft.dto.DraftDocumentMutationResponse;
import mz.gov.boaneconecta.requests.draft.dto.DraftDocumentResponse;
import mz.gov.boaneconecta.requests.draft.service.DraftDocumentService;
import mz.gov.boaneconecta.requests.draft.dto.DraftValidationResponse;
import mz.gov.boaneconecta.requests.draft.service.DraftValidationService;
import mz.gov.boaneconecta.requests.draft.service.RequestDraftService;
import mz.gov.boaneconecta.requests.draft.service.VersionHeaderParser;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/v1/citizen/request-drafts")
@PreAuthorize("hasRole('CITIZEN')")
public class CitizenRequestDraftController {
    private final RequestDraftService draftService;
    private final VersionHeaderParser versionHeaderParser;
    private final DraftDocumentService draftDocumentService;
    private final DraftValidationService draftValidationService;

    public CitizenRequestDraftController(
            RequestDraftService draftService,
            VersionHeaderParser versionHeaderParser,
            DraftDocumentService draftDocumentService,
            DraftValidationService draftValidationService) {
        this.draftService = draftService;
        this.versionHeaderParser = versionHeaderParser;
        this.draftDocumentService = draftDocumentService;
        this.draftValidationService = draftValidationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RequestDraftResponse>> createOrResume(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody CreateRequestDraftRequest request) {
        RequestDraftResponse response = draftService.createOrResume(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.ETAG, etag(response.version()))
                .body(ApiResponse.success("Request draft ready", response));
    }

    @GetMapping("/{draftId}")
    public ResponseEntity<ApiResponse<RequestDraftResponse>> get(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID draftId) {
        RequestDraftResponse response = draftService.get(principal.getId(), draftId);
        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, etag(response.version()))
                .body(ApiResponse.success("Request draft retrieved", response));
    }

    @PatchMapping("/{draftId}/answers")
    public ResponseEntity<ApiResponse<RequestDraftResponse>> saveAnswers(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID draftId,
            @RequestHeader(HttpHeaders.IF_MATCH) String ifMatch,
            @Valid @RequestBody SaveDraftAnswersRequest request) {
        RequestDraftResponse response = draftService.saveAnswers(
                principal.getId(),
                draftId,
                versionHeaderParser.parse(ifMatch),
                request.stepKey(),
                request.answers());
        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, etag(response.version()))
                .body(ApiResponse.success("Request draft saved", response));
    }

    @PutMapping("/{draftId}/eligibility")
    public ResponseEntity<ApiResponse<RequestDraftResponse>> saveEligibility(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID draftId,
            @RequestHeader(HttpHeaders.IF_MATCH) String ifMatch,
            @Valid @RequestBody SaveEligibilityRequest request) {
        RequestDraftResponse response = draftService.saveEligibility(
                principal.getId(),
                draftId,
                versionHeaderParser.parse(ifMatch),
                request.answers());
        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, etag(response.version()))
                .body(ApiResponse.success("Eligibility saved", response));
    }

    @PutMapping("/{draftId}/documents/{requirementKey}")
    public ResponseEntity<ApiResponse<DraftDocumentMutationResponse>> attachDocument(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID draftId,
            @PathVariable String requirementKey,
            @RequestHeader(HttpHeaders.IF_MATCH) String ifMatch,
            @Valid @RequestBody AttachDraftDocumentRequest request) {
        DraftDocumentMutationResponse response = draftDocumentService.attach(
                principal.getId(),
                draftId,
                requirementKey,
                request.documentId(),
                versionHeaderParser.parse(ifMatch));
        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, etag(response.draft().version()))
                .body(ApiResponse.success("Document attached to request draft", response));
    }

    @DeleteMapping("/{draftId}/documents/{requirementKey}")
    public ResponseEntity<ApiResponse<DraftDocumentMutationResponse>> detachDocument(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID draftId,
            @PathVariable String requirementKey,
            @RequestHeader(HttpHeaders.IF_MATCH) String ifMatch) {
        DraftDocumentMutationResponse response = draftDocumentService.detach(
                principal.getId(),
                draftId,
                requirementKey,
                versionHeaderParser.parse(ifMatch));
        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, etag(response.draft().version()))
                .body(ApiResponse.success("Document detached from request draft", response));
    }

    @GetMapping("/{draftId}/documents")
    public ApiResponse<List<DraftDocumentResponse>> listDocuments(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID draftId) {
        return ApiResponse.success(
                "Draft documents retrieved",
                draftDocumentService.list(principal.getId(), draftId));
    }

    @PostMapping("/{draftId}/validate")
    public ResponseEntity<ApiResponse<DraftValidationResponse>> validate(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID draftId,
            @RequestHeader(HttpHeaders.IF_MATCH) String ifMatch) {
        DraftValidationResponse response = draftValidationService.validate(
                principal.getId(),
                draftId,
                versionHeaderParser.parse(ifMatch));
        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, etag(response.draft().version()))
                .body(ApiResponse.success("Request draft validation completed", response));
    }

    private String etag(long version) {
        return "\"" + version + "\"";
    }
}
