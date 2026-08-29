CREATE TABLE appointment_schedule_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES municipal_services(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    location_code VARCHAR(40) NOT NULL,
    day_of_week VARCHAR(12) NOT NULL,
    start_local_time TIME NOT NULL,
    end_local_time TIME NOT NULL,
    slot_duration_minutes INT NOT NULL CHECK (slot_duration_minutes > 0),
    capacity_per_slot INT NOT NULL CHECK (capacity_per_slot > 0),
    effective_from DATE NOT NULL,
    effective_until DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_local_time > start_local_time),
    CHECK (effective_until IS NULL OR effective_until >= effective_from)
);

ALTER TABLE appointment_slots
    ALTER COLUMN start_time TYPE TIMESTAMPTZ USING start_time AT TIME ZONE 'Africa/Maputo',
    ALTER COLUMN end_time TYPE TIMESTAMPTZ USING end_time AT TIME ZONE 'Africa/Maputo',
    ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Africa/Maputo',
    ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'Africa/Maputo';

ALTER TABLE appointments
    ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'Africa/Maputo',
    ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'Africa/Maputo';

ALTER TABLE appointment_slots
    ADD COLUMN schedule_rule_id UUID REFERENCES appointment_schedule_rules(id),
    ADD COLUMN service_id UUID REFERENCES municipal_services(id),
    ADD COLUMN location_name VARCHAR(180),
    ADD COLUMN location_code VARCHAR(40),
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0;

UPDATE appointment_slots
SET location_name = COALESCE((SELECT name FROM departments WHERE departments.id = appointment_slots.department_id), 'Balcão Municipal'),
    location_code = 'BOANE';

ALTER TABLE appointment_slots
    ALTER COLUMN location_name SET NOT NULL,
    ALTER COLUMN location_code SET NOT NULL;

ALTER TABLE appointments
    ADD COLUMN confirmed_at TIMESTAMP,
    ADD COLUMN check_in_code_hash VARCHAR(64) UNIQUE,
    ADD COLUMN checked_in_at TIMESTAMP,
    ADD COLUMN version BIGINT NOT NULL DEFAULT 0;

UPDATE appointments SET status = 'CONFIRMED', confirmed_at = created_at WHERE status = 'SCHEDULED';

CREATE INDEX idx_appointment_slots_service_time ON appointment_slots(service_id, start_time);
CREATE TABLE appointment_holds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slot_id UUID NOT NULL REFERENCES appointment_slots(id),
    citizen_user_id UUID NOT NULL REFERENCES users(id),
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    idempotency_key_hash VARCHAR(64),
    request_fingerprint VARCHAR(64) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    expires_at TIMESTAMPTZ NOT NULL,
    consumed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_holds_slot_status_expiry ON appointment_holds(slot_id, status, expires_at);
CREATE INDEX idx_holds_citizen_status ON appointment_holds(citizen_user_id, status);
CREATE UNIQUE INDEX uq_holds_citizen_idempotency
    ON appointment_holds(citizen_user_id, idempotency_key_hash)
    WHERE idempotency_key_hash IS NOT NULL;

ALTER TABLE appointment_slots
    ADD CONSTRAINT chk_appointment_slot_capacity CHECK (capacity > 0),
    ADD CONSTRAINT chk_appointment_slot_time CHECK (end_time > start_time);

CREATE UNIQUE INDEX uq_materialized_rule_slot
    ON appointment_slots(schedule_rule_id, start_time)
    WHERE schedule_rule_id IS NOT NULL;

CREATE TABLE queues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    location_code VARCHAR(40) NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    service_id UUID REFERENCES municipal_services(id),
    mode VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CLOSED',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE queue_desks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_id UUID NOT NULL REFERENCES queues(id),
    code VARCHAR(30) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CLOSED',
    current_staff_user_id UUID REFERENCES users(id),
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(queue_id, code)
);

CREATE TABLE queue_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(30) UNIQUE NOT NULL,
    queue_id UUID NOT NULL REFERENCES queues(id),
    business_date DATE NOT NULL,
    citizen_user_id UUID REFERENCES users(id),
    appointment_id UUID REFERENCES appointments(id),
    source_ticket_id UUID REFERENCES queue_tickets(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    status VARCHAR(30) NOT NULL DEFAULT 'WAITING',
    sequence_number INT NOT NULL,
    priority_class VARCHAR(30) NOT NULL DEFAULT 'NORMAL',
    priority_reason VARCHAR(500),
    called_desk_id UUID REFERENCES queue_desks(id),
    called_at TIMESTAMP,
    service_started_at TIMESTAMP,
    completed_at TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(queue_id, business_date, sequence_number)
);

CREATE INDEX idx_queue_status ON queues(status, department_id);
CREATE INDEX idx_queue_department_status_sequence ON queue_tickets(queue_id, business_date, status, sequence_number);
CREATE INDEX idx_queue_citizen_created ON queue_tickets(citizen_user_id, created_at DESC);
CREATE UNIQUE INDEX uq_active_ticket_per_appointment
    ON queue_tickets(appointment_id)
    WHERE status IN ('WAITING', 'CALLED', 'SERVING');

CREATE TABLE service_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_ticket_id UUID UNIQUE NOT NULL REFERENCES queue_tickets(id),
    desk_id UUID NOT NULL REFERENCES queue_desks(id),
    staff_user_id UUID NOT NULL REFERENCES users(id),
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    outcome_code VARCHAR(80),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    version BIGINT NOT NULL DEFAULT 0,
    CHECK (ended_at IS NULL OR ended_at >= started_at)
);

CREATE UNIQUE INDEX uq_active_service_session_per_desk
    ON service_sessions(desk_id)
    WHERE status = 'ACTIVE';
