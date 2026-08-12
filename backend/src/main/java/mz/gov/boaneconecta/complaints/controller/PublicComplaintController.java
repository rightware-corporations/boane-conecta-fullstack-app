package mz.gov.boaneconecta.complaints.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.complaints.dto.ComplaintResponse;
import mz.gov.boaneconecta.complaints.dto.CreateComplaintRequest;
import mz.gov.boaneconecta.complaints.service.ComplaintService;
import mz.gov.boaneconecta.core.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/complaints")
public class PublicComplaintController {
    private final ComplaintService complaintService;

    public PublicComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ComplaintResponse>> create(@Valid @RequestBody CreateComplaintRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Complaint submitted", complaintService.createPublic(request)));
    }
}
