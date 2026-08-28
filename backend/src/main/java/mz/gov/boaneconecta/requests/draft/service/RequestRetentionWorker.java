package mz.gov.boaneconecta.requests.draft.service;

import mz.gov.boaneconecta.requests.draft.entity.RequestDraftStatus;
import mz.gov.boaneconecta.requests.draft.repository.RequestDraftRepository;
import mz.gov.boaneconecta.requests.submission.repository.IdempotencyRecordRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;

@Component
public class RequestRetentionWorker {
    private final RequestDraftRepository drafts;
    private final IdempotencyRecordRepository idempotency;
    public RequestRetentionWorker(RequestDraftRepository drafts, IdempotencyRecordRepository idempotency) {
        this.drafts = drafts; this.idempotency = idempotency;
    }

    @Scheduled(cron = "${app.requests.retention-cron:0 15 2 * * *}")
    @Transactional
    public void expire() {
        Instant now = Instant.now();
        drafts.findByStatusInAndExpiresAtBefore(
                List.of(RequestDraftStatus.IN_PROGRESS, RequestDraftStatus.READY_FOR_REVIEW), now)
                .forEach(draft -> { draft.expire(); drafts.save(draft); });
        idempotency.deleteByExpiresAtBefore(now);
    }
}
