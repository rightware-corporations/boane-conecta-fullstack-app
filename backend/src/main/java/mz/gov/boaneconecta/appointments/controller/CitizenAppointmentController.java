package mz.gov.boaneconecta.appointments.controller;

import mz.gov.boaneconecta.appointments.dto.AppointmentResponse;
import mz.gov.boaneconecta.appointments.service.AppointmentService;
import mz.gov.boaneconecta.appointments.service.AppointmentAvailabilityService;
import mz.gov.boaneconecta.appointments.dto.AppointmentAvailabilityResponse;
import mz.gov.boaneconecta.appointments.dto.AppointmentConfirmationResponse;
import mz.gov.boaneconecta.appointments.dto.CancelAppointmentRequest;
import mz.gov.boaneconecta.appointments.dto.RescheduleAppointmentRequest;
import mz.gov.boaneconecta.appointments.service.AppointmentLifecycleService;
import mz.gov.boaneconecta.appointments.service.AppointmentCheckInService;
import mz.gov.boaneconecta.appointments.dto.CheckInRequest;
import mz.gov.boaneconecta.appointments.dto.CheckInResponse;
import mz.gov.boaneconecta.requests.draft.service.VersionHeaderParser;
import jakarta.validation.Valid;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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
    private final AppointmentLifecycleService lifecycleService;
    private final VersionHeaderParser versionHeaderParser;
    private final AppointmentCheckInService checkInService;

    public CitizenAppointmentController(AppointmentService appointmentService, AppointmentAvailabilityService availabilityService,
            AppointmentLifecycleService lifecycleService, VersionHeaderParser versionHeaderParser,
            AppointmentCheckInService checkInService) {
        this.appointmentService = appointmentService; this.availabilityService = availabilityService;
        this.lifecycleService = lifecycleService; this.versionHeaderParser = versionHeaderParser; this.checkInService = checkInService;
    }

    @GetMapping("/availability")
    @PreAuthorize("hasRole('CITIZEN')")
    public ApiResponse<AppointmentAvailabilityResponse> availability(@RequestParam UUID serviceId,
            @RequestParam String locationCode,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ApiResponse.success("Appointment availability retrieved", availabilityService.find(serviceId, locationCode, from, to));
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

    @PostMapping("/{id}/cancel")
    public ApiResponse<AppointmentConfirmationResponse> cancel(@AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id, @RequestHeader("Idempotency-Key") String idempotencyKey,
            @RequestHeader("If-Match") String ifMatch, @Valid @RequestBody CancelAppointmentRequest request) {
        return ApiResponse.success("Appointment cancelled", lifecycleService.cancel(principal.getId(), id,
                request.reason(), idempotencyKey, versionHeaderParser.parse(ifMatch)));
    }

    @PostMapping("/{id}/reschedule")
    public ApiResponse<AppointmentConfirmationResponse> reschedule(@AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id, @RequestHeader("Idempotency-Key") String idempotencyKey,
            @RequestHeader("If-Match") String ifMatch, @Valid @RequestBody RescheduleAppointmentRequest request) {
        return ApiResponse.success("Appointment rescheduled", lifecycleService.reschedule(principal.getId(), id,
                request.holdId(), request.holdVersion(), idempotencyKey, versionHeaderParser.parse(ifMatch)));
    }

    @PostMapping("/{id}/check-in")
    public ApiResponse<CheckInResponse> checkIn(@AuthenticationPrincipal UserDetailsImpl principal,
            @PathVariable UUID id, @RequestHeader("Idempotency-Key") String idempotencyKey,
            @Valid @RequestBody CheckInRequest request) {
        return ApiResponse.success("Appointment checked in", checkInService.citizenCheckIn(principal.getId(), id,
                request.method(), request.credential(), idempotencyKey));
    }
}
