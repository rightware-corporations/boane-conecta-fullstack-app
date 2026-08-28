package mz.gov.boaneconecta.appointments.service;

import mz.gov.boaneconecta.appointments.dto.*;
import mz.gov.boaneconecta.appointments.entity.*;
import mz.gov.boaneconecta.appointments.repository.*;
import mz.gov.boaneconecta.core.exception.*;
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
public class AppointmentHoldService {
    private static final Set<AppointmentStatus> CAPACITY_STATES = EnumSet.of(
            AppointmentStatus.CONFIRMED, AppointmentStatus.CHECKED_IN,
            AppointmentStatus.WAITING, AppointmentStatus.CALLED, AppointmentStatus.IN_SERVICE);
    private final AppointmentSlotRepository slots;
    private final AppointmentHoldRepository holds;
    private final AppointmentRepository appointments;
    private final UserRepository users;
    private final Clock clock;
    private final Duration ttl;
    private final SecureRandom random = new SecureRandom();

    public AppointmentHoldService(AppointmentSlotRepository slots, AppointmentHoldRepository holds,
            AppointmentRepository appointments, UserRepository users, Clock clock,
            @Value("${appointments.hold.ttl:PT10M}") Duration ttl) {
        if (ttl.isZero() || ttl.isNegative()) throw new IllegalArgumentException("appointments.hold.ttl must be positive");
        this.slots = slots; this.holds = holds; this.appointments = appointments;
        this.users = users; this.clock = clock; this.ttl = ttl;
    }

    @Transactional
    public AppointmentHoldResponse create(UUID citizenId, UUID slotId, String idempotencyKey) {
        validateKey(idempotencyKey);
        User citizen = users.findById(citizenId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String keyHash = hash(idempotencyKey.trim());
        String fingerprint = hash(slotId.toString());
        Optional<AppointmentHold> replay = holds.findByCitizenUserAndIdempotencyKeyHash(citizen, keyHash);
        if (replay.isPresent()) {
            if (!MessageDigest.isEqual(replay.get().getRequestFingerprint().getBytes(StandardCharsets.UTF_8), fingerprint.getBytes(StandardCharsets.UTF_8)))
                throw new ResourceConflictException("IDEMPOTENCY_KEY_REUSED");
            return response(replay.get());
        }

        AppointmentSlot slot = slots.findByIdForUpdate(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("APPOINTMENT_SLOT_NOT_AVAILABLE"));
        if (slot.getStatus() != SlotStatus.AVAILABLE || slot.getStartTime() == null || !slot.getStartTime().isAfter(clock.instant()))
            throw new ResourceConflictException("APPOINTMENT_SLOT_NOT_AVAILABLE");
        long committed = appointments.countBySlotAndStatusIn(slot, CAPACITY_STATES);
        long activeHolds = holds.countBySlotAndStatusAndExpiresAtAfter(slot, AppointmentHoldStatus.ACTIVE, clock.instant());
        if (committed + activeHolds >= slot.getCapacity())
            throw new ResourceConflictException("APPOINTMENT_SLOT_CAPACITY_REACHED");

        byte[] secret = new byte[32]; random.nextBytes(secret);
        AppointmentHold hold = holds.saveAndFlush(AppointmentHold.builder()
                .slot(slot).citizenUser(citizen).tokenHash(hash(Base64.getUrlEncoder().withoutPadding().encodeToString(secret)))
                .idempotencyKeyHash(keyHash).requestFingerprint(fingerprint)
                .expiresAt(clock.instant().plus(ttl)).build());
        return response(hold);
    }

    private AppointmentHoldResponse response(AppointmentHold hold) {
        return new AppointmentHoldResponse(hold.getId(), hold.getSlot().getId(), hold.getExpiresAt(), hold.getVersion());
    }
    private void validateKey(String key) {
        if (key == null || key.isBlank() || key.length() > 200) throw new IllegalArgumentException("IDEMPOTENCY_KEY_REQUIRED");
    }
    private String hash(String value) {
        try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8))); }
        catch (NoSuchAlgorithmException exception) { throw new IllegalStateException("SHA-256 unavailable", exception); }
    }
}
