package mz.gov.boaneconecta.roles.repository;

import mz.gov.boaneconecta.roles.entity.Role;
import mz.gov.boaneconecta.roles.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(RoleName name);
}
