package mz.gov.boaneconecta.reports.service;

import mz.gov.boaneconecta.appointments.entity.Appointment;
import mz.gov.boaneconecta.appointments.entity.AppointmentStatus;
import mz.gov.boaneconecta.appointments.repository.AppointmentRepository;
import mz.gov.boaneconecta.complaints.entity.Complaint;
import mz.gov.boaneconecta.complaints.entity.ComplaintStatus;
import mz.gov.boaneconecta.complaints.repository.ComplaintRepository;
import mz.gov.boaneconecta.payments.entity.Payment;
import mz.gov.boaneconecta.payments.entity.PaymentStatus;
import mz.gov.boaneconecta.payments.repository.PaymentRepository;
import mz.gov.boaneconecta.reports.dto.DashboardSummaryResponse;
import mz.gov.boaneconecta.reports.dto.ModuleSummaryResponse;
import mz.gov.boaneconecta.requests.entity.CitizenRequest;
import mz.gov.boaneconecta.requests.entity.RequestStatus;
import mz.gov.boaneconecta.requests.repository.CitizenRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
public class ReportsService {
    private final CitizenRequestRepository requestRepository;
    private final ComplaintRepository complaintRepository;
    private final PaymentRepository paymentRepository;
    private final AppointmentRepository appointmentRepository;

    public ReportsService(
            CitizenRequestRepository requestRepository,
            ComplaintRepository complaintRepository,
            PaymentRepository paymentRepository,
            AppointmentRepository appointmentRepository) {
        this.requestRepository = requestRepository;
        this.complaintRepository = complaintRepository;
        this.paymentRepository = paymentRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse dashboardSummary() {
        return new DashboardSummaryResponse(
                requestsSummary(),
                complaintsSummary(),
                paymentsSummary(),
                appointmentsSummary(),
                LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    public ModuleSummaryResponse requestsSummary() {
        List<CitizenRequest> requests = requestRepository.findAll();
        return new ModuleSummaryResponse(requests.size(), countByEnumStatus(RequestStatus.values(), requests, CitizenRequest::getStatus));
    }

    @Transactional(readOnly = true)
    public ModuleSummaryResponse complaintsSummary() {
        List<Complaint> complaints = complaintRepository.findAll();
        return new ModuleSummaryResponse(complaints.size(), countByEnumStatus(ComplaintStatus.values(), complaints, Complaint::getStatus));
    }

    @Transactional(readOnly = true)
    public ModuleSummaryResponse paymentsSummary() {
        List<Payment> payments = paymentRepository.findAll();
        BigDecimal confirmedAmount = payments.stream()
                .filter(payment -> payment.getStatus() == PaymentStatus.CONFIRMED)
                .map(Payment::getAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new ModuleSummaryResponse(
                payments.size(),
                countByEnumStatus(PaymentStatus.values(), payments, Payment::getStatus),
                confirmedAmount);
    }

    @Transactional(readOnly = true)
    public ModuleSummaryResponse appointmentsSummary() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return new ModuleSummaryResponse(appointments.size(), countByEnumStatus(AppointmentStatus.values(), appointments, Appointment::getStatus));
    }

    private <T, E extends Enum<E>> Map<String, Long> countByEnumStatus(E[] enumValues, List<T> items, Function<T, E> statusExtractor) {
        Map<String, Long> result = new LinkedHashMap<>();
        Arrays.stream(enumValues).forEach(status -> result.put(status.name(), 0L));
        for (T item : items) {
            E status = statusExtractor.apply(item);
            if (status != null) {
                result.put(status.name(), result.getOrDefault(status.name(), 0L) + 1L);
            }
        }
        return result;
    }
}
