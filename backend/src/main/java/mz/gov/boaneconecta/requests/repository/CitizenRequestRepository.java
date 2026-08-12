package mz.gov.boaneconecta.requests.repository;

import mz.gov.boaneconecta.requests.entity.CitizenRequest;
import mz.gov.boaneconecta.requests.entity.RequestStatus;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CitizenRequestRepository extends JpaRepository<CitizenRequest, UUID> {
    List<CitizenRequest> findByCitizenUserOrderByCreatedAtDesc(User citizenUser);
    Optional<CitizenRequest> findByIdAndCitizenUser(UUID id, User citizenUser);
    List<CitizenRequest> findAllByOrderByCreatedAtDesc();
    List<CitizenRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);
    boolean existsByRequestNumber(String requestNumber);
}
