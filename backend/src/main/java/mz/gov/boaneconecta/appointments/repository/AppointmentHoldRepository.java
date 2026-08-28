package mz.gov.boaneconecta.appointments.repository;

import mz.gov.boaneconecta.appointments.entity.*;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.Instant;
import java.util.*;

public interface AppointmentHoldRepository extends JpaRepository<AppointmentHold, UUID> {
    Optional<AppointmentHold> findByIdAndCitizenUser(UUID id, User citizenUser);
    long countBySlotAndStatusAndExpiresAtAfter(AppointmentSlot slot, AppointmentHoldStatus status, Instant now);
    Optional<AppointmentHold> findByCitizenUserAndIdempotencyKeyHash(User user, String hash);
}
