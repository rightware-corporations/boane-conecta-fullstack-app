package mz.gov.boaneconecta.documents.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import mz.gov.boaneconecta.documents.dto.DocumentResponse;
import mz.gov.boaneconecta.documents.service.DocumentService;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/citizen")
@PreAuthorize("hasRole('CITIZEN')")
public class CitizenDocumentController {
    private final DocumentService documentService;

    public CitizenDocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping(value = "/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<DocumentResponse>> upload(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "documentType", required = false) String documentType) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Document uploaded",
                        documentService.uploadCitizenDocument(principal.getId(), file, title, documentType)));
    }

    @GetMapping("/documents")
    public ApiResponse<List<DocumentResponse>> list(@AuthenticationPrincipal UserDetailsImpl principal) {
        return ApiResponse.success("Documents retrieved", documentService.listCitizenDocuments(principal.getId()));
    }

    @GetMapping("/documents/{id}")
    public ApiResponse<DocumentResponse> get(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id) {
        return ApiResponse.success("Document retrieved", documentService.getCitizenDocument(principal.getId(), id));
    }

    @GetMapping("/documents/{id}/download")
    public ResponseEntity<Resource> download(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id) {
        DocumentService.StoredDocument stored = documentService.getCitizenDownload(principal.getId(), id);
        return downloadResponse(stored);
    }

    @DeleteMapping("/documents/{id}")
    public ApiResponse<Void> archive(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id) {
        documentService.archiveCitizenDocument(principal.getId(), id);
        return ApiResponse.success("Document archived", null);
    }

    @PostMapping("/requests/{requestId}/documents/{documentId}")
    public ApiResponse<DocumentResponse> attachToRequest(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID requestId,
            @PathVariable UUID documentId) {
        return ApiResponse.success("Document attached to request",
                documentService.attachCitizenDocumentToRequest(principal.getId(), requestId, documentId));
    }

    @GetMapping("/requests/{requestId}/documents")
    public ApiResponse<List<DocumentResponse>> listRequestDocuments(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID requestId) {
        return ApiResponse.success("Request documents retrieved",
                documentService.listCitizenRequestDocuments(principal.getId(), requestId));
    }

    private ResponseEntity<Resource> downloadResponse(DocumentService.StoredDocument stored) {
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(stored.mimeType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename(stored.fileName())
                        .build()
                        .toString())
                .body(stored.resource());
    }
}
