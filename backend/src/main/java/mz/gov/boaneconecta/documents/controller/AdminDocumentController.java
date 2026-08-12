package mz.gov.boaneconecta.documents.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.documents.dto.DocumentResponse;
import mz.gov.boaneconecta.documents.dto.UpdateDocumentStatusRequest;
import mz.gov.boaneconecta.documents.entity.DocumentStatus;
import mz.gov.boaneconecta.documents.service.DocumentService;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/documents")
public class AdminDocumentController {
    private final DocumentService documentService;

    public AdminDocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ApiResponse<List<DocumentResponse>> list(
            @RequestParam(value = "status", required = false) DocumentStatus status) {
        return ApiResponse.success("Documents retrieved", documentService.listAdminDocuments(status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ApiResponse<DocumentResponse> get(@PathVariable UUID id) {
        return ApiResponse.success("Document retrieved", documentService.getAdminDocument(id));
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ResponseEntity<Resource> download(@PathVariable UUID id) {
        DocumentService.StoredDocument stored = documentService.getAdminDownload(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(stored.mimeType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename(stored.fileName())
                        .build()
                        .toString())
                .body(stored.resource());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER')")
    public ApiResponse<DocumentResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateDocumentStatusRequest request) {
        return ApiResponse.success("Document status updated", documentService.updateStatus(id, request));
    }
}
