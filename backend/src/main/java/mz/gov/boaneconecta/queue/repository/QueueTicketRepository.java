package mz.gov.boaneconecta.queue.repository;

import mz.gov.boaneconecta.appointments.entity.Appointment;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.queue.entity.QueueTicket;
import mz.gov.boaneconecta.queue.entity.QueueTicketStatus;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.*;

public interface QueueTicketRepository extends JpaRepository<QueueTicket, UUID> {
    Optional<QueueTicket> findByAppointmentAndCitizenUser(Appointment appointment, User citizenUser);
    Optional<QueueTicket> findByIdAndCitizenUser(UUID id, User citizenUser);
    long countByQueueAndBusinessDateAndStatusAndCreatedAtBefore(MunicipalQueue queue, java.time.LocalDate date, QueueTicketStatus status, LocalDateTime createdAt);
    long countByQueueAndBusinessDateAndStatusIn(MunicipalQueue queue, java.time.LocalDate date, Collection<QueueTicketStatus> statuses);
}
