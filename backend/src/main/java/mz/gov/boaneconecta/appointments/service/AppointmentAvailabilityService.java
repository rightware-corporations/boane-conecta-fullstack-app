package mz.gov.boaneconecta.appointments.service;

import mz.gov.boaneconecta.appointments.dto.AppointmentAvailabilityResponse;
import mz.gov.boaneconecta.appointments.repository.AppointmentSlotRepository;
import mz.gov.boaneconecta.core.exception.ResourceNotFoundException;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalServiceStatus;
import mz.gov.boaneconecta.municipalservices.repository.MunicipalServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;

@Service
public class AppointmentAvailabilityService {
    private static final int MAX_RANGE_DAYS = 62;
    private final AppointmentSlotRepository slots;
    private final MunicipalServiceRepository services;
    private final Clock clock;
    public AppointmentAvailabilityService(AppointmentSlotRepository slots, MunicipalServiceRepository services, Clock clock) {
        this.slots = slots; this.services = services; this.clock = clock;
    }

    @Transactional(readOnly = true)
    public AppointmentAvailabilityResponse find(UUID serviceId, String locationCode, LocalDate from, LocalDate to) {
        if (locationCode == null || locationCode.isBlank()) throw new IllegalArgumentException("locationCode is required");
        if (from == null || to == null || to.isBefore(from) || to.isAfter(from.plusDays(MAX_RANGE_DAYS)))
            throw new IllegalArgumentException("Availability range must be between 1 and 62 days");
        var service = services.findById(serviceId).filter(item -> item.getStatus() == MunicipalServiceStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Municipal service not found"));
        ZoneId zone = clock.getZone();
        Instant fromTime = from.atStartOfDay(zone).toInstant();
        Instant toTime = to.plusDays(1).atStartOfDay(zone).toInstant();
        Map<LocalDate, List<AppointmentAvailabilityResponse.AvailabilitySlot>> grouped = new LinkedHashMap<>();
        String normalizedLocation = locationCode.trim().toUpperCase(Locale.ROOT);
        slots.findAvailability(service.getId(), normalizedLocation, fromTime, toTime, clock.instant()).forEach(row -> {
            LocalDate date = row.getStartsAt().atZone(zone).toLocalDate();
            grouped.computeIfAbsent(date, ignored -> new ArrayList<>()).add(new AppointmentAvailabilityResponse.AvailabilitySlot(
                    row.getSlotId(), row.getStartsAt(), row.getEndsAt(), row.getLocationName(), Math.toIntExact(row.getRemainingCapacity()),
                    row.getRemainingCapacity() > 0 ? "AVAILABLE" : "UNAVAILABLE"));
        });
        return new AppointmentAvailabilityResponse(serviceId, normalizedLocation, grouped.entrySet().stream()
                .map(entry -> new AppointmentAvailabilityResponse.AvailabilityDay(entry.getKey(), List.copyOf(entry.getValue()))).toList());
    }
}
