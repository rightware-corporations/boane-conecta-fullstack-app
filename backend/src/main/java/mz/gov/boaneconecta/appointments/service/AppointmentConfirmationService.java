package mz.gov.boaneconecta.appointments.service;

import mz.gov.boaneconecta.appointments.dto.AppointmentConfirmationResponse;
import mz.gov.boaneconecta.appointments.entity.*;
import mz.gov.boaneconecta.appointments.repository.*;
import mz.gov.boaneconecta.core.exception.*;
import mz.gov.boaneconecta.requests.submission.entity.*;
import mz.gov.boaneconecta.requests.submission.repository.IdempotencyRecordRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class AppointmentConfirmationService {
    private static final String OPERATION = "APPOINTMENT_CONFIRM";
    private static final Set<AppointmentStatus> CAPACITY_STATES = EnumSet.of(
            AppointmentStatus.CONFIRMED, AppointmentStatus.CHECKED_IN,
            AppointmentStatus.WAITING, AppointmentStatus.CALLED, AppointmentStatus.IN_SERVICE);
    private final AppointmentHoldRepository holds;
    private final AppointmentSlotRepository slots;
    private final AppointmentRepository appointments;
    private final IdempotencyRecordRepository idempotency;
    private final UserRepository users;
    private final Clock clock;
    private final SecureRandom random = new SecureRandom();

    public AppointmentConfirmationService(AppointmentHoldRepository holds, AppointmentSlotRepository slots,
            AppointmentRepository appointments, IdempotencyRecordRepository idempotency,
            UserRepository users, Clock clock) {
        this.holds = holds; this.slots = slots; this.appointments = appointments;
        this.idempotency = idempotency; this.users = users; this.clock = clock;
    }

    @Transactional
    public AppointmentConfirmationResponse confirm(UUID citizenId, UUID holdId, String reason,
            String idempotencyKey, Long expectedVersion) {
        validateKey(idempotencyKey);
        if (expectedVersion == null || expectedVersion < 0) throw new IllegalArgumentException("IF_MATCH_REQUIRED");
        User citizen = users.findById(citizenId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String keyHash = hash(idempotencyKey.trim());
        String fingerprint = hash(holdId + ":" + clean(reason));
        Optional<IdempotencyRecord> previous = idempotency.findByCitizenUserAndOperationAndKeyHash(citizen, OPERATION, keyHash);
        if (previous.isPresent()) return replay(previous.get(), fingerprint, citizen);

        IdempotencyRecord claim = idempotency.saveAndFlush(IdempotencyRecord.builder()
                .id(UUID.randomUUID()).citizenUser(citizen).operation(OPERATION).keyHash(keyHash)
                .requestFingerprint(fingerprint).state(IdempotencyState.IN_PROGRESS)
                .expiresAt(clock.instant().plus(Duration.ofDays(7))).build());
        AppointmentHold hold = holds.findOwnedByIdForUpdate(holdId, citizen)
                .orElseThrow(() -> new ResourceNotFoundException("APPOINTMENT_HOLD_NOT_FOUND"));
        if (!Objects.equals(hold.getVersion(), expectedVersion)) throw new ResourceConflictException("APPOINTMENT_HOLD_VERSION_MISMATCH");
        Instant now = clock.instant();
        if (hold.getStatus() != AppointmentHoldStatus.ACTIVE) throw new ResourceConflictException("APPOINTMENT_HOLD_NOT_ACTIVE");
        if (!hold.getExpiresAt().isAfter(now)) throw new ResourceConflictException("APPOINTMENT_HOLD_EXPIRED");
        AppointmentSlot slot = slots.findByIdForUpdate(hold.getSlot().getId())
                .orElseThrow(() -> new ResourceNotFoundException("APPOINTMENT_SLOT_NOT_AVAILABLE"));
        if (slot.getStatus() != SlotStatus.AVAILABLE || !slot.getStartTime().isAfter(now))
            throw new ResourceConflictException("APPOINTMENT_SLOT_NOT_AVAILABLE");
        if (appointments.countBySlotAndStatusIn(slot, CAPACITY_STATES) >= slot.getCapacity())
            throw new ResourceConflictException("APPOINTMENT_SLOT_CAPACITY_REACHED");

        String checkInCredential = randomToken();
        Appointment appointment = appointments.saveAndFlush(Appointment.builder()
                .appointmentNumber(generateReference()).citizenUser(citizen).slot(slot)
                .reason(cleanToNull(reason)).status(AppointmentStatus.CONFIRMED).confirmedAt(now)
                .checkInCodeHash(hash(checkInCredential)).checkInCodeExpiresAt(slot.getEndTime()).build());
        hold.setStatus(AppointmentHoldStatus.CONSUMED);
        hold.setConsumedAt(now);
        holds.save(hold);
        claim.complete(appointment.getId(), appointment.getAppointmentNumber(), now);
        idempotency.save(claim);
        return response(appointment, false, checkInCredential);
    }

    private AppointmentConfirmationResponse replay(IdempotencyRecord record, String fingerprint, User citizen) {
        if (!MessageDigest.isEqual(record.getRequestFingerprint().getBytes(StandardCharsets.UTF_8), fingerprint.getBytes(StandardCharsets.UTF_8)))
            throw new ResourceConflictException("IDEMPOTENCY_KEY_REUSED");
        if (record.getState() != IdempotencyState.COMPLETED) throw new ResourceConflictException("APPOINTMENT_CONFIRMATION_IN_PROGRESS");
        Appointment appointment = appointments.findByIdAndCitizenUser(record.getResponseResourceId(), citizen)
                .orElseThrow(() -> new IllegalStateException("Idempotent appointment response is missing"));
        return response(appointment, true, null);
    }

    private AppointmentConfirmationResponse response(Appointment appointment, boolean replayed, String credential) {
        return new AppointmentConfirmationResponse(appointment.getId(), appointment.getAppointmentNumber(),
                appointment.getStatus(), appointment.getSlot().getStartTime(), List.of("CANCEL", "RESCHEDULE"),
                appointment.getVersion(), replayed, credential);
    }
    private String generateReference() {
        String prefix = "APT-" + LocalDate.now(clock).format(DateTimeFormatter.BASIC_ISO_DATE) + "-";
        for (int attempt = 0; attempt < 20; attempt++) {
            String candidate = prefix + random.nextInt(100000, 1000000);
            if (!appointments.existsByAppointmentNumber(candidate)) return candidate;
        }
        throw new IllegalStateException("APPOINTMENT_REFERENCE_EXHAUSTED");
    }
    private String randomToken() { byte[] bytes = new byte[32]; random.nextBytes(bytes); return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes); }
    private String clean(String value) { return value == null ? "" : value.trim(); }
    private String cleanToNull(String value) { String cleaned = clean(value); return cleaned.isEmpty() ? null : cleaned; }
    private void validateKey(String key) { if (key == null || key.isBlank() || key.length() > 200) throw new IllegalArgumentException("IDEMPOTENCY_KEY_REQUIRED"); }
    private String hash(String value) {
        try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8))); }
        catch (NoSuchAlgorithmException exception) { throw new IllegalStateException("SHA-256 unavailable", exception); }
    }
}
