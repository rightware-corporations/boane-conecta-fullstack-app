ALTER TABLE notifications
    ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    ADD COLUMN related_id UUID,
    ADD COLUMN action_href VARCHAR(300),
    ADD COLUMN expires_at TIMESTAMPTZ;

CREATE INDEX ix_notifications_user_read_created
    ON notifications(user_id, read_at, created_at DESC);

CREATE INDEX ix_notifications_expiry
    ON notifications(expires_at)
    WHERE expires_at IS NOT NULL;
