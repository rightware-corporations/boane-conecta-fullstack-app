package mz.gov.boaneconecta.queue.dto;
import jakarta.validation.constraints.Size;
public record CompleteServiceSessionRequest(@Size(max = 80) String outcomeCode) {}
