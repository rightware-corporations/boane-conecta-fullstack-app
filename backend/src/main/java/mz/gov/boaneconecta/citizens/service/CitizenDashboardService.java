package mz.gov.boaneconecta.citizens.service;

import mz.gov.boaneconecta.appointments.entity.AppointmentStatus;
import mz.gov.boaneconecta.appointments.repository.AppointmentRepository;
import mz.gov.boaneconecta.citizens.dto.CitizenDashboardResponse;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.notifications.repository.NotificationRepository;
import mz.gov.boaneconecta.payments.entity.PaymentStatus;
import mz.gov.boaneconecta.payments.repository.PaymentRepository;
import mz.gov.boaneconecta.requests.entity.RequestStatus;
import mz.gov.boaneconecta.requests.repository.CitizenRequestRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class CitizenDashboardService {
    private static final Set<RequestStatus> OPEN_REQUEST_STATUSES = Set.of(
            RequestStatus.SUBMITTED,
            RequestStatus.UNDER_REVIEW,
            RequestStatus.WAITING_PAYMENT,
            RequestStatus.APPROVED
    );

    private static final Set<AppointmentStatus> UPCOMING_APPOINTMENT_STATUSES = Set.of(
            AppointmentStatus.SCHEDULED,
            AppointmentStatus.CONFIRMED
    );

    private final UserRepository userRepository;
    private final CitizenRequestRepository requestRepository;
    private final PaymentRepository paymentRepository;
    private final AppointmentRepository appointmentRepository;
    private final NotificationRepository notificationRepository;

    public CitizenDashboardService(
            UserRepository userRepository,
            CitizenRequestRepository requestRepository,
            PaymentRepository paymentRepository,
            AppointmentRepository appointmentRepository,
            NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.requestRepository = requestRepository;
        this.paymentRepository = paymentRepository;
        this.appointmentRepository = appointmentRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public CitizenDashboardResponse getDashboard(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long pendingRequests = requestRepository.findByCitizenUserOrderByCreatedAtDesc(user).stream()
                .filter(request -> OPEN_REQUEST_STATUSES.contains(request.getStatus()))
                .count();

        long pendingPayments = paymentRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .filter(payment -> payment.getStatus() == PaymentStatus.PENDING)
                .count();

        long upcomingAppointments = appointmentRepository.findByCitizenUserOrderByCreatedAtDesc(user).stream()
                .filter(appointment -> UPCOMING_APPOINTMENT_STATUSES.contains(appointment.getStatus()))
                .count();

        long unreadNotifications = notificationRepository.countByUserAndReadAtIsNull(user);

        return new CitizenDashboardResponse(
                profile(user),
                new CitizenDashboardResponse.StatsResponse(
                        0,
                        pendingRequests,
                        pendingPayments,
                        upcomingAppointments,
                        unreadNotifications
                ),
                List.of(),
                List.of(),
                List.of(),
                List.of()
        );
    }

    private CitizenDashboardResponse.ProfileResponse profile(User user) {
        LocalDateTime createdAt = user.getCreatedAt() == null ? LocalDateTime.now() : user.getCreatedAt();
        LocalDateTime updatedAt = user.getUpdatedAt() == null ? createdAt : user.getUpdatedAt();

        return new CitizenDashboardResponse.ProfileResponse(
                user.getId(),
                user.getId(),
                user.getFullName(),
                "municipe",
                user.getPhone(),
                null,
                null,
                null,
                null,
                null,
                null,
                Boolean.TRUE.equals(user.getEmailVerified()),
                true,
                false,
                "email",
                createdAt,
                updatedAt
        );
    }
}
