package mz.gov.boaneconecta.municipalservices.repository;

import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface MunicipalServiceRepository extends JpaRepository<MunicipalService, UUID> {
    List<MunicipalService> findAllByOrderByTitleAsc();
    List<MunicipalService> findByStatusOrderByTitleAsc(MunicipalServiceStatus status);
    Optional<MunicipalService> findBySlugAndStatus(String slug, MunicipalServiceStatus status);
    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, UUID id);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select service from MunicipalService service where service.id = :id")
    Optional<MunicipalService> findByIdForUpdate(@Param("id") UUID id);
}
