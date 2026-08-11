package mz.gov.boaneconecta.municipalservices.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ServiceFeeResponse(
        UUID id,
        UUID serviceId,
        String title,
        BigDecimal amount,
        String currency,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
