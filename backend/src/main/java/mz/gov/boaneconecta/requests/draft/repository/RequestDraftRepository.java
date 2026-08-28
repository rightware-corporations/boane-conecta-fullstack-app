package mz.gov.boaneconecta.requests.draft.repository;

import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraft;
import mz.gov.boaneconecta.requests.draft.entity.RequestDraftStatus;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RequestDraftRepository extends JpaRepository<RequestDraft, UUID> {
    Optional<RequestDraft> findByIdAndCitizenUser(UUID id, User citizenUser);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select d from RequestDraft d where d.id = :id and d.citizenUser = :citizenUser")
    Optional<RequestDraft> findLockedByIdAndCitizenUser(
            @Param("id") UUID id,
            @Param("citizenUser") User citizenUser);
    List<RequestDraft> findByCitizenUserAndServiceAndStatusInOrderByUpdatedAtDesc(
            User citizenUser,
            MunicipalService service,
            List<RequestDraftStatus> statuses);
    List<RequestDraft> findByStatusInAndExpiresAtBefore(List<RequestDraftStatus> statuses, Instant now);
}
