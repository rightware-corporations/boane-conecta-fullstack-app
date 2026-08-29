package mz.gov.boaneconecta.core.config;
import org.springframework.context.annotation.*;
import java.time.*;
@Configuration
public class TimeConfiguration {
    @Bean public Clock municipalClock() { return Clock.system(ZoneId.of("Africa/Maputo")); }
}
