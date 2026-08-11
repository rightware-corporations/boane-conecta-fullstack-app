package mz.gov.boaneconecta.municipalservices.repository;

import mz.gov.boaneconecta.municipalservices.entity.ServiceRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ServiceRequirementRepository extends JpaRepository<ServiceRequirement, UUID> {
    List<ServiceRequirement> findByServiceIdOrderByCreatedAtAsc(UUID serviceId);
    List<ServiceRequirement> findByServiceIdInOrderByCreatedAtAsc(Collection<UUID> serviceIds);
    Optional<ServiceRequirement> findByIdAndServiceId(UUID id, UUID serviceId);
}
