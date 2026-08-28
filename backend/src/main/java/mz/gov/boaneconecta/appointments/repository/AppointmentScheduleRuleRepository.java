package mz.gov.boaneconecta.appointments.repository;
import mz.gov.boaneconecta.appointments.entity.AppointmentScheduleRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.time.LocalDate;
import java.util.List;
import mz.gov.boaneconecta.appointments.entity.ScheduleRuleStatus;
public interface AppointmentScheduleRuleRepository extends JpaRepository<AppointmentScheduleRule, UUID> {
    List<AppointmentScheduleRule> findByStatusAndEffectiveFromLessThanEqualAndEffectiveUntilIsNullOrStatusAndEffectiveFromLessThanEqualAndEffectiveUntilGreaterThanEqual(
            ScheduleRuleStatus statusOpen, LocalDate toOpen, ScheduleRuleStatus statusBounded, LocalDate toBounded, LocalDate fromBounded);
}
