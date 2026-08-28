package mz.gov.boaneconecta.appointments.service;

import mz.gov.boaneconecta.appointments.dto.AppointmentConfirmationResponse;
import mz.gov.boaneconecta.appointments.entity.*;
import mz.gov.boaneconecta.appointments.repository.*;
import mz.gov.boaneconecta.core.exception.*;
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
public class AppointmentLifecycleService {
    private static final String CANCEL = "APPOINTMENT_CANCEL";
    private static final String RESCHEDULE = "APPOINTMENT_RESCHEDULE";
    private static final Set<AppointmentStatus> CAPACITY_STATES = EnumSet.of(
            AppointmentStatus.CONFIRMED, AppointmentStatus.CHECKED_IN,
            AppointmentStatus.WAITING, AppointmentStatus.CALLED, AppointmentStatus.IN_SERVICE);
    private final AppointmentRepository appointments;
    private final AppointmentHoldRepository holds;
    private final AppointmentSlotRepository slots;
    private final IdempotencyRecordRepository idempotency;
    private final UserRepository users;
    private final Clock clock;
    private final Duration cancellationCutoff;

    public AppointmentLifecycleService(AppointmentRepository appointments, AppointmentHoldRepository holds,
            AppointmentSlotRepository slots, IdempotencyRecordRepository idempotency,
            UserRepository users, Clock clock,
            @Value("${appointments.cancellation.cutoff:PT24H}") Duration cancellationCutoff) {
        if (cancellationCutoff.isNegative()) throw new IllegalArgumentException("appointments.cancellation.cutoff cannot be negative");
        this.appointments = appointments; this.holds = holds; this.slots = slots;
        this.idempotency = idempotency; this.users = users; this.clock = clock;
        this.cancellationCutoff = cancellationCutoff;
    }

