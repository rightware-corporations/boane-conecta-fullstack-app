package mz.gov.boaneconecta.appointments;

import mz.gov.boaneconecta.appointments.dto.AppointmentScheduleRuleRequest;
import mz.gov.boaneconecta.appointments.entity.*;
import mz.gov.boaneconecta.appointments.repository.AppointmentScheduleRuleRepository;
import mz.gov.boaneconecta.appointments.service.AppointmentScheduleRuleAdministrationService;
import mz.gov.boaneconecta.core.exception.ResourceConflictException;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.departments.repository.DepartmentRepository;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.municipalservices.repository.MunicipalServiceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.time.*;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AppointmentScheduleRuleAdministrationServiceTest {
    private final AppointmentScheduleRuleRepository rules = mock(AppointmentScheduleRuleRepository.class);
    private final MunicipalServiceRepository services = mock(MunicipalServiceRepository.class);
    private final DepartmentRepository departments = mock(DepartmentRepository.class);
    private final AppointmentScheduleRuleAdministrationService administration =
            new AppointmentScheduleRuleAdministrationService(rules, services, departments);
    private Department department;
    private MunicipalService service;

    @BeforeEach void setUp() {
        department = Department.builder().id(UUID.randomUUID()).name("Atendimento").build();
        service = MunicipalService.builder().id(UUID.randomUUID()).title("Licenciamento").department(department).build();
        when(departments.findById(department.getId())).thenReturn(Optional.of(department));
        when(services.findByIdForUpdate(service.getId())).thenReturn(Optional.of(service));
        when(rules.findByServiceIdAndLocationCodeIgnoreCaseAndDayOfWeekAndStatusNot(any(), any(), any(), any())).thenReturn(List.of());
        when(rules.saveAndFlush(any())).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test void createsNormalizedDraftAfterBusinessValidation() {
        var response = administration.create(request(" central ", LocalTime.of(8, 0), LocalTime.of(12, 0)));
        assertThat(response.locationCode()).isEqualTo("CENTRAL");
        assertThat(response.status()).isEqualTo(ScheduleRuleStatus.DRAFT);
        verify(rules).saveAndFlush(argThat(rule -> rule.getCapacityPerSlot() == 2 && rule.getSlotDurationMinutes() == 30));
    }

    @Test void rejectsServiceFromAnotherDepartment() {
        Department other = Department.builder().id(UUID.randomUUID()).name("Finanças").build();
        when(departments.findById(other.getId())).thenReturn(Optional.of(other));
        var command = new AppointmentScheduleRuleRequest(service.getId(), other.getId(), "CENTRAL", DayOfWeek.MONDAY,
                LocalTime.of(8, 0), LocalTime.of(12, 0), 30, 2, LocalDate.of(2026, 9, 1), null);
        assertThatThrownBy(() -> administration.create(command)).isInstanceOf(ResourceConflictException.class)
                .hasMessage("SCHEDULE_RULE_SERVICE_DEPARTMENT_MISMATCH");
        verify(rules, never()).saveAndFlush(any());
    }

    @Test void rejectsOverlappingRuleForSameServiceLocationAndWeekday() {
        AppointmentScheduleRule existing = rule(ScheduleRuleStatus.ACTIVE, 3L);
        existing.setId(UUID.randomUUID());
        when(rules.findByServiceIdAndLocationCodeIgnoreCaseAndDayOfWeekAndStatusNot(any(), any(), any(), any())).thenReturn(List.of(existing));
        assertThatThrownBy(() -> administration.create(request("CENTRAL", LocalTime.of(10, 0), LocalTime.of(13, 0))))
                .isInstanceOf(ResourceConflictException.class).hasMessage("SCHEDULE_RULE_OVERLAPS_EXISTING_RULE");
    }

    @Test void enforcesVersionAndStatusTransitionPolicy() {
        AppointmentScheduleRule active = rule(ScheduleRuleStatus.ACTIVE, 7L); active.setId(UUID.randomUUID());
        when(rules.findByIdForUpdate(active.getId())).thenReturn(Optional.of(active));
        assertThatThrownBy(() -> administration.changeStatus(active.getId(), 6L, ScheduleRuleStatus.SUSPENDED))
                .isInstanceOf(ResourceConflictException.class).hasMessage("SCHEDULE_RULE_VERSION_MISMATCH");
        assertThatThrownBy(() -> administration.changeStatus(active.getId(), 7L, ScheduleRuleStatus.RETIRED))
                .isInstanceOf(ResourceConflictException.class).hasMessage("SCHEDULE_RULE_INVALID_STATUS_TRANSITION");
        administration.changeStatus(active.getId(), 7L, ScheduleRuleStatus.SUSPENDED);
        assertThat(active.getStatus()).isEqualTo(ScheduleRuleStatus.SUSPENDED);
    }

    private AppointmentScheduleRuleRequest request(String location, LocalTime start, LocalTime end) {
        return new AppointmentScheduleRuleRequest(service.getId(), department.getId(), location, DayOfWeek.MONDAY,
                start, end, 30, 2, LocalDate.of(2026, 9, 1), LocalDate.of(2026, 12, 31));
    }
    private AppointmentScheduleRule rule(ScheduleRuleStatus status, Long version) {
        return AppointmentScheduleRule.builder().service(service).department(department).locationCode("CENTRAL")
                .dayOfWeek(DayOfWeek.MONDAY).startLocalTime(LocalTime.of(8, 0)).endLocalTime(LocalTime.of(12, 0))
                .slotDurationMinutes(30).capacityPerSlot(2).effectiveFrom(LocalDate.of(2026, 9, 1))
                .effectiveUntil(LocalDate.of(2026, 12, 31)).status(status).version(version).build();
    }
}
