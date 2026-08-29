package mz.gov.boaneconecta.queue.dto;
import jakarta.validation.constraints.NotNull;
import mz.gov.boaneconecta.queue.entity.QueueStatus;
public record QueueStatusRequest(@NotNull QueueStatus status) {}
