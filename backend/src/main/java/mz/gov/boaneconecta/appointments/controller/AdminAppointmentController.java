package mz.gov.boaneconecta.appointments.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.appointments.dto.AppointmentResponse;
import mz.gov.boaneconecta.appointments.dto.ChangeAppointmentRequest;
import mz.gov.boaneconecta.appointments.entity.AppointmentStatus;
import mz.gov.boaneconecta.appointments.service.AppointmentService;
import mz.gov.boaneconecta.appointments.service.AppointmentSlotMaterializationService;
import mz.gov.boaneconecta.appointments.dto.SlotMaterializationResponse;
import mz.gov.boaneconecta.core.response.ApiResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
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

    public AdminAppointmentController(AppointmentService appointmentService, AppointmentSlotMaterializationService materializationService) {
        this.appointmentService = appointmentService;
        this.materializationService = materializationService;
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

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE')")
    public ApiResponse<AppointmentResponse> changeStatus(
            @PathVariable UUID id,
            @Valid @RequestBody ChangeAppointmentRequest request) {
        return ApiResponse.success("Appointment status updated", appointmentService.changeStatus(id, request));
    }
}
