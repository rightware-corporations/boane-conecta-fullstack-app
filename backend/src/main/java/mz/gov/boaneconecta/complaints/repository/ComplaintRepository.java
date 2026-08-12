package mz.gov.boaneconecta.complaints.repository;

import mz.gov.boaneconecta.complaints.entity.Complaint;
import mz.gov.boaneconecta.complaints.entity.ComplaintStatus;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, UUID> {
    List<Complaint> findByCitizenUserOrderByCreatedAtDesc(User citizenUser);
    Optional<Complaint> findByIdAndCitizenUser(UUID id, User citizenUser);
    List<Complaint> findAllByOrderByCreatedAtDesc();
    List<Complaint> findByStatusOrderByCreatedAtDesc(ComplaintStatus status);
    boolean existsByComplaintNumber(String complaintNumber);
}
