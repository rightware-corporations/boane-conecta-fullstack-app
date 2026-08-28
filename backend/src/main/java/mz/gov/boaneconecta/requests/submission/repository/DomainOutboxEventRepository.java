package mz.gov.boaneconecta.requests.submission.repository;

import mz.gov.boaneconecta.requests.submission.entity.DomainOutboxEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import jakarta.persistence.LockModeType;
import org.springframework.data.repository.query.Param;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface DomainOutboxEventRepository extends JpaRepository<DomainOutboxEvent, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select e from DomainOutboxEvent e where e.status = 'PENDING' and e.nextAttemptAt <= :now order by e.occurredAt")
    List<DomainOutboxEvent> findDispatchBatch(@Param("now") Instant now, Pageable pageable);
}
