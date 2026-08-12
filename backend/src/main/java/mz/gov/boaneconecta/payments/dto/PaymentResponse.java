package mz.gov.boaneconecta.payments.dto;

import mz.gov.boaneconecta.payments.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record PaymentResponse(
        UUID id,
        String paymentNumber,
        UUID userId,
        String userFullName,
        UUID requestId,
        String requestNumber,
        BigDecimal amount,
        String currency,
        String method,
        PaymentStatus status,
        LocalDate dueDate,
        LocalDateTime paidAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
