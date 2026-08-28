package mz.gov.boaneconecta.queue.dto;
import jakarta.validation.constraints.*;
public record CreateQueueDeskRequest(@NotBlank @Size(max=30) String code,@NotBlank @Size(max=100) String displayName) {}
