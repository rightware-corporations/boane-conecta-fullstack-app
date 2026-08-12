package mz.gov.boaneconecta.requests.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import mz.gov.boaneconecta.requests.dto.AssignRequestRequest;
import mz.gov.boaneconecta.requests.dto.CitizenRequestResponse;
import mz.gov.boaneconecta.requests.dto.UpdateRequestStatusRequest;
import mz.gov.boaneconecta.requests.entity.RequestStatus;
import mz.gov.boaneconecta.requests.service.CitizenRequestService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
@RequestMapping("/api/v1/admin/requests")
public class AdminRequestController {
    private final CitizenRequestService citizenRequestService;

    public AdminRequestController(CitizenRequestService citizenRequestService) {
        this.citizenRequestService = citizenRequestService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ApiResponse<List<CitizenRequestResponse>> list(
            @RequestParam(required = false) RequestStatus status) {
        return ApiResponse.success(
                "Citizen requests retrieved",
                citizenRequestService.listAdmin(status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ApiResponse<CitizenRequestResponse> get(@PathVariable UUID id) {
        return ApiResponse.success(
                "Citizen request retrieved",
                citizenRequestService.getAdmin(id));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER')")
    public ApiResponse<CitizenRequestResponse> assign(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id,
            @Valid @RequestBody AssignRequestRequest request) {
        return ApiResponse.success(
                "Citizen request assigned",
                citizenRequestService.assign(id, request, principal.getId()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ApiResponse<CitizenRequestResponse> updateStatus(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRequestStatusRequest request) {
        return ApiResponse.success(
                "Citizen request status updated",
                citizenRequestService.updateStatus(id, request, principal.getId()));
    }
}
