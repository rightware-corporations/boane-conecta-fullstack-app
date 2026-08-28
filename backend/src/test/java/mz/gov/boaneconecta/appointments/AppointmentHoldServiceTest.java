package mz.gov.boaneconecta.appointments;

import mz.gov.boaneconecta.appointments.entity.*;
import mz.gov.boaneconecta.appointments.repository.*;
import mz.gov.boaneconecta.appointments.service.AppointmentHoldService;
import mz.gov.boaneconecta.core.exception.ResourceConflictException;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.junit.jupiter.api.Test;
import java.time.*;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppointmentHoldServiceTest {
    private final AppointmentSlotRepository slots = mock(AppointmentSlotRepository.class);
    private final AppointmentHoldRepository holds = mock(AppointmentHoldRepository.class);
    private final AppointmentRepository appointments = mock(AppointmentRepository.class);
    private final UserRepository users = mock(UserRepository.class);
    private final Clock clock = Clock.fixed(Instant.parse("2026-09-01T08:00:00Z"), ZoneId.of("Africa/Maputo"));
    private final AppointmentHoldService service = new AppointmentHoldService(slots, holds, appointments, users, clock, Duration.ofMinutes(10));

    @Test void refusesToAllocateBeyondServerCapacity() {
        UUID citizenId = UUID.randomUUID(); UUID slotId = UUID.randomUUID();
        User citizen = User.builder().id(citizenId).build();
        AppointmentSlot slot = AppointmentSlot.builder().id(slotId).capacity(1).status(SlotStatus.AVAILABLE)
                .startTime(clock.instant().plusSeconds(3600)).endTime(clock.instant().plusSeconds(7200)).build();
        when(users.findById(citizenId)).thenReturn(Optional.of(citizen));
        when(slots.findByIdForUpdate(slotId)).thenReturn(Optional.of(slot));
        when(appointments.countBySlotAndStatusIn(eq(slot), anyCollection())).thenReturn(1L);

        assertThatThrownBy(() -> service.create(citizenId, slotId, "operation-123"))
                .isInstanceOf(ResourceConflictException.class)
                .hasMessage("APPOINTMENT_SLOT_CAPACITY_REACHED");
        verify(holds, never()).saveAndFlush(any());
    }

    @Test void replaysTheSameHoldForTheSameOperation() {
        UUID citizenId = UUID.randomUUID(); UUID slotId = UUID.randomUUID(); UUID holdId = UUID.randomUUID();
        User citizen = User.builder().id(citizenId).build();
        AppointmentSlot slot = AppointmentSlot.builder().id(slotId).build();
        AppointmentHold existing = AppointmentHold.builder().id(holdId).slot(slot).citizenUser(citizen)
                .requestFingerprint(sha256(slotId.toString())).expiresAt(clock.instant().plusSeconds(60)).build();
        when(users.findById(citizenId)).thenReturn(Optional.of(citizen));
        when(holds.findByCitizenUserAndIdempotencyKeyHash(eq(citizen), anyString())).thenReturn(Optional.of(existing));

        assertThat(service.create(citizenId, slotId, "operation-123").holdId()).isEqualTo(holdId);
        verify(slots, never()).findByIdForUpdate(any());
    }

    private String sha256(String value) {
        try { return HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256").digest(value.getBytes(java.nio.charset.StandardCharsets.UTF_8))); }
        catch (java.security.NoSuchAlgorithmException exception) { throw new AssertionError(exception); }
    }
}
