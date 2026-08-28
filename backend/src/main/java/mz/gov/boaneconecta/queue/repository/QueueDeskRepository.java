package mz.gov.boaneconecta.queue.repository;

import mz.gov.boaneconecta.queue.entity.QueueDesk;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.*;

public interface QueueDeskRepository extends JpaRepository<QueueDesk, UUID> {
    List<QueueDesk> findByQueueOrderByCode(MunicipalQueue queue);
    boolean existsByQueueAndCodeIgnoreCase(MunicipalQueue queue,String code);
    boolean existsByQueueAndCodeIgnoreCaseAndIdNot(MunicipalQueue queue,String code,UUID id);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select desk from QueueDesk desk join fetch desk.queue where desk.id = :deskId and desk.queue.id = :queueId")
    Optional<QueueDesk> findByQueueForUpdate(@Param("queueId") UUID queueId, @Param("deskId") UUID deskId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select desk from QueueDesk desk join fetch desk.queue where desk.id = :id")
    Optional<QueueDesk> findByIdForUpdate(@Param("id") UUID id);
}
