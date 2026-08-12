package mz.gov.boaneconecta.complaints.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.complaints.dto.ComplaintResponse;
import mz.gov.boaneconecta.complaints.dto.CreateComplaintRequest;
import mz.gov.boaneconecta.complaints.service.ComplaintService;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/citizen/complaints")
public class CitizenComplaintController {
    private final ComplaintService complaintService;

    public CitizenComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ComplaintResponse>> create(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody CreateComplaintRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Complaint submitted", complaintService.createCitizen(principal.getId(), request)));
    }

    @GetMapping
    public ApiResponse<List<ComplaintResponse>> list(@AuthenticationPrincipal UserDetailsImpl principal) {
        return ApiResponse.success("Complaints retrieved", complaintService.listCitizen(principal.getId()));
    }

    @GetMapping("/{id}")
    public ApiResponse<ComplaintResponse> get(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id) {
        return ApiResponse.success("Complaint retrieved", complaintService.getCitizen(principal.getId(), id));
    }
}
