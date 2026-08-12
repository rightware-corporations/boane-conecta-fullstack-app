package mz.gov.boaneconecta.payments.service;

import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.payments.dto.CreatePaymentRequest;
import mz.gov.boaneconecta.payments.dto.PaymentResponse;
import mz.gov.boaneconecta.payments.dto.UpdatePaymentStatusRequest;
import mz.gov.boaneconecta.payments.entity.Payment;
import mz.gov.boaneconecta.payments.entity.PaymentStatus;
import mz.gov.boaneconecta.payments.repository.PaymentRepository;
import mz.gov.boaneconecta.requests.entity.CitizenRequest;
import mz.gov.boaneconecta.requests.repository.CitizenRequestRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class PaymentService {
    private static final DateTimeFormatter PAYMENT_DATE_FORMAT = DateTimeFormatter.BASIC_ISO_DATE;

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final CitizenRequestRepository citizenRequestRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            UserRepository userRepository,
            CitizenRequestRepository citizenRequestRepository) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.citizenRequestRepository = citizenRequestRepository;
    }

    @Transactional
    public PaymentResponse createCitizenPayment(UUID userId, CreatePaymentRequest request) {
        User user = requireUser(userId);
        CitizenRequest citizenRequest = resolveCitizenRequest(user, request.requestId());
        BigDecimal amount = requirePositiveAmount(request.amount());

        Payment payment = Payment.builder()
                .paymentNumber(generatePaymentNumber())
                .user(user)
                .request(citizenRequest)
                .amount(amount)
                .currency(cleanCurrency(request.currency()))
                .method(clean(request.method()))
                .status(PaymentStatus.PENDING)
                .dueDate(request.dueDate())
                .build();

        return toResponse(paymentRepository.saveAndFlush(payment));
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> listCitizenPayments(UUID userId) {
        User user = requireUser(userId);
        return paymentRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PaymentResponse getCitizenPayment(UUID userId, UUID paymentId) {
        User user = requireUser(userId);
        Payment payment = paymentRepository.findByIdAndUser(paymentId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        return toResponse(payment);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> listAdminPayments(PaymentStatus status) {
        List<Payment> payments = status == null
                ? paymentRepository.findAllByOrderByCreatedAtDesc()
                : paymentRepository.findByStatusOrderByCreatedAtDesc(status);
        return payments.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PaymentResponse getAdminPayment(UUID paymentId) {
        return toResponse(requirePayment(paymentId));
    }

    @Transactional
    public PaymentResponse updateStatus(UUID paymentId, UpdatePaymentStatusRequest request) {
        Payment payment = requirePayment(paymentId);
        PaymentStatus status = request.status();
        payment.setStatus(status);
        if (status == PaymentStatus.CONFIRMED) {
            payment.setPaidAt(LocalDateTime.now());
        } else if (status == PaymentStatus.PENDING || status == PaymentStatus.REJECTED || status == PaymentStatus.CANCELLED) {
            payment.setPaidAt(null);
        }
        return toResponse(paymentRepository.saveAndFlush(payment));
    }

    private CitizenRequest resolveCitizenRequest(User user, UUID requestId) {
        if (requestId == null) {
            return null;
        }
        return citizenRequestRepository.findByIdAndCitizenUser(requestId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Citizen request not found"));
    }

    private Payment requirePayment(UUID paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private BigDecimal requirePositiveAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be positive");
        }
        return amount;
    }

    private PaymentResponse toResponse(Payment payment) {
        User user = payment.getUser();
        CitizenRequest request = payment.getRequest();
        return new PaymentResponse(
                payment.getId(),
                payment.getPaymentNumber(),
                user == null ? null : user.getId(),
                user == null ? null : user.getFullName(),
                request == null ? null : request.getId(),
                request == null ? null : request.getRequestNumber(),
                payment.getAmount(),
                payment.getCurrency(),
                payment.getMethod(),
                payment.getStatus(),
                payment.getDueDate(),
                payment.getPaidAt(),
                payment.getCreatedAt(),
                payment.getUpdatedAt());
    }

    private String generatePaymentNumber() {
        String prefix = "PAY-" + LocalDate.now().format(PAYMENT_DATE_FORMAT) + "-";
        for (int attempt = 0; attempt < 20; attempt++) {
            String candidate = prefix + ThreadLocalRandom.current().nextInt(100000, 999999);
            if (!paymentRepository.existsByPaymentNumber(candidate)) {
                return candidate;
            }
        }
        throw new IllegalStateException("Could not generate unique payment number");
    }

    private String cleanCurrency(String value) {
        String cleaned = clean(value);
        return cleaned == null ? "MZN" : cleaned.toUpperCase();
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
