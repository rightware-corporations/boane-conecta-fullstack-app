package mz.gov.boaneconecta.payments.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import mz.gov.boaneconecta.payments.dto.CreatePaymentRequest;
import mz.gov.boaneconecta.payments.dto.PaymentResponse;
import mz.gov.boaneconecta.payments.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/citizen/payments")
public class CitizenPaymentController {
    private final PaymentService paymentService;

    public CitizenPaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> create(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody CreatePaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment created", paymentService.createCitizenPayment(principal.getId(), request)));
    }

    @GetMapping
    public ApiResponse<List<PaymentResponse>> list(@AuthenticationPrincipal UserDetailsImpl principal) {
        return ApiResponse.success("Payments retrieved", paymentService.listCitizenPayments(principal.getId()));
    }

    @GetMapping("/{id}")
    public ApiResponse<PaymentResponse> get(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id) {
        return ApiResponse.success("Payment retrieved", paymentService.getCitizenPayment(principal.getId(), id));
    }
}
