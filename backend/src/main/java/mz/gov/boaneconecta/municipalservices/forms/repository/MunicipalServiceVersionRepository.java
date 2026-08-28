package mz.gov.boaneconecta.municipalservices.forms.repository;

import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.municipalservices.forms.entity.DefinitionStatus;
import mz.gov.boaneconecta.municipalservices.forms.entity.MunicipalServiceVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MunicipalServiceVersionRepository extends JpaRepository<MunicipalServiceVersion, UUID> {
    Optional<MunicipalServiceVersion> findByServiceAndStatus(MunicipalService service, DefinitionStatus status);
    List<MunicipalServiceVersion> findAllByServiceAndStatus(MunicipalService service, DefinitionStatus status);
    long countByService(MunicipalService service);
}
