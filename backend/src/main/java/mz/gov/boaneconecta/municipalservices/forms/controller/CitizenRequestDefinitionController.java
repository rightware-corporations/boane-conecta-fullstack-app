package mz.gov.boaneconecta.municipalservices.forms.controller;

import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.municipalservices.forms.dto.RequestDefinitionVersionResponse;
import mz.gov.boaneconecta.municipalservices.forms.service.RequestDefinitionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/citizen/services")
@PreAuthorize("hasRole('CITIZEN')")
public class CitizenRequestDefinitionController {
    private final RequestDefinitionService requestDefinitionService;

    public CitizenRequestDefinitionController(RequestDefinitionService requestDefinitionService) {
        this.requestDefinitionService = requestDefinitionService;
    }

    @GetMapping("/{serviceId}/request-definition")
    public ApiResponse<RequestDefinitionVersionResponse> getPublished(@PathVariable UUID serviceId) {
        return ApiResponse.success(
                "Request definition retrieved",
                requestDefinitionService.getPublished(serviceId));
    }
}
