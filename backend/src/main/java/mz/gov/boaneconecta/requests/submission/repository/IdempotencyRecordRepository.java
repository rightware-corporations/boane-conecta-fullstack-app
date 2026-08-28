package mz.gov.boaneconecta.requests.submission.repository;

import mz.gov.boaneconecta.requests.submission.entity.IdempotencyRecord;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;
import java.time.Instant;

public interface IdempotencyRecordRepository extends JpaRepository<IdempotencyRecord, UUID> {
    Optional<IdempotencyRecord> findByCitizenUserAndOperationAndKeyHash(User user, String operation, String keyHash);
    long deleteByExpiresAtBefore(Instant now);
}
