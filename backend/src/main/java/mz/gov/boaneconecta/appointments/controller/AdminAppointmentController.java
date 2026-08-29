package mz.gov.boaneconecta.appointments.controller;

import mz.gov.boaneconecta.appointments.dto.AppointmentResponse;
import mz.gov.boaneconecta.appointments.entity.AppointmentStatus;
import mz.gov.boaneconecta.appointments.service.AppointmentService;
import mz.gov.boaneconecta.appointments.service.AppointmentSlotMaterializationService;
import mz.gov.boaneconecta.appointments.dto.SlotMaterializationResponse;
import mz.gov.boaneconecta.appointments.dto.CheckInResponse;
import mz.gov.boaneconecta.appointments.service.AppointmentCheckInService;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/v1/admin/appointments")
public class AdminAppointmentController {
    private final AppointmentService appointmentService;
    private final AppointmentSlotMaterializationService materializationService;
    private final AppointmentCheckInService checkInService;

    public AdminAppointmentController(AppointmentService appointmentService, AppointmentSlotMaterializationService materializationService,
            AppointmentCheckInService checkInService) {
        this.appointmentService = appointmentService;
        this.materializationService = materializationService;
        this.checkInService = checkInService;
    }

    @PostMapping("/slots/materialize")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ApiResponse<SlotMaterializationResponse> materialize(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.success("Appointment slots materialized", materializationService.materialize(from, to));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ApiResponse<List<AppointmentResponse>> list(@RequestParam(required = false) AppointmentStatus status) {
        return ApiResponse.success("Appointments retrieved", appointmentService.listAdmin(status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ApiResponse<AppointmentResponse> get(@PathVariable UUID id) {
        return ApiResponse.success("Appointment retrieved", appointmentService.getAdmin(id));
    }

    @PostMapping("/{id}/check-in")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ApiResponse<CheckInResponse> assistedCheckIn(@AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id, @RequestHeader("Idempotency-Key") String idempotencyKey) {
        return ApiResponse.success("Appointment checked in with staff assistance",
                checkInService.assistedCheckIn(principal.getId(), id, idempotencyKey));
    }
}
