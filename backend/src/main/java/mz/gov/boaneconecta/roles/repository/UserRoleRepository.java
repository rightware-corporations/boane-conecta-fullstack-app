package mz.gov.boaneconecta.roles.repository;

import mz.gov.boaneconecta.roles.entity.UserRole;
import mz.gov.boaneconecta.roles.entity.Role;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRole.UserRoleId> {
    List<UserRole> findByUser(User user);
    boolean existsByUserAndRole(User user, Role role);
}
