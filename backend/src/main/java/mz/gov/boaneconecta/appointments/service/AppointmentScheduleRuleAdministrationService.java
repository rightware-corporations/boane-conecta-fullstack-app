package mz.gov.boaneconecta.appointments.service;

import mz.gov.boaneconecta.appointments.dto.*;
import mz.gov.boaneconecta.appointments.entity.*;
import mz.gov.boaneconecta.appointments.repository.AppointmentScheduleRuleRepository;
import mz.gov.boaneconecta.core.exception.*;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.departments.repository.DepartmentRepository;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.municipalservices.repository.MunicipalServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;

@Service
public class AppointmentScheduleRuleAdministrationService {
    private final AppointmentScheduleRuleRepository rules;
    private final MunicipalServiceRepository services;
    private final DepartmentRepository departments;

    public AppointmentScheduleRuleAdministrationService(AppointmentScheduleRuleRepository rules,
            MunicipalServiceRepository services, DepartmentRepository departments) {
        this.rules = rules; this.services = services; this.departments = departments;
    }

    @Transactional(readOnly = true)
    public List<AppointmentScheduleRuleResponse> list() {
        return rules.findAllByOrderByEffectiveFromDescDayOfWeekAscStartLocalTimeAsc().stream().map(this::response).toList();
    }

    @Transactional
    public AppointmentScheduleRuleResponse create(AppointmentScheduleRuleRequest request) {
        MunicipalService service = service(request.serviceId()); Department department = department(request.departmentId());
        validate(request, service, department, null);
        AppointmentScheduleRule rule = AppointmentScheduleRule.builder().service(service).department(department)
                .locationCode(code(request.locationCode())).dayOfWeek(request.dayOfWeek())
                .startLocalTime(request.startLocalTime()).endLocalTime(request.endLocalTime())
                .slotDurationMinutes(request.slotDurationMinutes()).capacityPerSlot(request.capacityPerSlot())
                .effectiveFrom(request.effectiveFrom()).effectiveUntil(request.effectiveUntil()).status(ScheduleRuleStatus.DRAFT).build();
        return response(rules.saveAndFlush(rule));
    }

    @Transactional
    public AppointmentScheduleRuleResponse update(UUID id, long expectedVersion, AppointmentScheduleRuleRequest request) {
        AppointmentScheduleRule rule = locked(id); requireVersion(rule, expectedVersion);
        if (rule.getStatus() == ScheduleRuleStatus.ACTIVE || rule.getStatus() == ScheduleRuleStatus.RETIRED)
            throw new ResourceConflictException("SCHEDULE_RULE_NOT_EDITABLE_IN_CURRENT_STATUS");
        MunicipalService service = service(request.serviceId()); Department department = department(request.departmentId());
        validate(request, service, department, id);
        rule.setService(service); rule.setDepartment(department); rule.setLocationCode(code(request.locationCode()));
        rule.setDayOfWeek(request.dayOfWeek()); rule.setStartLocalTime(request.startLocalTime()); rule.setEndLocalTime(request.endLocalTime());
        rule.setSlotDurationMinutes(request.slotDurationMinutes()); rule.setCapacityPerSlot(request.capacityPerSlot());
        rule.setEffectiveFrom(request.effectiveFrom()); rule.setEffectiveUntil(request.effectiveUntil());
        return response(rules.saveAndFlush(rule));
    }

    @Transactional
    public AppointmentScheduleRuleResponse changeStatus(UUID id, long expectedVersion, ScheduleRuleStatus target) {
        AppointmentScheduleRule rule = locked(id); requireVersion(rule, expectedVersion);
        ScheduleRuleStatus current = rule.getStatus(); if (current == target) return response(rule);
        boolean allowed = (current == ScheduleRuleStatus.DRAFT && (target == ScheduleRuleStatus.ACTIVE || target == ScheduleRuleStatus.RETIRED))
                || (current == ScheduleRuleStatus.ACTIVE && target == ScheduleRuleStatus.SUSPENDED)
                || (current == ScheduleRuleStatus.SUSPENDED && (target == ScheduleRuleStatus.ACTIVE || target == ScheduleRuleStatus.RETIRED));
        if (!allowed) throw new ResourceConflictException("SCHEDULE_RULE_INVALID_STATUS_TRANSITION");
        if (target == ScheduleRuleStatus.ACTIVE) validate(toRequest(rule), rule.getService(), rule.getDepartment(), rule.getId());
        rule.setStatus(target); return response(rules.saveAndFlush(rule));
    }

