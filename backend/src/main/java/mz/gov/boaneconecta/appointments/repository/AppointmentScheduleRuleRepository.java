package mz.gov.boaneconecta.appointments.repository;
import mz.gov.boaneconecta.appointments.entity.AppointmentScheduleRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.time.LocalDate;
import java.util.List;
import mz.gov.boaneconecta.appointments.entity.ScheduleRuleStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
public interface AppointmentScheduleRuleRepository extends JpaRepository<AppointmentScheduleRule, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    List<AppointmentScheduleRule> findByStatusAndEffectiveFromLessThanEqualAndEffectiveUntilIsNullOrStatusAndEffectiveFromLessThanEqualAndEffectiveUntilGreaterThanEqual(
            ScheduleRuleStatus statusOpen, LocalDate toOpen, ScheduleRuleStatus statusBounded, LocalDate toBounded, LocalDate fromBounded);
    List<AppointmentScheduleRule> findAllByOrderByEffectiveFromDescDayOfWeekAscStartLocalTimeAsc();
    List<AppointmentScheduleRule> findByServiceIdAndLocationCodeIgnoreCaseAndDayOfWeekAndStatusNot(
            UUID serviceId, String locationCode, java.time.DayOfWeek dayOfWeek, ScheduleRuleStatus status);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select rule from AppointmentScheduleRule rule where rule.id = :id")
    Optional<AppointmentScheduleRule> findByIdForUpdate(@Param("id") UUID id);
}
