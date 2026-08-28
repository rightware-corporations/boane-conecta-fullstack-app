# ADR F5-001 — Canonical appointment and queue aggregate boundaries

## Status

Accepted for F5 implementation.

## Context

The initial F5 bootstrap extended the legacy `Appointment` with temporary-hold fields and introduced a ticket directly tied to a department. The corrected canonical F5 specification freezes different aggregate boundaries: holds are separate, queues are configurable, and service sessions are separate from tickets.

## Decision

- `AppointmentHold` owns temporary capacity claims, expiry and hold idempotency metadata.
- New appointments begin at `CONFIRMED`; historical `SCHEDULED` remains readable only for compatibility.
- `AppointmentScheduleRule` defines recurrence and materialized `AppointmentSlot` records remain the concurrency boundary.
- `MunicipalQueue` is the configurable queue aggregate. `QueueDesk`, `QueueTicket` and `ServiceSession` are separate entities.
- Queue public sequence is unique within queue and `Africa/Maputo` business date.
- Ticket transfers use a terminal source ticket plus a linked destination ticket, preserving both queue histories and allowing a new destination public sequence.
- Queue lifecycle is authoritative in `QueueTicket`/`ServiceSession`; appointment-friendly queue states are projections and must not create contradictory business truth.

## Consequences

- The V14 migration remains additive to the pre-F5 database and introduces the canonical F5 aggregates.
- Capacity allocation will lock a materialized slot and count confirmed appointments plus active unexpired holds.
- Walk-in domain support remains possible because citizen and appointment links on a ticket are nullable, but public self-join is not exposed without validated municipal policy.
- Legacy appointment creation endpoints will be deprecated after the new hold/confirm flow is operational.
