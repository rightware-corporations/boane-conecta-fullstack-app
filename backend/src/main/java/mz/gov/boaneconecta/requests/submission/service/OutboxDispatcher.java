package mz.gov.boaneconecta.requests.submission.service;

import mz.gov.boaneconecta.requests.submission.entity.DomainOutboxEvent;
import mz.gov.boaneconecta.requests.submission.repository.DomainOutboxEventRepository;
import org.slf4j.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;

@Component
public class OutboxDispatcher {
    private static final Logger log = LoggerFactory.getLogger(OutboxDispatcher.class);
    private final DomainOutboxEventRepository events;
    public OutboxDispatcher(DomainOutboxEventRepository events) { this.events = events; }

    @Scheduled(fixedDelayString = "${app.outbox.poll-delay-millis:5000}")
    @Transactional
    public void dispatch() {
        Instant now = Instant.now();
        for (DomainOutboxEvent event : events.findDispatchBatch(now, PageRequest.of(0, 50))) {
            try {
                log.info("Domain event type={} aggregateId={} payload={}",
                        event.getEventType(), event.getAggregateId(), event.getPayload());
                event.processed(now);
            } catch (RuntimeException exception) {
                event.failed(exception.getMessage(), now.plusSeconds(60));
            }
            events.save(event);
        }
    }
}
