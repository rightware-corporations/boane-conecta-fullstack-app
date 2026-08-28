CREATE UNIQUE INDEX uq_open_queue_service_location
    ON queues(service_id, location_code)
    WHERE status = 'OPEN' AND service_id IS NOT NULL;
