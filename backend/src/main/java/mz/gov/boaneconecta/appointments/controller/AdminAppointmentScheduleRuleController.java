package mz.gov.boaneconecta.appointments.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.appointments.dto.*;
import mz.gov.boaneconecta.appointments.service.AppointmentScheduleRuleAdministrationService;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.requests.draft.service.VersionHeaderParser;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1/admin/appointment-schedule-rules")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
public class AdminAppointmentScheduleRuleController {
    private final AppointmentScheduleRuleAdministrationService service; private final VersionHeaderParser versions;
    public AdminAppointmentScheduleRuleController(AppointmentScheduleRuleAdministrationService service, VersionHeaderParser versions) {
        this.service = service; this.versions = versions;
    }
    @GetMapping public ApiResponse<List<AppointmentScheduleRuleResponse>> list() { return ApiResponse.success("Schedule rules retrieved", service.list()); }
    @PostMapping public ApiResponse<AppointmentScheduleRuleResponse> create(@Valid @RequestBody AppointmentScheduleRuleRequest request) {
        return ApiResponse.success("Schedule rule created", service.create(request));
    }
    @PutMapping("/{id}") public ApiResponse<AppointmentScheduleRuleResponse> update(@PathVariable UUID id,
            @RequestHeader("If-Match") String match, @Valid @RequestBody AppointmentScheduleRuleRequest request) {
        return ApiResponse.success("Schedule rule updated", service.update(id, versions.parse(match), request));
    }
    @PostMapping("/{id}/status") public ApiResponse<AppointmentScheduleRuleResponse> status(@PathVariable UUID id,
            @RequestHeader("If-Match") String match, @Valid @RequestBody ScheduleRuleStatusRequest request) {
        return ApiResponse.success("Schedule rule status updated", service.changeStatus(id, versions.parse(match), request.status()));
    }
}
