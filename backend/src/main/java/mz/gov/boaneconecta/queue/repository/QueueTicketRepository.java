package mz.gov.boaneconecta.queue.repository;

import mz.gov.boaneconecta.appointments.entity.Appointment;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.queue.entity.QueueTicket;
import mz.gov.boaneconecta.queue.entity.QueueTicketStatus;
import mz.gov.boaneconecta.queue.entity.MunicipalQueue;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.*;

public interface QueueTicketRepository extends JpaRepository<QueueTicket, UUID> {
    Optional<QueueTicket> findByAppointmentAndCitizenUser(Appointment appointment, User citizenUser);
    Optional<QueueTicket> findByIdAndCitizenUser(UUID id, User citizenUser);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select ticket from QueueTicket ticket where ticket.id = :id")
    Optional<QueueTicket> findByIdForUpdate(@Param("id") UUID id);
    @Query(value = """
        SELECT * FROM queue_tickets
        WHERE queue_id = :queueId AND business_date = :businessDate AND status = 'WAITING'
        ORDER BY CASE priority_class WHEN 'SPECIAL_OPERATIONAL' THEN 0 WHEN 'PRIORITY_ELIGIBLE' THEN 1 ELSE 2 END,
                 sequence_number
        FOR UPDATE SKIP LOCKED LIMIT 1
        """, nativeQuery = true)
    Optional<QueueTicket> findNextWaitingForUpdate(@Param("queueId") UUID queueId,
            @Param("businessDate") java.time.LocalDate businessDate);
    @Query(value = """
        SELECT * FROM queue_tickets
        WHERE queue_id = :queueId AND business_date = :businessDate AND status = 'WAITING'
        ORDER BY CASE priority_class WHEN 'SPECIAL_OPERATIONAL' THEN 0 WHEN 'PRIORITY_ELIGIBLE' THEN 1 ELSE 2 END,
                 sequence_number
        """, nativeQuery = true)
    List<QueueTicket> findWaitingSnapshot(@Param("queueId") UUID queueId,
            @Param("businessDate") java.time.LocalDate businessDate);
    boolean existsByCalledDeskAndStatusIn(mz.gov.boaneconecta.queue.entity.QueueDesk desk,
            Collection<QueueTicketStatus> statuses);
    boolean existsByQueueAndStatusIn(MunicipalQueue queue, Collection<QueueTicketStatus> statuses);
    List<QueueTicket> findByQueueIdAndStatusInOrderByCalledAtDesc(UUID queueId, Collection<QueueTicketStatus> statuses);
    @Query(value = """
        SELECT COUNT(*) FROM queue_tickets other
        WHERE other.queue_id = :queueId AND other.business_date = :businessDate AND other.status = 'WAITING'
          AND (CASE other.priority_class WHEN 'SPECIAL_OPERATIONAL' THEN 0 WHEN 'PRIORITY_ELIGIBLE' THEN 1 ELSE 2 END
             < :priorityRank OR
             (CASE other.priority_class WHEN 'SPECIAL_OPERATIONAL' THEN 0 WHEN 'PRIORITY_ELIGIBLE' THEN 1 ELSE 2 END
              = :priorityRank AND other.sequence_number < :sequence))
        """, nativeQuery = true)
    long countAhead(@Param("queueId") UUID queueId,@Param("businessDate") java.time.LocalDate businessDate,
            @Param("priorityRank") int priorityRank,@Param("sequence") int sequence);
    long countByQueueAndBusinessDateAndStatusAndCreatedAtBefore(MunicipalQueue queue, java.time.LocalDate date, QueueTicketStatus status, Instant createdAt);
    long countByQueueAndBusinessDateAndStatusIn(MunicipalQueue queue, java.time.LocalDate date, Collection<QueueTicketStatus> statuses);
}
