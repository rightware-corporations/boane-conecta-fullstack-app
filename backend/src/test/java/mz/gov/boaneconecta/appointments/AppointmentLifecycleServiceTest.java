package mz.gov.boaneconecta.appointments;

import mz.gov.boaneconecta.appointments.entity.*;
import mz.gov.boaneconecta.appointments.repository.*;
import mz.gov.boaneconecta.appointments.service.AppointmentLifecycleService;
import mz.gov.boaneconecta.core.exception.ResourceConflictException;
import mz.gov.boaneconecta.requests.submission.repository.IdempotencyRecordRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.junit.jupiter.api.Test;
import java.time.*;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AppointmentLifecycleServiceTest {
    private final AppointmentRepository appointments = mock(AppointmentRepository.class);
    private final AppointmentHoldRepository holds = mock(AppointmentHoldRepository.class);
    private final AppointmentSlotRepository slots = mock(AppointmentSlotRepository.class);
    private final IdempotencyRecordRepository idempotency = mock(IdempotencyRecordRepository.class);
    private final UserRepository users = mock(UserRepository.class);
    private final Clock clock = Clock.fixed(Instant.parse("2026-09-01T08:00:00Z"), ZoneId.of("Africa/Maputo"));
    private final AppointmentLifecycleService service = new AppointmentLifecycleService(
            appointments, holds, slots, idempotency, users, clock, Duration.ofHours(24));

    @Test void cancellationPreservesOriginalReasonAndRecordsAuditReason() {
        User citizen = User.builder().id(UUID.randomUUID()).build();
        AppointmentSlot slot = futureSlot(72);
        Appointment appointment = Appointment.builder().id(UUID.randomUUID()).citizenUser(citizen).slot(slot)
                .appointmentNumber("APT-1").reason("Original purpose").status(AppointmentStatus.CONFIRMED).version(2L).build();
        stubCommand(citizen, appointment);

        var response = service.cancel(citizen.getId(), appointment.getId(), "Travel", "cancel-1", 2L);

        assertThat(response.status()).isEqualTo(AppointmentStatus.CANCELLED);
        assertThat(appointment.getReason()).isEqualTo("Original purpose");
        assertThat(appointment.getCancellationReason()).isEqualTo("Travel");
        assertThat(appointment.getCancelledAt()).isEqualTo(clock.instant());
    }

    @Test void cancellationHonoursConfiguredCutoff() {
        User citizen = User.builder().id(UUID.randomUUID()).build();
        Appointment appointment = Appointment.builder().id(UUID.randomUUID()).citizenUser(citizen).slot(futureSlot(12))
                .appointmentNumber("APT-2").status(AppointmentStatus.CONFIRMED).version(0L).build();
        stubCommand(citizen, appointment);
        assertThatThrownBy(() -> service.cancel(citizen.getId(), appointment.getId(), null, "cancel-2", 0L))
                .isInstanceOf(ResourceConflictException.class).hasMessage("APPOINTMENT_CANCELLATION_CUTOFF_REACHED");
        assertThat(appointment.getStatus()).isEqualTo(AppointmentStatus.CONFIRMED);
    }

    @Test void rescheduleConsumesTargetHoldOnlyAfterAllValidations() {
        User citizen = User.builder().id(UUID.randomUUID()).build();
        AppointmentSlot oldSlot = futureSlot(72); AppointmentSlot target = futureSlot(96);
        Appointment appointment = Appointment.builder().id(UUID.randomUUID()).citizenUser(citizen).slot(oldSlot)
                .appointmentNumber("APT-3").status(AppointmentStatus.CONFIRMED).version(1L).build();
        AppointmentHold hold = AppointmentHold.builder().id(UUID.randomUUID()).citizenUser(citizen).slot(target)
                .status(AppointmentHoldStatus.ACTIVE).expiresAt(clock.instant().plusSeconds(600)).version(0L).build();
        stubCommand(citizen, appointment);
        when(holds.findOwnedByIdForUpdate(hold.getId(), citizen)).thenReturn(Optional.of(hold));
        when(slots.findByIdForUpdate(target.getId())).thenReturn(Optional.of(target));

        var response = service.reschedule(citizen.getId(), appointment.getId(), hold.getId(), 0L, "move-1", 1L);

        assertThat(response.startsAt()).isEqualTo(target.getStartTime());
        assertThat(appointment.getSlot()).isSameAs(target);
        assertThat(hold.getStatus()).isEqualTo(AppointmentHoldStatus.CONSUMED);
    }

    private void stubCommand(User citizen, Appointment appointment) {
        when(users.findById(citizen.getId())).thenReturn(Optional.of(citizen));
        when(appointments.findOwnedByIdForUpdate(appointment.getId(), citizen)).thenReturn(Optional.of(appointment));
        when(idempotency.saveAndFlush(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(appointments.saveAndFlush(any())).thenAnswer(invocation -> invocation.getArgument(0));
    }
    private AppointmentSlot futureSlot(long hours) {
        return AppointmentSlot.builder().id(UUID.randomUUID()).capacity(1).status(SlotStatus.AVAILABLE)
                .startTime(clock.instant().plusSeconds(hours * 3600)).endTime(clock.instant().plusSeconds((hours + 1) * 3600)).build();
    }
}
