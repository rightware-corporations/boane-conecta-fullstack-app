CREATE TABLE request_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_user_id UUID NOT NULL REFERENCES users(id),
    service_id UUID NOT NULL REFERENCES municipal_services(id),
    service_version_id UUID NOT NULL REFERENCES municipal_service_versions(id),
    form_version_id UUID NOT NULL REFERENCES service_form_versions(id),
    status VARCHAR(30) NOT NULL,
    current_step_key VARCHAR(100),
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    eligibility_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    eligibility_result JSONB,
    version BIGINT NOT NULL DEFAULT 0,
    last_saved_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    submitted_request_id UUID REFERENCES citizen_requests(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_request_draft_status CHECK (status IN (
        'IN_PROGRESS', 'READY_FOR_REVIEW', 'SUBMITTING', 'SUBMITTED', 'EXPIRED', 'ABANDONED'
    )),
    CONSTRAINT ck_request_draft_answers_object CHECK (jsonb_typeof(answers) = 'object'),
    CONSTRAINT ck_request_draft_eligibility_answers_object CHECK (jsonb_typeof(eligibility_answers) = 'object'),
    CONSTRAINT ck_request_draft_submission_link CHECK (
        (status = 'SUBMITTED' AND submitted_request_id IS NOT NULL)
        OR (status <> 'SUBMITTED')
    )
);

CREATE UNIQUE INDEX ux_request_drafts_submitted_request
    ON request_drafts(submitted_request_id)
    WHERE submitted_request_id IS NOT NULL;

CREATE INDEX ix_request_drafts_citizen_status_updated
    ON request_drafts(citizen_user_id, status, updated_at DESC);

CREATE INDEX ix_request_drafts_service_citizen
    ON request_drafts(service_id, citizen_user_id);

CREATE INDEX ix_request_drafts_expiry
    ON request_drafts(expires_at)
    WHERE status IN ('IN_PROGRESS', 'READY_FOR_REVIEW');
