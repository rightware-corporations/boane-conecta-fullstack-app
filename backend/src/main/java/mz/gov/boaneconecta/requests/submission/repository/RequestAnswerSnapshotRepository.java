package mz.gov.boaneconecta.requests.submission.repository;

import mz.gov.boaneconecta.requests.submission.entity.RequestAnswerSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RequestAnswerSnapshotRepository extends JpaRepository<RequestAnswerSnapshot, UUID> {}
