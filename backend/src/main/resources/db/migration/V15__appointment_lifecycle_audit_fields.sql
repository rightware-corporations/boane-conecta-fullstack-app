ALTER TABLE appointments
    ADD COLUMN cancelled_at TIMESTAMPTZ,
    ADD COLUMN cancellation_reason VARCHAR(500);

ALTER TABLE appointments
    ALTER COLUMN confirmed_at TYPE TIMESTAMPTZ USING confirmed_at AT TIME ZONE 'Africa/Maputo',
    ALTER COLUMN checked_in_at TYPE TIMESTAMPTZ USING checked_in_at AT TIME ZONE 'Africa/Maputo';
