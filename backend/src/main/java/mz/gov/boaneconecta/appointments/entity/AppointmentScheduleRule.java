package mz.gov.boaneconecta.appointments.entity;

import jakarta.persistence.*;
import lombok.*;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.*;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "appointment_schedule_rules")
public class AppointmentScheduleRule {
    @Id @GeneratedValue(strategy = GenerationType.AUTO) private UUID id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "service_id", nullable = false) private MunicipalService service;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "department_id", nullable = false) private Department department;
    @Column(name = "location_code", nullable = false, length = 40) private String locationCode;
    @Enumerated(EnumType.STRING) @Column(name = "day_of_week", nullable = false, length = 12) private DayOfWeek dayOfWeek;
    @Column(name = "start_local_time", nullable = false) private LocalTime startLocalTime;
    @Column(name = "end_local_time", nullable = false) private LocalTime endLocalTime;
    @Column(name = "slot_duration_minutes", nullable = false) private Integer slotDurationMinutes;
    @Column(name = "capacity_per_slot", nullable = false) private Integer capacityPerSlot;
    @Column(name = "effective_from", nullable = false) private LocalDate effectiveFrom;
    @Column(name = "effective_until") private LocalDate effectiveUntil;
    @Enumerated(EnumType.STRING) @Builder.Default @Column(nullable = false, length = 20) private ScheduleRuleStatus status = ScheduleRuleStatus.DRAFT;
    @Version private Long version;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at", nullable = false) private Instant updatedAt;
}
