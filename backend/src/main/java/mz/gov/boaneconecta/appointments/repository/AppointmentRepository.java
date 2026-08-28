package mz.gov.boaneconecta.appointments.repository;

import mz.gov.boaneconecta.appointments.entity.Appointment;
import mz.gov.boaneconecta.appointments.entity.AppointmentStatus;
import mz.gov.boaneconecta.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Collection;
import mz.gov.boaneconecta.appointments.entity.AppointmentSlot;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByCitizenUserOrderByCreatedAtDesc(User citizenUser);
    Optional<Appointment> findByIdAndCitizenUser(UUID id, User citizenUser);
    List<Appointment> findAllByOrderByCreatedAtDesc();
    List<Appointment> findByStatusOrderByCreatedAtDesc(AppointmentStatus status);
    boolean existsByAppointmentNumber(String appointmentNumber);
    long countBySlotAndStatusIn(AppointmentSlot slot, Collection<AppointmentStatus> statuses);
}
