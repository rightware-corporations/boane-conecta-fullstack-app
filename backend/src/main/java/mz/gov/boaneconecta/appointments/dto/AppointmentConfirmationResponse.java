package mz.gov.boaneconecta.appointments.dto;

import mz.gov.boaneconecta.appointments.entity.AppointmentStatus;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record AppointmentConfirmationResponse(UUID appointmentId, String reference,
        AppointmentStatus status, Instant startsAt, List<String> availableActions,
        boolean replayed) {}
