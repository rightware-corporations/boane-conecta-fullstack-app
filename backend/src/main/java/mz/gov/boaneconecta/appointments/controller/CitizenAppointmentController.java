package mz.gov.boaneconecta.appointments.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.appointments.dto.AppointmentResponse;
import mz.gov.boaneconecta.appointments.dto.AppointmentSlotResponse;
import mz.gov.boaneconecta.appointments.dto.CreateAppointmentRequest;
import mz.gov.boaneconecta.appointments.service.AppointmentService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/citizen/appointments")
public class CitizenAppointmentController {
    private final AppointmentService appointmentService;

    public CitizenAppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
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
