package mz.gov.boaneconecta.appointments.service;

import mz.gov.boaneconecta.appointments.dto.SlotMaterializationResponse;
import mz.gov.boaneconecta.appointments.entity.*;
import mz.gov.boaneconecta.appointments.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;

@Service
public class AppointmentSlotMaterializationService {
    private static final int MAX_HORIZON_DAYS = 120;
    private final AppointmentScheduleRuleRepository rules;
    private final AppointmentSlotRepository slots;
    private final Clock clock;
    public AppointmentSlotMaterializationService(AppointmentScheduleRuleRepository rules, AppointmentSlotRepository slots, Clock clock) {
        this.rules = rules; this.slots = slots; this.clock = clock;
    }

    @Transactional
    public SlotMaterializationResponse materialize(LocalDate from, LocalDate to) {
        LocalDate today = LocalDate.now(clock);
        if (from == null || to == null || from.isBefore(today) || to.isBefore(from) || to.isAfter(from.plusDays(MAX_HORIZON_DAYS)))
            throw new IllegalArgumentException("Materialization range must be future-facing and at most 120 days");
        int created = 0; int existing = 0;
        var activeRules = rules.findByStatusAndEffectiveFromLessThanEqualAndEffectiveUntilIsNullOrStatusAndEffectiveFromLessThanEqualAndEffectiveUntilGreaterThanEqual(
                ScheduleRuleStatus.ACTIVE, to, ScheduleRuleStatus.ACTIVE, to, from);
        for (AppointmentScheduleRule rule : activeRules) {
            LocalDate first = from.isAfter(rule.getEffectiveFrom()) ? from : rule.getEffectiveFrom();
            LocalDate last = rule.getEffectiveUntil() == null || to.isBefore(rule.getEffectiveUntil()) ? to : rule.getEffectiveUntil();
            for (LocalDate date = first; !date.isAfter(last); date = date.plusDays(1)) {
                if (date.getDayOfWeek() != rule.getDayOfWeek()) continue;
                for (LocalTime time = rule.getStartLocalTime(); time.plusMinutes(rule.getSlotDurationMinutes()).compareTo(rule.getEndLocalTime()) <= 0;
                        time = time.plusMinutes(rule.getSlotDurationMinutes())) {
                    Instant startsAt = ZonedDateTime.of(date, time, clock.getZone()).toInstant();
                    if (slots.existsByScheduleRuleAndStartTime(rule, startsAt)) { existing++; continue; }
                    slots.save(AppointmentSlot.builder().scheduleRule(rule).service(rule.getService()).department(rule.getDepartment())
                            .locationCode(rule.getLocationCode()).locationName(rule.getDepartment().getName())
                            .startTime(startsAt).endTime(startsAt.plusSeconds(rule.getSlotDurationMinutes() * 60L))
                            .capacity(rule.getCapacityPerSlot()).status(SlotStatus.AVAILABLE).build());
                    created++;
                }
            }
        }
        slots.flush();
        return new SlotMaterializationResponse(from, to, created, existing);
    }
}
