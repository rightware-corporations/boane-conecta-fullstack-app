CREATE TABLE queue_events (
    id UUID PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES queue_tickets(id),
    event_type VARCHAR(60) NOT NULL,
    actor_user_id UUID NOT NULL REFERENCES users(id),
    reason VARCHAR(500),
    occurred_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_queue_events_ticket_time ON queue_events(ticket_id, occurred_at);

CREATE UNIQUE INDEX uq_active_ticket_per_desk
    ON queue_tickets(called_desk_id)
    WHERE status IN ('CALLED', 'SERVING');

ALTER TABLE queue_tickets
    ALTER COLUMN called_at TYPE TIMESTAMPTZ USING called_at AT TIME ZONE 'Africa/Maputo',
    ALTER COLUMN service_started_at TYPE TIMESTAMPTZ USING service_started_at AT TIME ZONE 'Africa/Maputo',
    ALTER COLUMN completed_at TYPE TIMESTAMPTZ USING completed_at AT TIME ZONE 'Africa/Maputo',
    ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Africa/Maputo',
    ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'Africa/Maputo';
