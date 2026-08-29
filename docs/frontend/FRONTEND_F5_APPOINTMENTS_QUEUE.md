# Frontend F5 — Appointments and Queue

## Scope

F5 implements citizen appointment booking, appointment lifecycle, assisted and QR check-in, digital queue tickets, staff queue operation, public queue display, queue configuration, service agenda rules and slot capacity. F6 is not part of this delivery.

## Delivered surfaces

- Citizen appointments: availability, temporary hold, confirmation, detail, cancellation and rescheduling.
- Citizen check-in: authenticated manual fallback and camera-based QR flow.
- Citizen queue ticket: current state, public number and service progress without exposing another citizen's identity.
- Staff console: queue and desk selection, session lifecycle, next call, recall, service start, completion, no-show and transfer.
- Public display: fullscreen queue projection with minimal public data.
- Administrative agenda: appointment list and assisted check-in.
- Administrative configuration: queues, desks, schedule rules, capacity and explicit slot materialization.

## Backend contracts

- `/api/v1/citizen/appointments/**`: citizen-owned appointment operations.
- `/api/v1/citizen/check-in/**`: authenticated check-in commands.
- `/api/v1/admin/appointments/**`: appointment agenda, assisted check-in and slot materialization.
- `/api/v1/admin/appointment-schedule-rules/**`: schedule rule creation, update and controlled lifecycle.
- `/api/v1/admin/queues/**`: queue and desk configuration.
- `/api/v1/staff/queues/**`: staff operations and service sessions.
- `/api/v1/public/queues/**`: public-safe queue display projection.

## Business invariants

- A hold is temporary and separate from the confirmed appointment aggregate.
- Slot capacity is allocated under database locking and idempotent command boundaries.
- Schedule rules are created as drafts. Active rules cannot be edited directly.
- Schedule transitions are restricted to `DRAFT → ACTIVE`, `ACTIVE → SUSPENDED`, `SUSPENDED → ACTIVE`, and retirement from draft or suspended state.
- Retired rules are terminal and excluded from overlap conflicts and new materialization.
- Service and department must match; overlapping rules for the same service, location and weekday are rejected.
- Slot materialization accepts a bounded future period and does not duplicate existing slots.
- Queue tickets and service sessions remain the authoritative operational history.

## Security and concurrency

- Citizen identity is derived from the authenticated principal and never accepted from the UI.
- Configuration requires `ADMIN` or `SUPER_ADMIN`; staff operations use explicitly authorized operational roles.
- Mutable configuration commands require `If-Match` optimistic concurrency.
- Capacity and queue command paths use database locks where concurrent decisions affect the same aggregate.
- Retry-sensitive commands use idempotency keys.
- Public projections expose only queue-safe information.

## Responsive behavior

Citizen booking is mobile-first and preserves a single primary action per step. Staff consoles favour operational density and touch-safe controls. Administrative configuration uses compact forms and record lists rather than decorative dashboards. The public display prioritizes distance readability and avoids interactive controls.

## Acceptance matrix

| Area | Required evidence |
| --- | --- |
| Booking | Availability → hold → confirmation succeeds; expired or conflicting capacity fails safely |
| Lifecycle | Citizen can only read, cancel or reschedule owned appointments using current versions |
| Check-in | QR and assisted flows are idempotent and reject invalid appointment state/time windows |
| Queue | Desk/session ownership and ticket transitions follow the canonical state machine |
| Public display | No citizen identity or internal operational metadata is exposed |
| Configuration | Invalid service/department, time ranges, overlaps and stale versions are rejected |
| Materialization | Only active rules produce deterministic, non-duplicated slots in `Africa/Maputo` |
| Accessibility | Keyboard, focus, labels, status announcements, reduced motion and 200% zoom remain usable |
| Responsive QA | Citizen, staff, admin and public display are checked at canonical mobile, tablet and desktop widths |

## Quality gates

Required before merge: frontend ESLint, TypeScript no-emit, Vitest, production build, backend Maven test suite on Java 21, `git diff --check`, migration validation, API authorization checks and screenshot QA at all canonical viewports.
