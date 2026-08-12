package mz.gov.boaneconecta.payments.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreatePaymentRequest(
        UUID requestId,
        @DecimalMin(value = "0.01") BigDecimal amount,
        @Size(max = 10) String currency,
        @Size(max = 50) String method,
        LocalDate dueDate) {
}
