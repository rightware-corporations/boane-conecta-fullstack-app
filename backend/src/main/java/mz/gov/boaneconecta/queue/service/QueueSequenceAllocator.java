package mz.gov.boaneconecta.queue.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import java.sql.Date;
import java.time.LocalDate;
import java.util.UUID;

@Component
public class QueueSequenceAllocator {
    private final JdbcTemplate jdbc;
    public QueueSequenceAllocator(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public int next(UUID queueId, LocalDate businessDate) {
        Integer value = jdbc.queryForObject("""
                INSERT INTO queue_sequence_counters(queue_id, business_date, next_value)
                VALUES (?, ?, 2)
                ON CONFLICT (queue_id, business_date)
                DO UPDATE SET next_value = queue_sequence_counters.next_value + 1
                RETURNING next_value - 1
                """, Integer.class, queueId, Date.valueOf(businessDate));
        if (value == null || value < 1) throw new IllegalStateException("QUEUE_SEQUENCE_ALLOCATION_FAILED");
        return value;
    }
}
