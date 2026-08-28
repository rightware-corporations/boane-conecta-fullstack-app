package mz.gov.boaneconecta.municipalservices.forms.repository;

import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.municipalservices.forms.entity.ServiceFormDefinition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ServiceFormDefinitionRepository extends JpaRepository<ServiceFormDefinition, UUID> {
    Optional<ServiceFormDefinition> findByServiceAndDefinitionKey(MunicipalService service, String definitionKey);
}
