package mz.gov.boaneconecta.appointments.repository;

import mz.gov.boaneconecta.appointments.entity.AppointmentSlot;
import mz.gov.boaneconecta.appointments.entity.AppointmentScheduleRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.time.Instant;
import java.util.List;

import java.util.UUID;

@Repository
public interface AppointmentSlotRepository extends JpaRepository<AppointmentSlot, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select slot from AppointmentSlot slot where slot.id = :id")
    Optional<AppointmentSlot> findByIdForUpdate(@Param("id") UUID id);

    @Query(value = """
        SELECT s.id AS slotId, s.start_time AS startsAt, s.end_time AS endsAt,
               s.location_code AS locationCode, s.location_name AS locationName,
               GREATEST(s.capacity
                 - (SELECT COUNT(*) FROM appointments a WHERE a.slot_id = s.id
                    AND a.status IN ('CONFIRMED','CHECKED_IN','WAITING','CALLED','IN_SERVICE'))
                 - (SELECT COUNT(*) FROM appointment_holds h WHERE h.slot_id = s.id
                    AND h.status = 'ACTIVE' AND h.expires_at > :now), 0) AS remainingCapacity
        FROM appointment_slots s
        WHERE s.service_id = :serviceId AND s.location_code = :locationCode
          AND s.start_time >= :fromTime AND s.start_time < :toTime
          AND s.start_time > :now AND s.status = 'AVAILABLE'
        ORDER BY s.start_time
        """, nativeQuery = true)
    List<AvailabilityRow> findAvailability(@Param("serviceId") UUID serviceId,
            @Param("locationCode") String locationCode, @Param("fromTime") Instant fromTime,
            @Param("toTime") Instant toTime, @Param("now") Instant now);
    boolean existsByScheduleRuleAndStartTime(AppointmentScheduleRule rule, Instant startTime);

    interface AvailabilityRow {
        UUID getSlotId(); Instant getStartsAt(); Instant getEndsAt();
        String getLocationCode(); String getLocationName(); Long getRemainingCapacity();
    }
}
