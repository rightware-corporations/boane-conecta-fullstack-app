package mz.gov.boaneconecta.requests.dto;

import mz.gov.boaneconecta.requests.entity.RequestStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record CitizenRequestDetailResponse(
        UUID id, String reference, UUID serviceId, String serviceTitle, String title,
        RequestStatus status, String statusLabel, String nextAction, LocalDateTime submittedAt,
        List<CitizenSafeTimelineEntry> timeline, List<CitizenSafeDocumentSummary> documents,
        List<String> availableActions) {}
