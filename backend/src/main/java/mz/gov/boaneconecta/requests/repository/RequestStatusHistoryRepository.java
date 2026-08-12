package mz.gov.boaneconecta.requests.repository;

import mz.gov.boaneconecta.requests.entity.CitizenRequest;
import mz.gov.boaneconecta.requests.entity.RequestStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RequestStatusHistoryRepository extends JpaRepository<RequestStatusHistory, UUID> {
    List<RequestStatusHistory> findByRequestOrderByCreatedAtAsc(CitizenRequest request);
}
