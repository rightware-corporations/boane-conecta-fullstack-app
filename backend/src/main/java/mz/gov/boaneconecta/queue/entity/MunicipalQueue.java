package mz.gov.boaneconecta.queue.entity;

import jakarta.persistence.*;
import lombok.*;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import org.hibernate.annotations.*;
import java.time.Instant;
import java.util.UUID;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "queues")
public class MunicipalQueue {
    @Id @GeneratedValue(strategy = GenerationType.AUTO) private UUID id;
    @Column(nullable = false, length = 150) private String name;
    @Column(name = "location_code", nullable = false, length = 40) private String locationCode;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "department_id", nullable = false) private Department department;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "service_id") private MunicipalService service;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30) private QueueMode mode;
    @Enumerated(EnumType.STRING) @Builder.Default @Column(nullable = false, length = 20) private QueueStatus status = QueueStatus.CLOSED;
    @Version private Long version;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at", nullable = false) private Instant updatedAt;
}
