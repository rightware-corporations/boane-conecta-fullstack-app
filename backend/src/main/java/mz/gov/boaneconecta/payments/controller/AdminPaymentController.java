package mz.gov.boaneconecta.payments.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.payments.dto.PaymentResponse;
import mz.gov.boaneconecta.payments.dto.UpdatePaymentStatusRequest;
import mz.gov.boaneconecta.payments.entity.PaymentStatus;
import mz.gov.boaneconecta.payments.service.PaymentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/payments")
public class AdminPaymentController {
    private final PaymentService paymentService;

    public AdminPaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ApiResponse<List<PaymentResponse>> list(@RequestParam(required = false) PaymentStatus status) {
        return ApiResponse.success("Payments retrieved", paymentService.listAdminPayments(status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ApiResponse<PaymentResponse> get(@PathVariable UUID id) {
        return ApiResponse.success("Payment retrieved", paymentService.getAdminPayment(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER')")
    public ApiResponse<PaymentResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePaymentStatusRequest request) {
        return ApiResponse.success("Payment status updated", paymentService.updateStatus(id, request));
    }
}
