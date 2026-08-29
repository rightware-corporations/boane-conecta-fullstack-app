package mz.gov.boaneconecta.appointments;

import mz.gov.boaneconecta.appointments.repository.AppointmentSlotRepository;
import mz.gov.boaneconecta.appointments.service.AppointmentAvailabilityService;
import mz.gov.boaneconecta.municipalservices.entity.*;
import mz.gov.boaneconecta.municipalservices.repository.MunicipalServiceRepository;
import org.junit.jupiter.api.Test;
import java.time.*;
import java.util.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AppointmentAvailabilityServiceTest {
    @Test void normalizesLocationCodeBeforeQueryingAvailability() {
        var slots=mock(AppointmentSlotRepository.class);var services=mock(MunicipalServiceRepository.class);
        var service=MunicipalService.builder().id(UUID.randomUUID()).status(MunicipalServiceStatus.PUBLISHED).build();
        when(services.findById(service.getId())).thenReturn(Optional.of(service));
        Clock clock=Clock.fixed(Instant.parse("2026-09-01T08:00:00Z"),ZoneId.of("Africa/Maputo"));
        var result=new AppointmentAvailabilityService(slots,services,clock).find(service.getId()," boane ",
                LocalDate.of(2026,9,1),LocalDate.of(2026,9,10));
        assertThat(result.locationCode()).isEqualTo("BOANE");
        verify(slots).findAvailability(eq(service.getId()),eq("BOANE"),any(),any(),eq(clock.instant()));
    }
}
