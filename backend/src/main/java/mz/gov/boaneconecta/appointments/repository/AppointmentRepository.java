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
    List<Appointment> findAllByOrderByCreatedAtDesc();
    List<Appointment> findByStatusOrderByCreatedAtDesc(AppointmentStatus status);
    boolean existsByAppointmentNumber(String appointmentNumber);
    long countBySlotAndStatusIn(AppointmentSlot slot, Collection<AppointmentStatus> statuses);
}
