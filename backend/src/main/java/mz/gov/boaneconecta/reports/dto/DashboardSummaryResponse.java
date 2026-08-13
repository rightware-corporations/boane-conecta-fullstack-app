package mz.gov.boaneconecta.reports.dto;

import java.time.LocalDateTime;

public record DashboardSummaryResponse(
        ModuleSummaryResponse requests,
        ModuleSummaryResponse complaints,
        ModuleSummaryResponse payments,
        ModuleSummaryResponse appointments,
        LocalDateTime generatedAt
) {
}
