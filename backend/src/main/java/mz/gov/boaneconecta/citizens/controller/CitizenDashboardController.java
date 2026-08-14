package mz.gov.boaneconecta.citizens.controller;

import mz.gov.boaneconecta.citizens.dto.CitizenDashboardResponse;
import mz.gov.boaneconecta.citizens.service.CitizenDashboardService;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/citizen/dashboard")
@PreAuthorize("hasRole('CITIZEN')")
public class CitizenDashboardController {
    private final CitizenDashboardService citizenDashboardService;

    public CitizenDashboardController(CitizenDashboardService citizenDashboardService) {
        this.citizenDashboardService = citizenDashboardService;
    }

    @GetMapping
    public ApiResponse<CitizenDashboardResponse> getDashboard(
            @AuthenticationPrincipal UserDetailsImpl principal) {
        return ApiResponse.success(
                "Citizen dashboard retrieved",
                citizenDashboardService.getDashboard(principal.getId())
        );
    }
}
