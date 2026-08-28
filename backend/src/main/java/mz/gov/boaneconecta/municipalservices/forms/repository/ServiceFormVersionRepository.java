package mz.gov.boaneconecta.municipalservices.forms.repository;

import mz.gov.boaneconecta.municipalservices.forms.entity.DefinitionStatus;
import mz.gov.boaneconecta.municipalservices.forms.entity.ServiceFormDefinition;
import mz.gov.boaneconecta.municipalservices.forms.entity.ServiceFormVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ServiceFormVersionRepository extends JpaRepository<ServiceFormVersion, UUID> {
    Optional<ServiceFormVersion> findByDefinitionAndStatus(ServiceFormDefinition definition, DefinitionStatus status);
    List<ServiceFormVersion> findAllByDefinitionAndStatus(ServiceFormDefinition definition, DefinitionStatus status);
    long countByDefinition(ServiceFormDefinition definition);
}
