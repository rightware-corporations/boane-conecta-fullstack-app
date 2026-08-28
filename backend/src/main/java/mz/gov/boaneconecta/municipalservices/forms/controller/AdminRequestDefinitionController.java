package mz.gov.boaneconecta.municipalservices.forms.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.municipalservices.forms.dto.CreateRequestDefinitionVersionRequest;
import mz.gov.boaneconecta.municipalservices.forms.dto.RequestDefinitionVersionResponse;
import mz.gov.boaneconecta.municipalservices.forms.service.RequestDefinitionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/services/{serviceId}/request-definitions")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
public class AdminRequestDefinitionController {
    private final RequestDefinitionService requestDefinitionService;

    public AdminRequestDefinitionController(RequestDefinitionService requestDefinitionService) {
        this.requestDefinitionService = requestDefinitionService;
    }

    @PostMapping("/versions")
    public ResponseEntity<ApiResponse<RequestDefinitionVersionResponse>> createDraftVersion(
            @PathVariable UUID serviceId,
            @Valid @RequestBody CreateRequestDefinitionVersionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                "Request definition draft created",
                requestDefinitionService.createDraftVersion(serviceId, request)));
    }

    @PostMapping("/versions/{versionId}/publish")
    public ApiResponse<RequestDefinitionVersionResponse> publish(
            @PathVariable UUID serviceId,
            @PathVariable UUID versionId) {
        return ApiResponse.success(
                "Request definition published",
                requestDefinitionService.publish(serviceId, versionId));
    }
}
