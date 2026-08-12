package mz.gov.boaneconecta.requests.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import mz.gov.boaneconecta.requests.dto.CitizenRequestResponse;
import mz.gov.boaneconecta.requests.dto.CreateCitizenRequestRequest;
import mz.gov.boaneconecta.requests.service.CitizenRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api/v1/citizen/requests")
@PreAuthorize("hasRole('CITIZEN')")
public class CitizenRequestController {
    private final CitizenRequestService citizenRequestService;

    public CitizenRequestController(CitizenRequestService citizenRequestService) {
        this.citizenRequestService = citizenRequestService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CitizenRequestResponse>> create(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody CreateCitizenRequestRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Citizen request submitted",
                        citizenRequestService.create(principal.getId(), request)));
    }

    @GetMapping
    public ApiResponse<List<CitizenRequestResponse>> list(
            @AuthenticationPrincipal UserDetailsImpl principal) {
        return ApiResponse.success(
                "Citizen requests retrieved",
                citizenRequestService.listCitizen(principal.getId()));
    }

    @GetMapping("/{id}")
    public ApiResponse<CitizenRequestResponse> get(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id) {
        return ApiResponse.success(
                "Citizen request retrieved",
                citizenRequestService.getCitizen(principal.getId(), id));
    }
}
