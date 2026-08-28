package mz.gov.boaneconecta.citizens.repository;

import mz.gov.boaneconecta.citizens.entity.CitizenProfile;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface CitizenProfileRepository extends JpaRepository<CitizenProfile, UUID> {
    Optional<CitizenProfile> findByUser(User user);
}
