package mz.gov.boaneconecta.requests.submission.dto;

import mz.gov.boaneconecta.requests.entity.RequestStatus;
import java.time.Instant;
import java.util.UUID;

public record RequestSubmissionResponse(UUID requestId, String reference, RequestStatus status, Instant submittedAt, boolean replayed) {}
