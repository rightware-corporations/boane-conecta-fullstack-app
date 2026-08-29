package mz.gov.boaneconecta.appointments.repository;

import mz.gov.boaneconecta.appointments.entity.*;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.time.Instant;
import java.util.*;

public interface AppointmentHoldRepository extends JpaRepository<AppointmentHold, UUID> {
    Optional<AppointmentHold> findByIdAndCitizenUser(UUID id, User citizenUser);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select hold from AppointmentHold hold join fetch hold.slot where hold.id = :id and hold.citizenUser = :citizen")
    Optional<AppointmentHold> findOwnedByIdForUpdate(@Param("id") UUID id, @Param("citizen") User citizen);
    long countBySlotAndStatusAndExpiresAtAfter(AppointmentSlot slot, AppointmentHoldStatus status, Instant now);
    Optional<AppointmentHold> findByCitizenUserAndIdempotencyKeyHash(User user, String hash);
}
