package mz.gov.boaneconecta.reports.controller;

import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.reports.dto.DashboardSummaryResponse;
import mz.gov.boaneconecta.reports.dto.ModuleSummaryResponse;
import mz.gov.boaneconecta.reports.service.ReportsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/reports")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
public class AdminReportsController {
    private final ReportsService reportsService;

    public AdminReportsController(ReportsService reportsService) {
        this.reportsService = reportsService;
    }

    @GetMapping("/dashboard-summary")
    public ApiResponse<DashboardSummaryResponse> dashboardSummary() {
        return ApiResponse.success("Dashboard summary retrieved", reportsService.dashboardSummary());
    }

    @GetMapping("/requests-summary")
    public ApiResponse<ModuleSummaryResponse> requestsSummary() {
        return ApiResponse.success("Requests summary retrieved", reportsService.requestsSummary());
    }

    @GetMapping("/payments-summary")
    public ApiResponse<ModuleSummaryResponse> paymentsSummary() {
        return ApiResponse.success("Payments summary retrieved", reportsService.paymentsSummary());
    }

    @GetMapping("/complaints-summary")
    public ApiResponse<ModuleSummaryResponse> complaintsSummary() {
        return ApiResponse.success("Complaints summary retrieved", reportsService.complaintsSummary());
    }

    @GetMapping("/appointments-summary")
    public ApiResponse<ModuleSummaryResponse> appointmentsSummary() {
        return ApiResponse.success("Appointments summary retrieved", reportsService.appointmentsSummary());
    }
}
