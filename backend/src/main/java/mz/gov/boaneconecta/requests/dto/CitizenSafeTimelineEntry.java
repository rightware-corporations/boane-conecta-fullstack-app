package mz.gov.boaneconecta.requests.dto;

import mz.gov.boaneconecta.requests.entity.RequestStatus;
import java.time.LocalDateTime;

public record CitizenSafeTimelineEntry(RequestStatus status, String label, LocalDateTime occurredAt) {}
