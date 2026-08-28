CREATE TABLE municipal_service_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES municipal_services(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL,
    title VARCHAR(180) NOT NULL,
    description TEXT,
    processing_time VARCHAR(100),
    online_submission_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_service_version_number_positive CHECK (version_number > 0),
    CONSTRAINT ck_service_version_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'RETIRED')),
    CONSTRAINT uq_service_version_number UNIQUE (service_id, version_number)
);

CREATE UNIQUE INDEX ux_service_versions_one_published
    ON municipal_service_versions(service_id)
    WHERE status = 'PUBLISHED';

CREATE INDEX ix_service_versions_service_status
    ON municipal_service_versions(service_id, status);

CREATE TABLE service_form_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES municipal_services(id) ON DELETE CASCADE,
    definition_key VARCHAR(100) NOT NULL,
    name VARCHAR(180) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_service_form_definition_key UNIQUE (service_id, definition_key)
);

CREATE INDEX ix_service_form_definitions_service
    ON service_form_definitions(service_id);

CREATE TABLE service_form_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    definition_id UUID NOT NULL REFERENCES service_form_definitions(id) ON DELETE CASCADE,
    service_version_id UUID NOT NULL REFERENCES municipal_service_versions(id),
    version_number INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL,
    schema_json JSONB NOT NULL,
    eligibility_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    document_requirements_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    declaration_version VARCHAR(80) NOT NULL,
    declaration_text TEXT NOT NULL,
    schema_checksum VARCHAR(80) NOT NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_form_version_number_positive CHECK (version_number > 0),
    CONSTRAINT ck_form_version_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'RETIRED')),
    CONSTRAINT ck_form_schema_is_object CHECK (jsonb_typeof(schema_json) = 'object'),
    CONSTRAINT ck_form_eligibility_is_array CHECK (jsonb_typeof(eligibility_json) = 'array'),
    CONSTRAINT ck_form_documents_is_array CHECK (jsonb_typeof(document_requirements_json) = 'array'),
    CONSTRAINT uq_form_version_number UNIQUE (definition_id, version_number)
);

CREATE UNIQUE INDEX ux_form_versions_one_published
    ON service_form_versions(definition_id)
    WHERE status = 'PUBLISHED';

CREATE INDEX ix_form_versions_definition_status
    ON service_form_versions(definition_id, status);

CREATE INDEX ix_form_versions_service_version
    ON service_form_versions(service_version_id);
