package mz.gov.boaneconecta.appointments.service;

import mz.gov.boaneconecta.appointments.dto.*;
import mz.gov.boaneconecta.appointments.entity.*;
import mz.gov.boaneconecta.appointments.repository.AppointmentRepository;
import mz.gov.boaneconecta.core.exception.*;
import mz.gov.boaneconecta.queue.entity.*;
import mz.gov.boaneconecta.queue.repository.*;
import mz.gov.boaneconecta.queue.service.QueueSequenceAllocator;
import mz.gov.boaneconecta.requests.submission.entity.*;
import mz.gov.boaneconecta.requests.submission.repository.IdempotencyRecordRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.*;
import java.util.*;

@Service
public class AppointmentCheckInService {
    private static final String CITIZEN_OPERATION = "APPOINTMENT_CHECK_IN";
    private static final String ASSISTED_OPERATION = "APPOINTMENT_ASSISTED_CHECK_IN";
    private final AppointmentRepository appointments;
    private final MunicipalQueueRepository queues;
    private final QueueTicketRepository tickets;
    private final QueueSequenceAllocator sequences;
    private final IdempotencyRecordRepository idempotency;
    private final UserRepository users;
    private final Clock clock;
    private final Duration opensBefore;
    private final Duration lateTolerance;
    private final int maxFailedAttempts;

    public AppointmentCheckInService(AppointmentRepository appointments, MunicipalQueueRepository queues,
            QueueTicketRepository tickets, QueueSequenceAllocator sequences,
            IdempotencyRecordRepository idempotency, UserRepository users, Clock clock,
            @Value("${appointments.check-in.opens-before:PT30M}") Duration opensBefore,
            @Value("${appointments.check-in.late-tolerance:PT15M}") Duration lateTolerance,
            @Value("${appointments.check-in.max-failed-attempts:5}") int maxFailedAttempts) {
        if (opensBefore.isNegative() || lateTolerance.isNegative() || maxFailedAttempts < 1)
            throw new IllegalArgumentException("Invalid appointment check-in policy");
        this.appointments = appointments; this.queues = queues; this.tickets = tickets;
        this.sequences = sequences; this.idempotency = idempotency; this.users = users; this.clock = clock;
        this.opensBefore = opensBefore; this.lateTolerance = lateTolerance; this.maxFailedAttempts = maxFailedAttempts;
    }

    @Transactional(noRollbackFor = InvalidCheckInCredentialException.class)
    public CheckInResponse citizenCheckIn(UUID citizenId, UUID appointmentId, CheckInMethod method,
            String credential, String idempotencyKey) {
        if (method == CheckInMethod.ASSISTED_STAFF) throw new IllegalArgumentException("CHECK_IN_METHOD_NOT_ALLOWED");
        User citizen = requireUser(citizenId);
        return execute(citizen, citizen, appointmentId, method, credential, idempotencyKey, CITIZEN_OPERATION, true);
    }

    @Transactional
    public CheckInResponse assistedCheckIn(UUID staffId, UUID appointmentId, String idempotencyKey) {
        User staff = requireUser(staffId);
        Appointment appointment = appointments.findByIdForUpdate(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("APPOINTMENT_NOT_FOUND"));
        return execute(staff, appointment.getCitizenUser(), appointmentId, CheckInMethod.ASSISTED_STAFF,
                null, idempotencyKey, ASSISTED_OPERATION, false);
    }

    private CheckInResponse execute(User actor, User citizen, UUID appointmentId, CheckInMethod method,
            String credential, String key, String operation, boolean owned) {
        validateKey(key);
        String fingerprint = hash(appointmentId + ":" + method);
        var previous = idempotency.findByCitizenUserAndOperationAndKeyHash(actor, operation, hash(key.trim()));
        if (previous.isPresent()) return replay(previous.get(), fingerprint, citizen);
        Appointment appointment = owned
                ? appointments.findOwnedByIdForUpdate(appointmentId, citizen)
                    .orElseThrow(() -> new ResourceNotFoundException("APPOINTMENT_NOT_FOUND"))
                : appointments.findByIdForUpdate(appointmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("APPOINTMENT_NOT_FOUND"));
        if (appointment.getStatus() == AppointmentStatus.CHECKED_IN) {
            QueueTicket existing = tickets.findByAppointmentAndCitizenUser(appointment, citizen)
                    .orElseThrow(() -> new IllegalStateException("Checked-in appointment has no queue ticket"));
            return response(appointment, existing, true);
        }
        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) throw new ResourceConflictException("APPOINTMENT_CANNOT_BE_CHECKED_IN");
        validateWindow(appointment);
        if (owned) validateCredential(appointment, credential);

