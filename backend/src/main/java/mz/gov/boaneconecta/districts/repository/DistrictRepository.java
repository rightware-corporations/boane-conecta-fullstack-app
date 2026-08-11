package mz.gov.boaneconecta.districts.repository;

import mz.gov.boaneconecta.districts.entity.District;
import mz.gov.boaneconecta.districts.entity.DistrictStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DistrictRepository extends JpaRepository<District, UUID> {
    List<District> findAllByOrderByNameAsc();
    List<District> findByStatusOrderByNameAsc(DistrictStatus status);
    Optional<District> findBySlugAndStatus(String slug, DistrictStatus status);
    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, UUID id);
}
