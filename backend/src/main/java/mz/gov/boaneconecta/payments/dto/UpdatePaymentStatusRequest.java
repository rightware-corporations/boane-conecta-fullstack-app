package mz.gov.boaneconecta.payments.dto;

import jakarta.validation.constraints.NotNull;
import mz.gov.boaneconecta.payments.entity.PaymentStatus;

public record UpdatePaymentStatusRequest(
        @NotNull PaymentStatus status) {
}
