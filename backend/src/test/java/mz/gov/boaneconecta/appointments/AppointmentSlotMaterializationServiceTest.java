package mz.gov.boaneconecta.appointments;

import mz.gov.boaneconecta.appointments.entity.*;
import mz.gov.boaneconecta.appointments.repository.*;
import mz.gov.boaneconecta.appointments.service.AppointmentSlotMaterializationService;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import org.junit.jupiter.api.Test;
import java.time.*;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AppointmentSlotMaterializationServiceTest {
    @Test void materializesDeterministicSlotsInMaputoTime() {
        var rules = mock(AppointmentScheduleRuleRepository.class); var slots = mock(AppointmentSlotRepository.class);
        Clock clock = Clock.fixed(Instant.parse("2026-09-01T08:00:00Z"), ZoneId.of("Africa/Maputo"));
        LocalDate date = LocalDate.of(2026, 9, 7);
        var rule = AppointmentScheduleRule.builder().service(MunicipalService.builder().build())
                .department(Department.builder().name("Atendimento").build()).locationCode("CENTRAL")
                .dayOfWeek(date.getDayOfWeek()).startLocalTime(LocalTime.of(9, 0)).endLocalTime(LocalTime.of(10, 0))
                .slotDurationMinutes(30).capacityPerSlot(2).effectiveFrom(date).status(ScheduleRuleStatus.ACTIVE).build();
        when(rules.findByStatusAndEffectiveFromLessThanEqualAndEffectiveUntilIsNullOrStatusAndEffectiveFromLessThanEqualAndEffectiveUntilGreaterThanEqual(any(), any(), any(), any(), any()))
                .thenReturn(List.of(rule));
        var result = new AppointmentSlotMaterializationService(rules, slots, clock).materialize(date, date);
        assertThat(result.created()).isEqualTo(2);
        verify(slots, times(2)).save(argThat(slot -> slot.getCapacity() == 2 && slot.getStartTime().atZone(clock.getZone()).toLocalDate().equals(date)));
        verify(slots).flush();
    }
}
