package mz.gov.boaneconecta.queue.repository;

import mz.gov.boaneconecta.queue.entity.*;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface QueueStaffScopeRepository extends JpaRepository<QueueStaffScope, UUID> {
    boolean existsByQueueAndStaffUser(MunicipalQueue queue, User staffUser);
    List<QueueStaffScope> findByStaffUserOrderByCreatedAtAsc(User staffUser);
    List<QueueStaffScope> findByQueueOrderByCreatedAtAsc(MunicipalQueue queue);
    Optional<QueueStaffScope> findByQueueAndStaffUser(MunicipalQueue queue, User staffUser);
}
