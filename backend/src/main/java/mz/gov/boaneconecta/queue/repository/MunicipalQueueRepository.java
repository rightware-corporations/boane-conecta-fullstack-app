package mz.gov.boaneconecta.queue.repository;

import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.queue.entity.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.*;

public interface MunicipalQueueRepository extends JpaRepository<MunicipalQueue, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select queue from MunicipalQueue queue where queue.service = :service and queue.locationCode = :location and queue.status = :status")
    List<MunicipalQueue> findOpenForUpdate(@Param("service") MunicipalService service,
            @Param("location") String location, @Param("status") QueueStatus status);
}
