CREATE TABLE request_answer_snapshots (
    id UUID PRIMARY KEY,
    draft_id UUID NOT NULL UNIQUE REFERENCES request_drafts(id),
    service_version_id UUID NOT NULL REFERENCES municipal_service_versions(id),
    form_version_id UUID NOT NULL REFERENCES service_form_versions(id),
    answers_json JSONB NOT NULL,
    eligibility_json JSONB NOT NULL,
    document_manifest_json JSONB NOT NULL,
    declaration_version VARCHAR(80) NOT NULL,
    declaration_accepted_at TIMESTAMPTZ NOT NULL,
    schema_checksum VARCHAR(80) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE idempotency_records (
    id UUID PRIMARY KEY,
    citizen_user_id UUID NOT NULL REFERENCES users(id),
    operation VARCHAR(80) NOT NULL,
    idempotency_key_hash VARCHAR(64) NOT NULL,
    request_fingerprint VARCHAR(64) NOT NULL,
    state VARCHAR(20) NOT NULL,
    response_resource_id UUID,
    response_reference VARCHAR(80),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    CONSTRAINT uq_idempotency_scope UNIQUE (citizen_user_id, operation, idempotency_key_hash),
    CONSTRAINT ck_idempotency_state CHECK (state IN ('IN_PROGRESS', 'COMPLETED'))
);

CREATE TABLE domain_outbox_events (
    id UUID PRIMARY KEY,
    aggregate_type VARCHAR(80) NOT NULL,
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(120) NOT NULL,
    payload_json JSONB NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    attempt_count INTEGER NOT NULL DEFAULT 0,
    next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMPTZ,
    last_error TEXT,
    CONSTRAINT ck_outbox_status CHECK (status IN ('PENDING', 'PROCESSING', 'PROCESSED', 'FAILED'))
);

ALTER TABLE citizen_requests
    ADD COLUMN source_draft_id UUID REFERENCES request_drafts(id),
    ADD COLUMN answer_snapshot_id UUID REFERENCES request_answer_snapshots(id),
    ADD COLUMN declaration_version VARCHAR(80),
    ADD COLUMN declaration_accepted_at TIMESTAMPTZ;

CREATE UNIQUE INDEX uq_citizen_request_source_draft ON citizen_requests(source_draft_id)
    WHERE source_draft_id IS NOT NULL;
CREATE INDEX idx_idempotency_expiry ON idempotency_records(expires_at);
CREATE INDEX idx_outbox_dispatch ON domain_outbox_events(status, next_attempt_at);
