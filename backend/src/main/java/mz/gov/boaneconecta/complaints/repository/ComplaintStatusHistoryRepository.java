package mz.gov.boaneconecta.complaints.repository;

import mz.gov.boaneconecta.complaints.entity.Complaint;
import mz.gov.boaneconecta.complaints.entity.ComplaintStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ComplaintStatusHistoryRepository extends JpaRepository<ComplaintStatusHistory, UUID> {
    List<ComplaintStatusHistory> findByComplaintOrderByCreatedAtAsc(Complaint complaint);
}
