CREATE TABLE queue_staff_scopes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_id UUID NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
    staff_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(queue_id, staff_user_id)
);

CREATE INDEX idx_queue_staff_scopes_user ON queue_staff_scopes(staff_user_id, queue_id);
