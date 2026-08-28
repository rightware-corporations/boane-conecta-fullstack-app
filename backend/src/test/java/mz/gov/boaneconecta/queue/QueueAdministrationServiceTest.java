package mz.gov.boaneconecta.queue;

import mz.gov.boaneconecta.core.exception.ResourceConflictException;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.departments.repository.DepartmentRepository;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.municipalservices.repository.MunicipalServiceRepository;
import mz.gov.boaneconecta.queue.dto.*;
import mz.gov.boaneconecta.queue.entity.*;
import mz.gov.boaneconecta.queue.repository.*;
import mz.gov.boaneconecta.queue.service.QueueAdministrationService;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class QueueAdministrationServiceTest {
    private final MunicipalQueueRepository queues=mock(MunicipalQueueRepository.class);private final QueueDeskRepository desks=mock(QueueDeskRepository.class);
    private final QueueTicketRepository tickets=mock(QueueTicketRepository.class);private final DepartmentRepository departments=mock(DepartmentRepository.class);
    private final MunicipalServiceRepository services=mock(MunicipalServiceRepository.class);
    private final QueueAdministrationService service=new QueueAdministrationService(queues,desks,tickets,departments,services);

    @Test void createsQueueClosedAndNormalizesOperationalCodes(){Department department=Department.builder().id(UUID.randomUUID()).build();
        MunicipalService municipal=MunicipalService.builder().id(UUID.randomUUID()).department(department).build();when(departments.findById(department.getId())).thenReturn(Optional.of(department));
        when(services.findById(municipal.getId())).thenReturn(Optional.of(municipal));when(queues.saveAndFlush(any())).thenAnswer(i->{MunicipalQueue q=i.getArgument(0);q.setId(UUID.randomUUID());q.setVersion(0L);return q;});
        var result=service.create(new CreateQueueRequest(" Atendimento "," boane ",department.getId(),municipal.getId(),QueueMode.APPOINTMENT_REQUIRED));
        assertThat(result.status()).isEqualTo(QueueStatus.CLOSED);assertThat(result.locationCode()).isEqualTo("BOANE");}

    @Test void refusesToOpenQueueWithoutConfiguredDesk(){MunicipalQueue queue=queue();when(queues.findByIdForUpdate(queue.getId())).thenReturn(Optional.of(queue));
        assertThatThrownBy(()->service.changeStatus(queue.getId(),0L,QueueStatus.OPEN)).isInstanceOf(ResourceConflictException.class)
                .hasMessage("QUEUE_REQUIRES_AT_LEAST_ONE_DESK");}

    @Test void refusesToCloseQueueWithActiveTickets(){MunicipalQueue queue=queue();queue.setStatus(QueueStatus.OPEN);when(queues.findByIdForUpdate(queue.getId())).thenReturn(Optional.of(queue));
        when(tickets.existsByQueueAndStatusIn(eq(queue),anyCollection())).thenReturn(true);
        assertThatThrownBy(()->service.changeStatus(queue.getId(),0L,QueueStatus.CLOSED)).isInstanceOf(ResourceConflictException.class)
                .hasMessage("QUEUE_HAS_ACTIVE_TICKETS");}

    private MunicipalQueue queue(){Department department=Department.builder().id(UUID.randomUUID()).build();MunicipalService municipal=MunicipalService.builder().id(UUID.randomUUID()).department(department).build();
        return MunicipalQueue.builder().id(UUID.randomUUID()).name("Queue").locationCode("BOANE").department(department).service(municipal)
                .mode(QueueMode.APPOINTMENT_REQUIRED).status(QueueStatus.CLOSED).version(0L).build();}
}
