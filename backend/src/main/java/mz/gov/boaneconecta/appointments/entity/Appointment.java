package mz.gov.boaneconecta.appointments.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mz.gov.boaneconecta.users.entity.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "appointment_number", nullable = false, unique = true, length = 50)
    private String appointmentNumber;

    @ManyToOne
    @JoinColumn(name = "citizen_user_id", nullable = false)
    private User citizenUser;

    @ManyToOne
    @JoinColumn(name = "slot_id")
    private AppointmentSlot slot;

    @Column(name = "confirmed_at")
    private Instant confirmedAt;

    @Column(name = "check_in_code_hash", unique = true, length = 64)
    private String checkInCodeHash;

    @Column(name = "checked_in_at")
    private Instant checkedInAt;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    @Builder.Default
    private AppointmentStatus status = AppointmentStatus.CONFIRMED;

    @Version
    private Long version;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
