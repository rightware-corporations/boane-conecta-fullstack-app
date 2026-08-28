package mz.gov.boaneconecta.citizens.service;

import mz.gov.boaneconecta.appointments.entity.*;
import mz.gov.boaneconecta.appointments.repository.AppointmentRepository;
import mz.gov.boaneconecta.citizens.dto.CitizenDashboardResponse;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.notifications.entity.Notification;
import mz.gov.boaneconecta.notifications.repository.NotificationRepository;
import mz.gov.boaneconecta.payments.entity.*;
import mz.gov.boaneconecta.payments.repository.PaymentRepository;
import mz.gov.boaneconecta.requests.draft.entity.*;
import mz.gov.boaneconecta.requests.draft.repository.RequestDraftRepository;
import mz.gov.boaneconecta.requests.entity.*;
import mz.gov.boaneconecta.requests.repository.CitizenRequestRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;

@Service
public class CitizenDashboardService {
    private static final Set<RequestStatus> ACTIVE_REQUESTS = Set.of(
            RequestStatus.SUBMITTED, RequestStatus.UNDER_REVIEW, RequestStatus.WAITING_PAYMENT, RequestStatus.APPROVED);
    private static final List<RequestDraftStatus> ACTIVE_DRAFTS = List.of(
            RequestDraftStatus.IN_PROGRESS, RequestDraftStatus.READY_FOR_REVIEW);
    private final UserRepository users;
    private final CitizenRequestRepository requests;
    private final RequestDraftRepository drafts;
    private final PaymentRepository payments;
    private final AppointmentRepository appointments;
    private final NotificationRepository notifications;
    private final Clock clock;

    public CitizenDashboardService(UserRepository users, CitizenRequestRepository requests,
            RequestDraftRepository drafts, PaymentRepository payments,
            AppointmentRepository appointments, NotificationRepository notifications, Clock clock) {
        this.users = users; this.requests = requests; this.drafts = drafts; this.payments = payments;
        this.appointments = appointments; this.notifications = notifications; this.clock = clock;
    }

    @Transactional(readOnly = true)
    public CitizenDashboardResponse getDashboard(UUID userId) {
        User user = users.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<RequestDraft> activeDrafts = drafts.findByCitizenUserAndStatusInOrderByUpdatedAtDesc(user, ACTIVE_DRAFTS)
                .stream().filter(draft -> draft.isEditable(Instant.now())).limit(3).toList();
        List<CitizenRequest> activeRequests = requests.findByCitizenUserOrderByCreatedAtDesc(user).stream()
                .filter(request -> ACTIVE_REQUESTS.contains(request.getStatus())).limit(5).toList();
        List<Payment> pendingPayments = payments.findByUserOrderByCreatedAtDesc(user).stream()
                .filter(payment -> payment.getStatus() == PaymentStatus.PENDING).limit(3).toList();
        Appointment nextAppointment = appointments.findByCitizenUserOrderByCreatedAtDesc(user).stream()
                .filter(item -> item.getStatus() == AppointmentStatus.SCHEDULED || item.getStatus() == AppointmentStatus.CONFIRMED)
                .filter(item -> item.getSlot() != null && !item.getSlot().getStartTime().isBefore(clock.instant()))
                .min(Comparator.comparing(item -> item.getSlot().getStartTime())).orElse(null);
        List<Notification> recentNotifications = notifications.findByUserOrderByCreatedAtDesc(user).stream().limit(5).toList();

        List<CitizenDashboardResponse.ActionRequiredItem> actions = new ArrayList<>();
        pendingPayments.forEach(payment -> actions.add(new CitizenDashboardResponse.ActionRequiredItem(
                "PAYMENT", "Pagamento pendente", "Existe uma obrigação associada ao seu pedido.",
                "/municipe/pagamentos", payment.getId())));
        activeDrafts.forEach(draft -> actions.add(new CitizenDashboardResponse.ActionRequiredItem(
                "DRAFT", "Continue o seu pedido", draft.getServiceVersion().getTitle(),
                "/municipe/pedidos/rascunhos/" + draft.getId(), draft.getId())));

        return new CitizenDashboardResponse(
                new CitizenDashboardResponse.ProfileSummary(user.getId(), user.getFullName(), user.getEmail(), user.getPhone()),
                List.copyOf(actions), activeDrafts.stream().map(this::draft).toList(),
                activeRequests.stream().map(this::request).toList(), appointment(nextAppointment),
                pendingPayments.stream().map(this::payment).toList(), recentNotifications.stream().map(this::notification).toList(),
                notifications.countByUserAndReadAtIsNull(user));
    }

    private CitizenDashboardResponse.DraftSummary draft(RequestDraft draft) {
        return new CitizenDashboardResponse.DraftSummary(draft.getId(), draft.getService().getId(),
                draft.getServiceVersion().getTitle(), draft.getCurrentStepKey(), draft.getVersion(),
                draft.getLastSavedAt(), draft.getExpiresAt());
    }
    private CitizenDashboardResponse.RequestSummary request(CitizenRequest request) {
        return new CitizenDashboardResponse.RequestSummary(request.getId(), request.getRequestNumber(),
                request.getService() == null ? null : request.getService().getTitle(), request.getTitle(),
                request.getStatus().name(), label(request.getStatus()), nextAction(request.getStatus()),
                request.getSubmittedAt(), request.getUpdatedAt());
    }
    private CitizenDashboardResponse.PaymentSummary payment(Payment payment) {
        return new CitizenDashboardResponse.PaymentSummary(payment.getId(), payment.getPaymentNumber(), payment.getAmount(),
                payment.getCurrency(), payment.getDueDate(), payment.getRequest() == null ? null : payment.getRequest().getId());
    }
    private CitizenDashboardResponse.AppointmentSummary appointment(Appointment appointment) {
        if (appointment == null) return null;
        var slot = appointment.getSlot();
        return new CitizenDashboardResponse.AppointmentSummary(appointment.getId(), appointment.getAppointmentNumber(),
                appointment.getStatus().name(), slot.getStartTime(),
                slot.getDepartment() == null ? null : slot.getDepartment().getName());
    }
    private CitizenDashboardResponse.NotificationSummary notification(Notification item) {
        return new CitizenDashboardResponse.NotificationSummary(item.getId(), item.getTitle(), item.getMessage(),
                item.getType(), item.getReadAt() != null, item.getCreatedAt());
    }
    private String label(RequestStatus status) {
        return switch (status) {
            case DRAFT -> "Rascunho"; case SUBMITTED -> "Submetido"; case UNDER_REVIEW -> "Em análise";
            case WAITING_PAYMENT -> "A aguardar pagamento"; case APPROVED -> "Aprovado";
            case REJECTED -> "Rejeitado"; case CANCELLED -> "Cancelado"; case COMPLETED -> "Concluído";
        };
    }
    private String nextAction(RequestStatus status) {
        return switch (status) {
            case WAITING_PAYMENT -> "Efetue o pagamento indicado.";
            case SUBMITTED, UNDER_REVIEW -> "Aguarde a análise municipal.";
            case APPROVED, COMPLETED -> "Nenhuma ação necessária.";
            case REJECTED -> "Consulte a comunicação oficial.";
            case CANCELLED -> "Pedido cancelado.";
            case DRAFT -> "Conclua o pedido.";
        };
    }
}
