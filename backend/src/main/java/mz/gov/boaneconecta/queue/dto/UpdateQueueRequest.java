package mz.gov.boaneconecta.queue.dto;
import jakarta.validation.constraints.*;
import mz.gov.boaneconecta.queue.entity.QueueMode;
import java.util.UUID;
public record UpdateQueueRequest(@NotBlank @Size(max=150) String name,@NotBlank @Size(max=40) String locationCode,
        @NotNull UUID departmentId,UUID serviceId,@NotNull QueueMode mode) {}
