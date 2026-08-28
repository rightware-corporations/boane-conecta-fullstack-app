package mz.gov.boaneconecta.appointments.dto;
import java.time.*;
import java.util.*;

public record AppointmentAvailabilityResponse(UUID serviceId, String locationCode, List<AvailabilityDay> days) {
    public record AvailabilityDay(LocalDate date, List<AvailabilitySlot> slots) {}
    public record AvailabilitySlot(UUID slotId, Instant startsAt, Instant endsAt, String locationName,
            int remainingCapacity, String availability) {}
}
