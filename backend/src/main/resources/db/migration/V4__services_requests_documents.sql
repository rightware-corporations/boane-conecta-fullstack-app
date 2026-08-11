CREATE TABLE municipal_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id),
    title VARCHAR(180) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    processing_time VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'PUBLISHED',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE service_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES municipal_services(id) ON DELETE CASCADE,
    title VARCHAR(180) NOT NULL,
    description TEXT,
    required BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE service_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES municipal_services(id) ON DELETE CASCADE,
    title VARCHAR(180) NOT NULL,
    amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'MZN',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID REFERENCES users(id),
    title VARCHAR(180) NOT NULL,
    document_type VARCHAR(80),
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255),
    file_path TEXT NOT NULL,
    mime_type VARCHAR(100),
    file_size BIGINT,
    visibility VARCHAR(30) NOT NULL DEFAULT 'PRIVATE',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE citizen_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number VARCHAR(50) UNIQUE NOT NULL,
    citizen_user_id UUID NOT NULL REFERENCES users(id),
    service_id UUID REFERENCES municipal_services(id),
    title VARCHAR(200),
    description TEXT,
    status VARCHAR(40) NOT NULL DEFAULT 'SUBMITTED',
    priority VARCHAR(30) DEFAULT 'NORMAL',
    submitted_at TIMESTAMP,
    completed_at TIMESTAMP,
    assigned_to_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE request_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES citizen_requests(id) ON DELETE CASCADE,
    old_status VARCHAR(40),
    new_status VARCHAR(40) NOT NULL,
    comment TEXT,
    changed_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE request_documents (
    request_id UUID NOT NULL REFERENCES citizen_requests(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    PRIMARY KEY(request_id, document_id)
);
