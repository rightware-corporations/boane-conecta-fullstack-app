package mz.gov.boaneconecta.queue.repository;

import mz.gov.boaneconecta.queue.entity.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.*;

public interface ServiceSessionRepository extends JpaRepository<ServiceSession, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select session from ServiceSession session join fetch session.queueTicket join fetch session.desk where session.id = :id")
    Optional<ServiceSession> findByIdForUpdate(@Param("id") UUID id);
    boolean existsByDeskAndStatus(QueueDesk desk, ServiceSessionStatus status);
    Optional<ServiceSession> findByDeskAndStatus(QueueDesk desk, ServiceSessionStatus status);
}
