package mz.gov.boaneconecta.queue;

import mz.gov.boaneconecta.queue.entity.*;
import mz.gov.boaneconecta.queue.repository.*;
import mz.gov.boaneconecta.queue.service.*;
import mz.gov.boaneconecta.requests.submission.repository.IdempotencyRecordRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.junit.jupiter.api.Test;
import java.time.*;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class QueueOperationsServiceTest {
    private final MunicipalQueueRepository queues=mock(MunicipalQueueRepository.class);
    private final QueueDeskRepository desks=mock(QueueDeskRepository.class);
    private final QueueTicketRepository tickets=mock(QueueTicketRepository.class);
    private final ServiceSessionRepository sessions=mock(ServiceSessionRepository.class);
    private final QueueEventRepository events=mock(QueueEventRepository.class);
    private final QueueSequenceAllocator sequences=mock(QueueSequenceAllocator.class);
    private final IdempotencyRecordRepository idempotency=mock(IdempotencyRecordRepository.class);
    private final UserRepository users=mock(UserRepository.class);
    private final Clock clock=Clock.fixed(Instant.parse("2026-09-01T08:00:00Z"),ZoneId.of("Africa/Maputo"));
    private final QueueOperationsService service=new QueueOperationsService(queues,desks,tickets,sessions,events,sequences,idempotency,users,clock);

    @Test void callNextSelectsTicketOnlyOnBackendAndAssignsCurrentDesk(){
        Fixture f=fixture(); QueueTicket waiting=QueueTicket.builder().id(UUID.randomUUID()).queue(f.queue)
                .businessDate(LocalDate.now(clock)).sequenceNumber(1).ticketNumber("A001").status(QueueTicketStatus.WAITING).build();
        when(tickets.findNextWaitingForUpdate(f.queue.getId(),LocalDate.now(clock))).thenReturn(Optional.of(waiting));
        when(idempotency.saveAndFlush(any())).thenAnswer(i->i.getArgument(0));
        var result=service.callNext(f.staff.getId(),f.queue.getId(),f.desk.getId(),"call-1");
        assertThat(result.ticketId()).isEqualTo(waiting.getId());
        assertThat(waiting.getStatus()).isEqualTo(QueueTicketStatus.CALLED);
        assertThat(waiting.getCalledDesk()).isSameAs(f.desk);
        verify(events).save(argThat(event->event.getEventType().equals("TICKET_CALLED")));
    }

    @Test void startAndCompleteServiceKeepDeskTicketAndSessionConsistent(){
        Fixture f=fixture(); QueueTicket called=QueueTicket.builder().id(UUID.randomUUID()).queue(f.queue).calledDesk(f.desk)
                .ticketNumber("A001").status(QueueTicketStatus.CALLED).build();
        when(tickets.findByIdForUpdate(called.getId())).thenReturn(Optional.of(called));
        when(desks.findByIdForUpdate(f.desk.getId())).thenReturn(Optional.of(f.desk));
        when(sessions.saveAndFlush(any())).thenAnswer(i->{ServiceSession s=i.getArgument(0);s.setId(UUID.randomUUID());return s;});
        var started=service.startService(f.staff.getId(),called.getId());
        assertThat(started.ticketStatus()).isEqualTo(QueueTicketStatus.SERVING);
        assertThat(f.desk.getStatus()).isEqualTo(QueueDeskStatus.SERVING);
        ServiceSession session=mockingDetails(sessions).getInvocations().stream().filter(i->i.getMethod().getName().equals("saveAndFlush"))
                .map(i->(ServiceSession)i.getArgument(0)).findFirst().orElseThrow();
        when(sessions.findByIdForUpdate(session.getId())).thenReturn(Optional.of(session));
        var completed=service.completeService(f.staff.getId(),session.getId(),"RESOLVED");
        assertThat(completed.ticketStatus()).isEqualTo(QueueTicketStatus.COMPLETED);
        assertThat(session.getStatus()).isEqualTo(ServiceSessionStatus.COMPLETED);
        assertThat(f.desk.getStatus()).isEqualTo(QueueDeskStatus.OPEN);
    }

    private Fixture fixture(){User staff=User.builder().id(UUID.randomUUID()).build(); MunicipalQueue queue=MunicipalQueue.builder()
            .id(UUID.randomUUID()).name("Queue").locationCode("BOANE").status(QueueStatus.OPEN).build(); QueueDesk desk=QueueDesk.builder()
            .id(UUID.randomUUID()).queue(queue).displayName("Balcão 1").code("B1").status(QueueDeskStatus.OPEN).currentStaffUser(staff).build();
        when(users.findById(staff.getId())).thenReturn(Optional.of(staff));when(queues.findByIdForUpdate(queue.getId())).thenReturn(Optional.of(queue));
        when(desks.findByQueueForUpdate(queue.getId(),desk.getId())).thenReturn(Optional.of(desk));return new Fixture(staff,queue,desk);}
    private record Fixture(User staff,MunicipalQueue queue,QueueDesk desk){}
}
