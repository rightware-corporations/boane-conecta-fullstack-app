package mz.gov.boaneconecta.queue.dto;
import jakarta.validation.constraints.*;
import java.util.UUID;
public record TransferQueueTicketRequest(@NotNull UUID destinationQueueId,
        @NotBlank @Size(max = 500) String reason) {}
