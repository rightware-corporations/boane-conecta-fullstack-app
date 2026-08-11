package mz.gov.boaneconecta.departments.repository;

import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.departments.entity.DepartmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, UUID> {
    List<Department> findAllByOrderByNameAsc();
    List<Department> findByStatusOrderByNameAsc(DepartmentStatus status);
    Optional<Department> findBySlugAndStatus(String slug, DepartmentStatus status);
    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, UUID id);
}
