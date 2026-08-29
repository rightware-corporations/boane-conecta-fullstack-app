package mz.gov.boaneconecta.appointments.repository;

import mz.gov.boaneconecta.appointments.entity.Appointment;
import mz.gov.boaneconecta.appointments.entity.AppointmentStatus;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Collection;
import mz.gov.boaneconecta.appointments.entity.AppointmentSlot;
import mz.gov.boaneconecta.queue.entity.QueueStaffScope;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByCitizenUserOrderByCreatedAtDesc(User citizenUser);
    Optional<Appointment> findByIdAndCitizenUser(UUID id, User citizenUser);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select appointment from Appointment appointment join fetch appointment.slot where appointment.id = :id and appointment.citizenUser = :citizen")
    Optional<Appointment> findOwnedByIdForUpdate(@Param("id") UUID id, @Param("citizen") User citizen);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select appointment from Appointment appointment join fetch appointment.slot where appointment.id = :id")
    Optional<Appointment> findByIdForUpdate(@Param("id") UUID id);
    @Query("""
            select appointment from Appointment appointment join fetch appointment.slot slot
            where (:status is null or appointment.status = :status)
              and exists (select scope.id from QueueStaffScope scope
                  where scope.staffUser = :actor and scope.queue.service = slot.service
                    and upper(scope.queue.locationCode) = upper(slot.locationCode))
            order by appointment.createdAt desc
            """)
    List<Appointment> findScopedAgenda(@Param("actor") User actor, @Param("status") AppointmentStatus status);
    @Query("""
            select appointment from Appointment appointment join fetch appointment.slot slot
            where appointment.id = :id
              and exists (select scope.id from QueueStaffScope scope
                  where scope.staffUser = :actor and scope.queue.service = slot.service
                    and upper(scope.queue.locationCode) = upper(slot.locationCode))
            """)
    Optional<Appointment> findScopedById(@Param("id") UUID id, @Param("actor") User actor);
    boolean existsByAppointmentNumber(String appointmentNumber);
    long countBySlotAndStatusIn(AppointmentSlot slot, Collection<AppointmentStatus> statuses);
}
