package mz.gov.boaneconecta.municipalservices.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.municipalservices.dto.MunicipalServiceRequest;
import mz.gov.boaneconecta.municipalservices.dto.MunicipalServiceResponse;
import mz.gov.boaneconecta.municipalservices.dto.ServiceFeeRequest;
import mz.gov.boaneconecta.municipalservices.dto.ServiceFeeResponse;
import mz.gov.boaneconecta.municipalservices.dto.ServiceRequirementRequest;
import mz.gov.boaneconecta.municipalservices.dto.ServiceRequirementResponse;
import mz.gov.boaneconecta.municipalservices.service.MunicipalServiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/services")
public class AdminMunicipalServiceController {
    private final MunicipalServiceService municipalServiceService;

    public AdminMunicipalServiceController(MunicipalServiceService municipalServiceService) {
        this.municipalServiceService = municipalServiceService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<MunicipalServiceResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.success(
                "Municipal services retrieved", municipalServiceService.listAdmin()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<MunicipalServiceResponse>> create(
            @Valid @RequestBody MunicipalServiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Municipal service created", municipalServiceService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<MunicipalServiceResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody MunicipalServiceRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Municipal service updated", municipalServiceService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        municipalServiceService.archive(id);
        return ResponseEntity.ok(ApiResponse.success("Municipal service archived", null));
    }

    @PostMapping("/{serviceId}/requirements")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<ServiceRequirementResponse>> addRequirement(
            @PathVariable UUID serviceId,
            @Valid @RequestBody ServiceRequirementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Service requirement created",
                        municipalServiceService.addRequirement(serviceId, request)));
    }

    @GetMapping("/{serviceId}/requirements")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<ServiceRequirementResponse>>> listRequirements(
            @PathVariable UUID serviceId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Service requirements retrieved",
                municipalServiceService.listRequirements(serviceId)));
    }

    @PutMapping("/{serviceId}/requirements/{requirementId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<ServiceRequirementResponse>> updateRequirement(
            @PathVariable UUID serviceId,
            @PathVariable UUID requirementId,
            @Valid @RequestBody ServiceRequirementRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Service requirement updated",
                municipalServiceService.updateRequirement(serviceId, requirementId, request)));
    }

    @DeleteMapping("/{serviceId}/requirements/{requirementId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRequirement(
            @PathVariable UUID serviceId,
            @PathVariable UUID requirementId) {
        municipalServiceService.deleteRequirement(serviceId, requirementId);
        return ResponseEntity.ok(ApiResponse.success("Service requirement deleted", null));
    }

    @PostMapping("/{serviceId}/fees")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<ServiceFeeResponse>> addFee(
            @PathVariable UUID serviceId,
            @Valid @RequestBody ServiceFeeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Service fee created", municipalServiceService.addFee(serviceId, request)));
    }

    @GetMapping("/{serviceId}/fees")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<ServiceFeeResponse>>> listFees(
            @PathVariable UUID serviceId) {
        return ResponseEntity.ok(ApiResponse.success(
                "Service fees retrieved", municipalServiceService.listFees(serviceId)));
    }

    @PutMapping("/{serviceId}/fees/{feeId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<ServiceFeeResponse>> updateFee(
            @PathVariable UUID serviceId,
            @PathVariable UUID feeId,
            @Valid @RequestBody ServiceFeeRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Service fee updated",
                municipalServiceService.updateFee(serviceId, feeId, request)));
    }

    @DeleteMapping("/{serviceId}/fees/{feeId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFee(
            @PathVariable UUID serviceId,
            @PathVariable UUID feeId) {
        municipalServiceService.deleteFee(serviceId, feeId);
        return ResponseEntity.ok(ApiResponse.success("Service fee deleted", null));
    }
}
