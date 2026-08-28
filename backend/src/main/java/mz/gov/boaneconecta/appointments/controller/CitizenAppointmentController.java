package mz.gov.boaneconecta.appointments.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.appointments.dto.AppointmentResponse;
import mz.gov.boaneconecta.appointments.dto.AppointmentSlotResponse;
import mz.gov.boaneconecta.appointments.dto.CreateAppointmentRequest;
import mz.gov.boaneconecta.appointments.service.AppointmentService;
import mz.gov.boaneconecta.appointments.service.AppointmentAvailabilityService;
import mz.gov.boaneconecta.appointments.dto.AppointmentAvailabilityResponse;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/v1/citizen/appointments")
public class CitizenAppointmentController {
    private final AppointmentService appointmentService;
    private final AppointmentAvailabilityService availabilityService;

    public CitizenAppointmentController(AppointmentService appointmentService, AppointmentAvailabilityService availabilityService) {
        this.appointmentService = appointmentService;
        this.availabilityService = availabilityService;
    }

    @GetMapping("/availability")
    @PreAuthorize("hasRole('CITIZEN')")
    public ApiResponse<AppointmentAvailabilityResponse> availability(@RequestParam UUID serviceId,
            @RequestParam String locationCode,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.success("Appointment availability retrieved", availabilityService.find(serviceId, locationCode, from, to));
    }

    @GetMapping("/slots")
    public ApiResponse<List<AppointmentSlotResponse>> availableSlots() {
        return ApiResponse.success("Appointment slots retrieved", appointmentService.listAvailableSlots());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponse>> create(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody CreateAppointmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Appointment scheduled", appointmentService.create(principal.getId(), request)));
    }

    @GetMapping
    public ApiResponse<List<AppointmentResponse>> list(@AuthenticationPrincipal UserDetailsImpl principal) {
        return ApiResponse.success("Appointments retrieved", appointmentService.listCitizen(principal.getId()));
    }

    @GetMapping("/{id}")
    public ApiResponse<AppointmentResponse> get(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id) {
        return ApiResponse.success("Appointment retrieved", appointmentService.getCitizen(principal.getId(), id));
    }

    @PatchMapping("/{id}/cancel")
    public ApiResponse<AppointmentResponse> cancel(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id) {
        return ApiResponse.success("Appointment cancelled", appointmentService.cancelCitizen(principal.getId(), id));
    }
}