    @Transactional
    public AppointmentConfirmationResponse cancel(UUID citizenId, UUID appointmentId, String reason,
            String idempotencyKey, Long expectedVersion) {
        User citizen = requireCommand(citizenId, idempotencyKey, expectedVersion);
        String fingerprint = hash(appointmentId + ":" + clean(reason));
        Optional<AppointmentConfirmationResponse> replay = replay(citizen, CANCEL, idempotencyKey, fingerprint);
        if (replay.isPresent()) return replay.get();
        IdempotencyRecord claim = claim(citizen, CANCEL, idempotencyKey, fingerprint);
        Appointment appointment = lockedAppointment(appointmentId, citizen, expectedVersion);
        if (appointment.getStatus() == AppointmentStatus.CANCELLED) throw new ResourceConflictException("APPOINTMENT_ALREADY_CANCELLED");
        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) throw new ResourceConflictException("APPOINTMENT_CANNOT_BE_CANCELLED");
        if (!clock.instant().isBefore(appointment.getSlot().getStartTime().minus(cancellationCutoff)))
            throw new ResourceConflictException("APPOINTMENT_CANCELLATION_CUTOFF_REACHED");
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancelledAt(clock.instant());
        appointment.setCancellationReason(clean(reason).isEmpty() ? null : clean(reason));
        appointments.saveAndFlush(appointment);
        complete(claim, appointment);
        return response(appointment, false);
    }

    @Transactional
    public AppointmentConfirmationResponse reschedule(UUID citizenId, UUID appointmentId, UUID holdId,
            Long holdVersion, String idempotencyKey, Long expectedVersion) {
        User citizen = requireCommand(citizenId, idempotencyKey, expectedVersion);
        if (holdVersion == null || holdVersion < 0) throw new IllegalArgumentException("APPOINTMENT_HOLD_VERSION_REQUIRED");
        String fingerprint = hash(appointmentId + ":" + holdId + ":" + holdVersion);
        Optional<AppointmentConfirmationResponse> replay = replay(citizen, RESCHEDULE, idempotencyKey, fingerprint);
        if (replay.isPresent()) return replay.get();
        IdempotencyRecord claim = claim(citizen, RESCHEDULE, idempotencyKey, fingerprint);
        Appointment appointment = lockedAppointment(appointmentId, citizen, expectedVersion);
        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) throw new ResourceConflictException("APPOINTMENT_CANNOT_BE_RESCHEDULED");
        AppointmentHold hold = holds.findOwnedByIdForUpdate(holdId, citizen)
                .orElseThrow(() -> new ResourceNotFoundException("APPOINTMENT_HOLD_NOT_FOUND"));
        if (!Objects.equals(hold.getVersion(), holdVersion)) throw new ResourceConflictException("APPOINTMENT_HOLD_VERSION_MISMATCH");
        Instant now = clock.instant();
        if (hold.getStatus() != AppointmentHoldStatus.ACTIVE) throw new ResourceConflictException("APPOINTMENT_HOLD_NOT_ACTIVE");
        if (!hold.getExpiresAt().isAfter(now)) throw new ResourceConflictException("APPOINTMENT_HOLD_EXPIRED");
        if (appointment.getSlot().getId().equals(hold.getSlot().getId())) throw new ResourceConflictException("APPOINTMENT_SLOT_UNCHANGED");
        AppointmentSlot target = slots.findByIdForUpdate(hold.getSlot().getId())
                .orElseThrow(() -> new ResourceNotFoundException("APPOINTMENT_SLOT_NOT_AVAILABLE"));
        if (target.getStatus() != SlotStatus.AVAILABLE || !target.getStartTime().isAfter(now))
            throw new ResourceConflictException("APPOINTMENT_SLOT_NOT_AVAILABLE");
        if (appointments.countBySlotAndStatusIn(target, CAPACITY_STATES) >= target.getCapacity())
            throw new ResourceConflictException("APPOINTMENT_SLOT_CAPACITY_REACHED");
        appointment.setSlot(target);
        appointments.saveAndFlush(appointment);
        hold.setStatus(AppointmentHoldStatus.CONSUMED); hold.setConsumedAt(now); holds.save(hold);
        complete(claim, appointment);
        return response(appointment, false);
    }

    private User requireCommand(UUID citizenId, String key, Long version) {
        if (key == null || key.isBlank() || key.length() > 200) throw new IllegalArgumentException("IDEMPOTENCY_KEY_REQUIRED");
        if (version == null || version < 0) throw new IllegalArgumentException("IF_MATCH_REQUIRED");
        return users.findById(citizenId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    private Appointment lockedAppointment(UUID id, User citizen, Long version) {
        Appointment appointment = appointments.findOwnedByIdForUpdate(id, citizen)
                .orElseThrow(() -> new ResourceNotFoundException("APPOINTMENT_NOT_FOUND"));
        if (!Objects.equals(appointment.getVersion(), version)) throw new ResourceConflictException("APPOINTMENT_VERSION_MISMATCH");
        return appointment;
    }
    private IdempotencyRecord claim(User citizen, String operation, String key, String fingerprint) {
        return idempotency.saveAndFlush(IdempotencyRecord.builder().id(UUID.randomUUID()).citizenUser(citizen)
                .operation(operation).keyHash(hash(key.trim())).requestFingerprint(fingerprint)
                .state(IdempotencyState.IN_PROGRESS).expiresAt(clock.instant().plus(Duration.ofDays(7))).build());
    }
    private Optional<AppointmentConfirmationResponse> replay(User citizen, String operation, String key, String fingerprint) {
        var previous = idempotency.findByCitizenUserAndOperationAndKeyHash(citizen, operation, hash(key.trim()));
        if (previous.isEmpty()) return Optional.empty();
        IdempotencyRecord record = previous.get();
        if (!MessageDigest.isEqual(record.getRequestFingerprint().getBytes(StandardCharsets.UTF_8), fingerprint.getBytes(StandardCharsets.UTF_8)))
            throw new ResourceConflictException("IDEMPOTENCY_KEY_REUSED");
        if (record.getState() != IdempotencyState.COMPLETED) throw new ResourceConflictException("APPOINTMENT_COMMAND_IN_PROGRESS");
        Appointment appointment = appointments.findByIdAndCitizenUser(record.getResponseResourceId(), citizen)
                .orElseThrow(() -> new IllegalStateException("Idempotent appointment response is missing"));
        return Optional.of(response(appointment, true));
    }
    private void complete(IdempotencyRecord claim, Appointment appointment) {
        claim.complete(appointment.getId(), appointment.getAppointmentNumber(), clock.instant()); idempotency.save(claim);
    }
    private AppointmentConfirmationResponse response(Appointment appointment, boolean replayed) {
        List<String> actions = appointment.getStatus() == AppointmentStatus.CONFIRMED ? List.of("CANCEL", "RESCHEDULE") : List.of();
        return new AppointmentConfirmationResponse(appointment.getId(), appointment.getAppointmentNumber(), appointment.getStatus(),
                appointment.getSlot().getStartTime(), actions, replayed);
    }
    private String clean(String value) { return value == null ? "" : value.trim(); }
    private String hash(String value) {
        try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8))); }
        catch (NoSuchAlgorithmException exception) { throw new IllegalStateException("SHA-256 unavailable", exception); }
    }
}
