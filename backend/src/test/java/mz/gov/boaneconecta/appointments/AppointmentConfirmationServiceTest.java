package mz.gov.boaneconecta.appointments;

import mz.gov.boaneconecta.appointments.entity.*;
import mz.gov.boaneconecta.appointments.repository.*;
import mz.gov.boaneconecta.appointments.service.AppointmentConfirmationService;
import mz.gov.boaneconecta.core.exception.ResourceConflictException;
import mz.gov.boaneconecta.requests.submission.entity.*;
import mz.gov.boaneconecta.requests.submission.repository.IdempotencyRecordRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.junit.jupiter.api.Test;
import java.time.*;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AppointmentConfirmationServiceTest {
    private final AppointmentHoldRepository holds = mock(AppointmentHoldRepository.class);
    private final AppointmentSlotRepository slots = mock(AppointmentSlotRepository.class);
    private final AppointmentRepository appointments = mock(AppointmentRepository.class);
    private final IdempotencyRecordRepository idempotency = mock(IdempotencyRecordRepository.class);
    private final UserRepository users = mock(UserRepository.class);
    private final Clock clock = Clock.fixed(Instant.parse("2026-09-01T08:00:00Z"), ZoneId.of("Africa/Maputo"));
    private final AppointmentConfirmationService service = new AppointmentConfirmationService(
            holds, slots, appointments, idempotency, users, clock);

    @Test void atomicallyConsumesOwnedActiveHoldAndCreatesConfirmedAppointment() {
        UUID citizenId = UUID.randomUUID(); UUID holdId = UUID.randomUUID(); UUID slotId = UUID.randomUUID();
        User citizen = User.builder().id(citizenId).build();
        AppointmentSlot slot = AppointmentSlot.builder().id(slotId).capacity(1).status(SlotStatus.AVAILABLE)
                .startTime(clock.instant().plusSeconds(3600)).endTime(clock.instant().plusSeconds(7200)).build();
        AppointmentHold hold = AppointmentHold.builder().id(holdId).citizenUser(citizen).slot(slot)
                .status(AppointmentHoldStatus.ACTIVE).expiresAt(clock.instant().plusSeconds(600)).version(0L).build();
        when(users.findById(citizenId)).thenReturn(Optional.of(citizen));
        when(holds.findOwnedByIdForUpdate(holdId, citizen)).thenReturn(Optional.of(hold));
        when(slots.findByIdForUpdate(slotId)).thenReturn(Optional.of(slot));
        when(appointments.saveAndFlush(any())).thenAnswer(invocation -> {
            Appointment saved = invocation.getArgument(0); saved.setId(UUID.randomUUID()); return saved;
        });
        when(idempotency.saveAndFlush(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var response = service.confirm(citizenId, holdId, "Renovar documento", "confirm-1", 0L);

        assertThat(response.status()).isEqualTo(AppointmentStatus.CONFIRMED);
        assertThat(response.replayed()).isFalse();
        assertThat(hold.getStatus()).isEqualTo(AppointmentHoldStatus.CONSUMED);
        assertThat(hold.getConsumedAt()).isEqualTo(clock.instant());
        verify(appointments).saveAndFlush(argThat(value -> value.getCheckInCodeHash() != null
                && value.getCheckInCodeHash().length() == 64 && value.getConfirmedAt().equals(clock.instant())));
    }

    @Test void replaysCompletedConfirmationWithoutConsumingHoldAgain() {
        UUID citizenId = UUID.randomUUID(); UUID holdId = UUID.randomUUID(); UUID appointmentId = UUID.randomUUID();
        User citizen = User.builder().id(citizenId).build();
        AppointmentSlot slot = AppointmentSlot.builder().startTime(clock.instant().plusSeconds(3600)).build();
        Appointment existing = Appointment.builder().id(appointmentId).appointmentNumber("APT-20260901-123456")
                .citizenUser(citizen).slot(slot).status(AppointmentStatus.CONFIRMED).build();
        String fingerprint = sha256(holdId + ":");
        IdempotencyRecord record = IdempotencyRecord.builder().citizenUser(citizen).operation("APPOINTMENT_CONFIRM")
                .keyHash("hash").requestFingerprint(fingerprint).state(IdempotencyState.COMPLETED)
                .responseResourceId(appointmentId).build();
        when(users.findById(citizenId)).thenReturn(Optional.of(citizen));
        when(idempotency.findByCitizenUserAndOperationAndKeyHash(eq(citizen), eq("APPOINTMENT_CONFIRM"), anyString()))
                .thenReturn(Optional.of(record));
        when(appointments.findByIdAndCitizenUser(appointmentId, citizen)).thenReturn(Optional.of(existing));

        assertThat(service.confirm(citizenId, holdId, null, "confirm-1", 0L).replayed()).isTrue();
        verifyNoInteractions(holds, slots);
    }

    @Test void rejectsExpiredHoldWithoutCreatingAppointment() {
        UUID citizenId = UUID.randomUUID(); UUID holdId = UUID.randomUUID();
        User citizen = User.builder().id(citizenId).build();
        AppointmentSlot slot = AppointmentSlot.builder().id(UUID.randomUUID()).build();
        AppointmentHold hold = AppointmentHold.builder().id(holdId).citizenUser(citizen).slot(slot)
                .status(AppointmentHoldStatus.ACTIVE).expiresAt(clock.instant()).version(0L).build();
        when(users.findById(citizenId)).thenReturn(Optional.of(citizen));
        when(idempotency.saveAndFlush(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(holds.findOwnedByIdForUpdate(holdId, citizen)).thenReturn(Optional.of(hold));

        assertThatThrownBy(() -> service.confirm(citizenId, holdId, null, "confirm-1", 0L))
                .isInstanceOf(ResourceConflictException.class).hasMessage("APPOINTMENT_HOLD_EXPIRED");
        verify(appointments, never()).saveAndFlush(any());
    }

    private String sha256(String value) {
        try { return HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256")
                .digest(value.getBytes(java.nio.charset.StandardCharsets.UTF_8))); }
        catch (java.security.NoSuchAlgorithmException exception) { throw new AssertionError(exception); }
    }
}