    private void validate(AppointmentScheduleRuleRequest request, MunicipalService service, Department department, UUID currentId) {
        if (service.getDepartment() == null || !service.getDepartment().getId().equals(department.getId()))
            throw new ResourceConflictException("SCHEDULE_RULE_SERVICE_DEPARTMENT_MISMATCH");
        if (!request.startLocalTime().isBefore(request.endLocalTime())) throw new IllegalArgumentException("SCHEDULE_RULE_INVALID_TIME_RANGE");
        long windowMinutes = Duration.between(request.startLocalTime(), request.endLocalTime()).toMinutes();
        if (request.slotDurationMinutes() > windowMinutes) throw new IllegalArgumentException("SCHEDULE_RULE_SLOT_EXCEEDS_TIME_RANGE");
        if (request.effectiveUntil() != null && request.effectiveUntil().isBefore(request.effectiveFrom()))
            throw new IllegalArgumentException("SCHEDULE_RULE_INVALID_EFFECTIVE_RANGE");
        String location = code(request.locationCode());
        boolean overlaps = rules.findByServiceIdAndLocationCodeIgnoreCaseAndDayOfWeekAndStatusNot(
                service.getId(), location, request.dayOfWeek(), ScheduleRuleStatus.RETIRED).stream()
                .filter(other -> !other.getId().equals(currentId)).anyMatch(other -> datesOverlap(request.effectiveFrom(), request.effectiveUntil(), other.getEffectiveFrom(), other.getEffectiveUntil())
                        && timesOverlap(request.startLocalTime(), request.endLocalTime(), other.getStartLocalTime(), other.getEndLocalTime()));
        if (overlaps) throw new ResourceConflictException("SCHEDULE_RULE_OVERLAPS_EXISTING_RULE");
    }

    private boolean datesOverlap(LocalDate aStart, LocalDate aEnd, LocalDate bStart, LocalDate bEnd) {
        return (bEnd == null || !aStart.isAfter(bEnd)) && (aEnd == null || !bStart.isAfter(aEnd));
    }
    private boolean timesOverlap(LocalTime aStart, LocalTime aEnd, LocalTime bStart, LocalTime bEnd) {
        return aStart.isBefore(bEnd) && bStart.isBefore(aEnd);
    }
    private AppointmentScheduleRuleRequest toRequest(AppointmentScheduleRule r) { return new AppointmentScheduleRuleRequest(
            r.getService().getId(), r.getDepartment().getId(), r.getLocationCode(), r.getDayOfWeek(), r.getStartLocalTime(),
            r.getEndLocalTime(), r.getSlotDurationMinutes(), r.getCapacityPerSlot(), r.getEffectiveFrom(), r.getEffectiveUntil()); }
    private AppointmentScheduleRule locked(UUID id) { return rules.findByIdForUpdate(id).orElseThrow(() -> new ResourceNotFoundException("SCHEDULE_RULE_NOT_FOUND")); }
    private MunicipalService service(UUID id) { return services.findByIdForUpdate(id).orElseThrow(() -> new ResourceNotFoundException("SERVICE_NOT_FOUND")); }
    private Department department(UUID id) { return departments.findById(id).orElseThrow(() -> new ResourceNotFoundException("DEPARTMENT_NOT_FOUND")); }
    private void requireVersion(AppointmentScheduleRule rule, long expected) { if (!Objects.equals(rule.getVersion(), expected)) throw new ResourceConflictException("SCHEDULE_RULE_VERSION_MISMATCH"); }
    private String code(String value) { return value.trim().toUpperCase(Locale.ROOT); }
    private AppointmentScheduleRuleResponse response(AppointmentScheduleRule r) { return new AppointmentScheduleRuleResponse(r.getId(), r.getService().getId(),
            r.getService().getTitle(), r.getDepartment().getId(), r.getDepartment().getName(), r.getLocationCode(), r.getDayOfWeek(),
            r.getStartLocalTime(), r.getEndLocalTime(), r.getSlotDurationMinutes(), r.getCapacityPerSlot(), r.getEffectiveFrom(),
            r.getEffectiveUntil(), r.getStatus(), r.getVersion()); }
}
