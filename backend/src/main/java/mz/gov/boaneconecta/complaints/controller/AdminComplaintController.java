package mz.gov.boaneconecta.complaints.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.complaints.dto.AssignComplaintRequest;
import mz.gov.boaneconecta.complaints.dto.ComplaintResponse;
import mz.gov.boaneconecta.complaints.dto.UpdateComplaintStatusRequest;
import mz.gov.boaneconecta.complaints.entity.ComplaintStatus;
import mz.gov.boaneconecta.complaints.service.ComplaintService;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
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
@RequestMapping("/api/v1/admin/complaints")
public class AdminComplaintController {
    private final ComplaintService complaintService;

    public AdminComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ApiResponse<List<ComplaintResponse>> list(@RequestParam(required = false) ComplaintStatus status) {
        return ApiResponse.success("Complaints retrieved", complaintService.listAdmin(status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ApiResponse<ComplaintResponse> get(@PathVariable UUID id) {
        return ApiResponse.success("Complaint retrieved", complaintService.getAdmin(id));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER')")
    public ApiResponse<ComplaintResponse> assign(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id,
            @Valid @RequestBody AssignComplaintRequest request) {
        return ApiResponse.success("Complaint assigned", complaintService.assign(id, request, principal.getId()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ApiResponse<ComplaintResponse> updateStatus(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateComplaintStatusRequest request) {
        return ApiResponse.success("Complaint status updated", complaintService.updateStatus(id, request, principal.getId()));
    }
}
