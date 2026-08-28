package mz.gov.boaneconecta.appointments.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "appointment_slots")
public class AppointmentSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_rule_id")
    private AppointmentScheduleRule scheduleRule;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private MunicipalService service;

    @Column(name = "location_name", nullable = false, length = 180)
    private String locationName;

    @Column(name = "location_code", nullable = false, length = 40)
    private String locationCode;

    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Column(nullable = false)
    @Builder.Default
    private Integer capacity = 1;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 30)
    private SlotStatus status = SlotStatus.AVAILABLE;

    @Version
    private Long version;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void initializeLocation() {
        if (locationName == null || locationName.isBlank()) {
            locationName = department == null ? "Balcão Municipal" : department.getName();
        }
        if (locationCode == null || locationCode.isBlank()) {
            locationCode = "BOANE";
        }
    }
}
