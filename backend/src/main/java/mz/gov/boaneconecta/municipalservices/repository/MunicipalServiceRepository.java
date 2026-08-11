package mz.gov.boaneconecta.municipalservices.repository;

import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MunicipalServiceRepository extends JpaRepository<MunicipalService, UUID> {
    List<MunicipalService> findAllByOrderByTitleAsc();
    List<MunicipalService> findByStatusOrderByTitleAsc(MunicipalServiceStatus status);
    Optional<MunicipalService> findBySlugAndStatus(String slug, MunicipalServiceStatus status);
    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, UUID id);
}
