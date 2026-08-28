package mz.gov.boaneconecta.citizens.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.citizens.dto.CitizenProfileResponse;
import mz.gov.boaneconecta.citizens.dto.UpdateCitizenProfileRequest;
import mz.gov.boaneconecta.citizens.service.CitizenProfileService;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/citizen/me")
@PreAuthorize("hasRole('CITIZEN')")
public class CitizenProfileController {
    private final CitizenProfileService service;
    public CitizenProfileController(CitizenProfileService service) { this.service = service; }
    @GetMapping public ApiResponse<CitizenProfileResponse> get(@AuthenticationPrincipal UserDetailsImpl principal) { return ApiResponse.success("Citizen profile retrieved", service.get(principal.getId())); }
    @PatchMapping public ApiResponse<CitizenProfileResponse> update(@AuthenticationPrincipal UserDetailsImpl principal, @Valid @RequestBody UpdateCitizenProfileRequest request) { return ApiResponse.success("Citizen profile updated", service.update(principal.getId(), request)); }
}
