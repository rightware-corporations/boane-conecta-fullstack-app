package mz.gov.boaneconecta.municipalservices.repository;

import mz.gov.boaneconecta.municipalservices.entity.ServiceFee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ServiceFeeRepository extends JpaRepository<ServiceFee, UUID> {
    List<ServiceFee> findByServiceIdOrderByCreatedAtAsc(UUID serviceId);
    List<ServiceFee> findByServiceIdInOrderByCreatedAtAsc(Collection<UUID> serviceIds);
    Optional<ServiceFee> findByIdAndServiceId(UUID id, UUID serviceId);
}
