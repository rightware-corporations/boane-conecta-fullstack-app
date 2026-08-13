package mz.gov.boaneconecta.reports.dto;

import java.math.BigDecimal;
import java.util.Map;

public record ModuleSummaryResponse(
        long total,
        Map<String, Long> byStatus,
        BigDecimal confirmedAmount
) {
    public ModuleSummaryResponse(long total, Map<String, Long> byStatus) {
        this(total, byStatus, null);
    }
}
