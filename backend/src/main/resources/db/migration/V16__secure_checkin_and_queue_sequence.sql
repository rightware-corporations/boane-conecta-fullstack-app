ALTER TABLE appointments
    ADD COLUMN check_in_code_expires_at TIMESTAMPTZ,
    ADD COLUMN check_in_code_consumed_at TIMESTAMPTZ,
    ADD COLUMN check_in_failed_attempts INT NOT NULL DEFAULT 0,
    ADD COLUMN check_in_method VARCHAR(30),
    ADD COLUMN check_in_actor_user_id UUID REFERENCES users(id);

ALTER TABLE queue_tickets DROP CONSTRAINT queue_tickets_ticket_number_key;

CREATE TABLE queue_sequence_counters (
    queue_id UUID NOT NULL REFERENCES queues(id),
    business_date DATE NOT NULL,
    next_value INT NOT NULL CHECK (next_value > 0),
    PRIMARY KEY (queue_id, business_date)
);

ALTER TABLE queue_tickets
    ADD CONSTRAINT chk_queue_ticket_sequence_positive CHECK (sequence_number > 0);
