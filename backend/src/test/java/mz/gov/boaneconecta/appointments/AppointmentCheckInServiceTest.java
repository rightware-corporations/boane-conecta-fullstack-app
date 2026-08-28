package mz.gov.boaneconecta.appointments;

import mz.gov.boaneconecta.appointments.dto.*;
import mz.gov.boaneconecta.appointments.entity.*;
import mz.gov.boaneconecta.appointments.repository.AppointmentRepository;
import mz.gov.boaneconecta.appointments.service.*;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.queue.entity.*;
import mz.gov.boaneconecta.queue.repository.*;
import mz.gov.boaneconecta.queue.service.QueueSequenceAllocator;
import mz.gov.boaneconecta.requests.submission.repository.IdempotencyRecordRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.junit.jupiter.api.Test;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.*;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AppointmentCheckInServiceTest {
    private final AppointmentRepository appointments = mock(AppointmentRepository.class);
    private final MunicipalQueueRepository queues = mock(MunicipalQueueRepository.class);
    private final QueueTicketRepository tickets = mock(QueueTicketRepository.class);
    private final QueueSequenceAllocator sequences = mock(QueueSequenceAllocator.class);
    private final IdempotencyRecordRepository idempotency = mock(IdempotencyRecordRepository.class);
    private final UserRepository users = mock(UserRepository.class);
    private final Clock clock = Clock.fixed(Instant.parse("2026-09-01T08:00:00Z"), ZoneId.of("Africa/Maputo"));
    private final AppointmentCheckInService service = new AppointmentCheckInService(appointments, queues, tickets,
            sequences, idempotency, users, clock, Duration.ofMinutes(30), Duration.ofMinutes(15), 5);

    @Test void validCredentialAtomicallyCreatesWaitingTicketAndConsumesCredential() {
        String credential = "opaque-high-entropy-value";
        Fixture f = fixture(credential);
        when(sequences.next(f.queue.getId(), LocalDate.now(clock))).thenReturn(23);
        when(tickets.saveAndFlush(any())).thenAnswer(invocation -> {
            QueueTicket ticket = invocation.getArgument(0); ticket.setId(UUID.randomUUID()); return ticket;
        });

        CheckInResponse response = service.citizenCheckIn(f.citizen.getId(), f.appointment.getId(),
                CheckInMethod.QR, credential, "check-in-1");

        assertThat(response.appointmentStatus()).isEqualTo(AppointmentStatus.CHECKED_IN);
        assertThat(response.queueTicket().code()).isEqualTo("A023");
        assertThat(f.appointment.getCheckInCodeConsumedAt()).isEqualTo(clock.instant());
        assertThat(f.appointment.getCheckInActorUser()).isSameAs(f.citizen);
        verify(tickets).saveAndFlush(argThat(ticket -> ticket.getPriorityClass() == QueuePriorityClass.NORMAL));
    }

    @Test void invalidCredentialPersistsAttemptAndCreatesNoTicket() {
        Fixture f = fixture("correct-value");
        assertThatThrownBy(() -> service.citizenCheckIn(f.citizen.getId(), f.appointment.getId(),
                CheckInMethod.MANUAL_CODE, "wrong-value", "check-in-2"))
                .isInstanceOf(InvalidCheckInCredentialException.class).hasMessage("CHECK_IN_CREDENTIAL_INVALID");
        assertThat(f.appointment.getCheckInFailedAttempts()).isEqualTo(1);
        verify(appointments).saveAndFlush(f.appointment);
        verifyNoInteractions(sequences);
        verify(tickets, never()).saveAndFlush(any());
    }

    private Fixture fixture(String credential) {
        User citizen = User.builder().id(UUID.randomUUID()).build();
        MunicipalService municipalService = MunicipalService.builder().id(UUID.randomUUID()).build();
        Department department = Department.builder().id(UUID.randomUUID()).build();
        AppointmentSlot slot = AppointmentSlot.builder().id(UUID.randomUUID()).service(municipalService).department(department)
                .locationCode("BOANE").status(SlotStatus.AVAILABLE).capacity(1)
                .startTime(clock.instant().plusSeconds(10 * 60)).endTime(clock.instant().plusSeconds(40 * 60)).build();
        Appointment appointment = Appointment.builder().id(UUID.randomUUID()).appointmentNumber("APT-1")
                .citizenUser(citizen).slot(slot).status(AppointmentStatus.CONFIRMED)
                .checkInCodeHash(hash(credential)).checkInCodeExpiresAt(slot.getEndTime()).build();
        MunicipalQueue queue = MunicipalQueue.builder().id(UUID.randomUUID()).service(municipalService).department(department)
                .locationCode("BOANE").name("Atendimento").mode(QueueMode.APPOINTMENT_REQUIRED).status(QueueStatus.OPEN).build();
        when(users.findById(citizen.getId())).thenReturn(Optional.of(citizen));
        when(appointments.findOwnedByIdForUpdate(appointment.getId(), citizen)).thenReturn(Optional.of(appointment));
        when(queues.findOpenForUpdate(municipalService, "BOANE", QueueStatus.OPEN)).thenReturn(List.of(queue));
        when(idempotency.saveAndFlush(any())).thenAnswer(invocation -> invocation.getArgument(0));
        return new Fixture(citizen, appointment, queue);
    }
    private String hash(String value) {
        try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8))); }
        catch (NoSuchAlgorithmException exception) { throw new AssertionError(exception); }
    }
    private record Fixture(User citizen, Appointment appointment, MunicipalQueue queue) {}
}
