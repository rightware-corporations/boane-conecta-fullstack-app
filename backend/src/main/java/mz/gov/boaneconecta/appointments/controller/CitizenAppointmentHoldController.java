package mz.gov.boaneconecta.appointments.controller;

import jakarta.validation.Valid;
import mz.gov.boaneconecta.appointments.dto.*;
import mz.gov.boaneconecta.appointments.service.AppointmentHoldService;
import mz.gov.boaneconecta.core.response.ApiResponse;
import mz.gov.boaneconecta.core.security.UserDetailsImpl;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/citizen/appointment-holds")
@PreAuthorize("hasRole('CITIZEN')")
public class CitizenAppointmentHoldController {
    private final AppointmentHoldService service;
    public CitizenAppointmentHoldController(AppointmentHoldService service) { this.service = service; }
    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentHoldResponse>> create(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @Valid @RequestBody CreateAppointmentHoldRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Appointment hold created",
                service.create(principal.getId(), request.slotId(), idempotencyKey)));
    }
}
