ALTER TABLE documents ALTER COLUMN file_path DROP NOT NULL;
ALTER TABLE documents ADD COLUMN storage_bucket VARCHAR(120);
ALTER TABLE documents ADD COLUMN storage_key TEXT;
ALTER TABLE documents ADD COLUMN detected_mime_type VARCHAR(100);
ALTER TABLE documents ADD COLUMN sha256 VARCHAR(64);
ALTER TABLE documents ADD COLUMN classification VARCHAR(30) NOT NULL DEFAULT 'PERSONAL';
ALTER TABLE documents ADD COLUMN current_version_number INTEGER NOT NULL DEFAULT 1;
ALTER TABLE documents ADD COLUMN scan_failure_code VARCHAR(80);

UPDATE documents SET status = 'VALID' WHERE status = 'ACTIVE';

CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    storage_bucket VARCHAR(120),
    storage_key TEXT,
    legacy_file_path TEXT,
    original_file_name VARCHAR(255),
    detected_mime_type VARCHAR(100),
    file_size BIGINT NOT NULL,
    sha256 VARCHAR(64),
    status VARCHAR(30) NOT NULL,
    scan_failure_code VARCHAR(80),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_document_version_number_positive CHECK (version_number > 0),
    CONSTRAINT ck_document_version_size_nonnegative CHECK (file_size >= 0),
    CONSTRAINT ck_document_version_status CHECK (status IN (
        'RECEIVED', 'SCANNING', 'VALID', 'REJECTED', 'EXPIRED', 'REPLACED', 'ARCHIVED'
    )),
    CONSTRAINT uq_document_version UNIQUE (document_id, version_number)
);

INSERT INTO document_versions (
    document_id, version_number, legacy_file_path, original_file_name,
    detected_mime_type, file_size, sha256, status, created_at
)
SELECT id, 1, file_path, original_file_name, mime_type,
       COALESCE(file_size, 0), sha256,
       CASE WHEN status = 'ARCHIVED' THEN 'ARCHIVED'
            WHEN status = 'REJECTED' THEN 'REJECTED'
            ELSE 'VALID' END,
       created_at AT TIME ZONE 'Africa/Maputo'
FROM documents;

CREATE INDEX ix_document_versions_document
    ON document_versions(document_id, version_number DESC);

CREATE INDEX ix_documents_owner_status_created
    ON documents(owner_user_id, status, created_at DESC);

CREATE INDEX ix_documents_scan_status
    ON documents(status, created_at)
    WHERE status IN ('RECEIVED', 'SCANNING');

CREATE TABLE request_draft_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draft_id UUID NOT NULL REFERENCES request_drafts(id) ON DELETE CASCADE,
    requirement_key VARCHAR(100) NOT NULL,
    document_id UUID NOT NULL REFERENCES documents(id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    replaced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX ux_request_draft_document_active_requirement
    ON request_draft_documents(draft_id, requirement_key)
    WHERE active = TRUE;

CREATE INDEX ix_request_draft_documents_draft
    ON request_draft_documents(draft_id, created_at);