        IdempotencyRecord claim = idempotency.saveAndFlush(IdempotencyRecord.builder().id(UUID.randomUUID())
                .citizenUser(actor).operation(operation).keyHash(hash(key.trim())).requestFingerprint(fingerprint)
                .state(IdempotencyState.IN_PROGRESS).expiresAt(clock.instant().plus(Duration.ofDays(7))).build());
        MunicipalQueue queue = selectQueue(appointment);
        LocalDate businessDate = LocalDate.now(clock);
        int sequence = sequences.next(queue.getId(), businessDate);
        QueueTicket ticket = tickets.saveAndFlush(QueueTicket.builder().ticketNumber("A%03d".formatted(sequence))
                .queue(queue).businessDate(businessDate).citizenUser(citizen).appointment(appointment)
                .department(appointment.getSlot().getDepartment()).sequenceNumber(sequence)
                .priorityClass(QueuePriorityClass.NORMAL).status(QueueTicketStatus.WAITING).build());
        Instant now = clock.instant();
        appointment.setStatus(AppointmentStatus.CHECKED_IN); appointment.setCheckedInAt(now);
        appointment.setCheckInCodeConsumedAt(now); appointment.setCheckInMethod(method.name());
        appointment.setCheckInActorUser(actor); appointments.saveAndFlush(appointment);
        claim.complete(ticket.getId(), ticket.getTicketNumber(), now); idempotency.save(claim);
        return response(appointment, ticket, false);
    }

    private void validateWindow(Appointment appointment) {
        Instant now = clock.instant(); Instant starts = appointment.getSlot().getStartTime();
        if (now.isBefore(starts.minus(opensBefore))) throw new ResourceConflictException("APPOINTMENT_CHECK_IN_NOT_OPEN");
        if (now.isAfter(starts.plus(lateTolerance))) throw new ResourceConflictException("APPOINTMENT_CHECK_IN_WINDOW_CLOSED");
    }
    private void validateCredential(Appointment appointment, String credential) {
        if (appointment.getCheckInFailedAttempts() >= maxFailedAttempts) throw new ResourceConflictException("CHECK_IN_CREDENTIAL_LOCKED");
        boolean expired = appointment.getCheckInCodeExpiresAt() == null || !appointment.getCheckInCodeExpiresAt().isAfter(clock.instant());
        boolean consumed = appointment.getCheckInCodeConsumedAt() != null;
        boolean matches = credential != null && appointment.getCheckInCodeHash() != null
                && MessageDigest.isEqual(hash(credential).getBytes(StandardCharsets.UTF_8),
                        appointment.getCheckInCodeHash().getBytes(StandardCharsets.UTF_8));
        if (expired || consumed || !matches) {
            appointment.setCheckInFailedAttempts(appointment.getCheckInFailedAttempts() + 1);
            appointments.saveAndFlush(appointment);
            throw new InvalidCheckInCredentialException(consumed ? "CHECK_IN_CREDENTIAL_CONSUMED"
                    : expired ? "CHECK_IN_CREDENTIAL_EXPIRED" : "CHECK_IN_CREDENTIAL_INVALID");
        }
    }
    private MunicipalQueue selectQueue(Appointment appointment) {
        var slot = appointment.getSlot();
        if (slot.getService() == null) throw new ResourceConflictException("APPOINTMENT_QUEUE_NOT_CONFIGURED");
        List<MunicipalQueue> matches = queues.findOpenForUpdate(slot.getService(), slot.getLocationCode(), QueueStatus.OPEN);
        if (matches.isEmpty()) throw new ResourceConflictException("APPOINTMENT_QUEUE_NOT_OPEN");
        if (matches.size() > 1) throw new IllegalStateException("Multiple open queues match appointment service and location");
        return matches.getFirst();
    }
    private CheckInResponse replay(IdempotencyRecord record, String fingerprint, User citizen) {
        if (!MessageDigest.isEqual(record.getRequestFingerprint().getBytes(StandardCharsets.UTF_8), fingerprint.getBytes(StandardCharsets.UTF_8)))
            throw new ResourceConflictException("IDEMPOTENCY_KEY_REUSED");
        if (record.getState() != IdempotencyState.COMPLETED) throw new ResourceConflictException("CHECK_IN_IN_PROGRESS");
        QueueTicket ticket = tickets.findByIdAndCitizenUser(record.getResponseResourceId(), citizen)
                .orElseThrow(() -> new IllegalStateException("Idempotent queue ticket response is missing"));
        return response(ticket.getAppointment(), ticket, true);
    }
    private CheckInResponse response(Appointment appointment, QueueTicket ticket, boolean replayed) {
        return new CheckInResponse(appointment.getId(), appointment.getStatus(),
                new CheckInResponse.QueueTicketProjection(ticket.getId(), ticket.getTicketNumber(), ticket.getStatus()), replayed);
    }
    private User requireUser(UUID id) { return users.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found")); }
    private void validateKey(String key) { if (key == null || key.isBlank() || key.length() > 200) throw new IllegalArgumentException("IDEMPOTENCY_KEY_REQUIRED"); }
    private String hash(String value) {
        try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8))); }
        catch (NoSuchAlgorithmException exception) { throw new IllegalStateException("SHA-256 unavailable", exception); }
    }
}
