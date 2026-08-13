package mz.gov.boaneconecta.appointments.repository;

import mz.gov.boaneconecta.appointments.entity.AppointmentSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AppointmentSlotRepository extends JpaRepository<AppointmentSlot, UUID> {
}
