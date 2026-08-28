# BOANE CONECTA — F5 APPOINTMENTS, CHECK-IN & QUEUE ENGINEERING SPEC V1

**Status:** Canonical F5 engineering specification — user option decisions frozen; non-option recommendations remain technical defaults/provisional until required  
**Project:** Boane Conecta  
**Phase:** F5 — Appointments + Check-in + Queue  
**Purpose:** define the complete domain model, business rules, permissions, concurrency model, REST contracts, persistence, events, audit, notifications, mobile readiness, operational boundaries, testing and startup protocol required to implement F5 safely.

---

# 0. AUTHORITY

This document is the canonical phase-specific authority for F5.

It must be interpreted together with:

1. `BOANE_CONECTA_WORK_MASTER_HANDOFF_V1.md`
2. `BOANE_CONECTA_OPERATING_GOVERNANCE_AND_STARTUP_SPEC_V1.md`
3. `BOANE_CONECTA_BACKEND_ENGINEERING_CONSTITUTION_V1.md`
4. `BOANE_CONECTA_BACKEND_ARCHITECTURE_INFRASTRUCTURE_OPERATIONS_ATLAS_V1.md`
5. `BOANE_CONECTA_CITIZEN_MOBILE_REACT_NATIVE_ARCHITECTURE_SPEC_V1.md`
6. the current implemented backend/frontend baseline
7. the F5 layered checklist

Where a material conflict exists:

1. latest explicit approved decision;
2. security/domain invariant;
3. this F5 phase specification;
4. Backend Engineering Constitution;
5. Operating Governance;
6. product/UX canon;
7. implemented baseline.

Do not silently resolve contradictions.

---

# 1. F5 OBJECTIVE

Implement a complete citizen and minimum-operational journey:

```text
Service
→ Available Locations
→ Available Dates
→ Available Slots
→ Temporary Hold
→ Review
→ Confirm Appointment
→ Appointment Detail
→ Arrival
→ Check-in
→ Queue Ticket
→ Waiting
→ Called
→ Service Session
→ Completion
```

F5 must support web citizen and future React Native citizen application from the same authoritative backend.

---

# 2. F5 HARD BOUNDARIES

Authorized:

- appointment schedule rules;
- materialized appointment slots;
- temporary holds;
- appointment confirmation;
- cancellation;
- rescheduling;
- citizen appointment detail;
- check-in;
- QR/manual/assisted check-in;
- queues;
- desks;
- digital tickets;
- service sessions;
- minimum queue operations;
- domain events;
- notifications needed by F5;
- polling/read projection;
- mobile readiness;
- audit and observability required by F5.

Not authorized automatically:

- complete F6 staff case workspace;
- finance/payments beyond links already existing;
- protocol;
- funding;
- full executive dashboards;
- broad organization redesign;
- unrelated frontend redesign.

---

# 3. USER-APPROVED OPTION DECISION REGISTER

The user answered only the questions that had explicit A/B/C/D alternatives.

Canonical response sequence:

```text
BCDBBBBBBCCCBCCCBCCBBBB
```

The 12th response was subsequently clarified explicitly as:

```text
B — QR/check-in token is one-time / consumable
```

Therefore the frozen user-approved decisions are:

| # | Decision | Approved option |
|---|---|---|
| 1 | Hold representation | **B — separate `AppointmentHold` entity** |
| 2 | Slot model | **C — hybrid schedule rules + materialized slots** |
| 3 | Queue identity | **D — configurable `Queue` entity** |
| 4 | `ServiceSession` separation | **B — separate from `QueueTicket`** |
| 5 | Desk states | **B — CLOSED / OPEN / PAUSED / SERVING** |
| 6 | `Call Next` authority | **B — backend selects atomically** |
| 7 | Hold duration policy | **B — global configurable value** |
| 8 | Hold expiration approach | **B — lazy expiration as correctness authority** |
| 9 | Check-in window policy | **B — configurable per service** |
| 10 | Check-in methods | **C — QR + manual code + assisted staff** |
| 11 | QR payload | **C — opaque/purpose-specific token** |
| 12 | QR reuse | **B — one-time / consumable token** |
| 13 | Queue ticket creation | **B — create on successful check-in** |
| 14 | Walk-in support | **C — configurable APPOINTMENT_REQUIRED / WALK_IN_ALLOWED / HYBRID** |
| 15 | Queue priority | **C — explicit policy, never citizen-controlled** |
| 16 | Public ticket sequence | **C — scoped to Queue + business date** |
| 17 | Public display | **B — ticket code + desk only** |
| 18 | Wait estimate | **C — people ahead + estimated interval when reliable** |
| 19 | Live-update V1 | **C — adaptive polling** |
| 20 | Push authority | **B — push is advisory; API remains authoritative** |
| 21 | Rescheduling | **B — obtain new hold first, then perform atomic swap** |
| 22 | No-show | **B — policy/job-driven with operational handling where configured** |
| 23 | Transfer | **B — formal command preserving history and reason** |

## 3.1 Non-option technical recommendations

The following items were discussed as engineering recommendations rather than A/B/C/D questions and therefore are **not represented as user-selected letters**:

- privacy-safe push payloads;
- citizen cancellation before check-in, subject to configured policy;
- recall as an operational command/event;
- capability/scoped capacity management;
- backend-calculated `availableActions`;
- domain event naming;
- observability metrics;
- audit separation;
- migration strategy;
- mobile deep-link behavior;
- cleanup/retention housekeeping.

These remain **technical defaults/provisional recommendations** unless:
1. they are already required by another canonical authority;
2. they are necessary to preserve a security/domain invariant; or
3. they are explicitly approved later.

They must not be described as direct user selections.

---

# 4. DECISION NOTES

## F5-D07 — global hold TTL

The hold TTL is globally configurable.

Conceptual property:

```text
appointments.hold.ttl
```

The exact duration is **REQUIRES VALIDATION**.

It must not be hardcoded.

A future phase may introduce per-service/location overrides only through a new approved decision.

---

# 5. F5-D08 — lazy expiration

Lazy expiration is authoritative.

A hold is invalid when:

```text
expiresAt <= now
```

regardless of whether a cleanup job has processed the row.

Therefore capacity calculations must exclude expired holds using time predicates.

Optional housekeeping may later mark old holds `EXPIRED`, but correctness must never depend on scheduler execution.

This choice avoids scheduler dependence but creates a maintenance consideration: historical expired holds must eventually be archived/purged according to retention policy.

---

# 6. F5-D09 — check-in policy per service

Check-in timing configuration belongs to service-level appointment policy.

Conceptual settings:

```text
checkInOpenBeforeMinutes
lateToleranceMinutes
noShowAfterMinutes
```

Exact values are **REQUIRES VALIDATION**.

Location-specific overrides are not part of F5 unless explicitly authorized.

---

# 7. DOMAIN MODEL

Canonical model:

```text
AppointmentScheduleRule
        │
        ▼
AppointmentSlot
        │
        ▼
AppointmentHold
        │
        ▼
Appointment
        │
        ▼
CheckIn
        │
        ▼
Queue
        │
        ├── QueueDesk
        │
        ▼
QueueTicket
        │
        ▼
ServiceSession
```

Supporting histories/events:

```text
AppointmentEvent
QueueEvent
AuditEvent
DomainEvent
```

These are not interchangeable.

---

# 8. APPOINTMENT SCHEDULE RULE

`AppointmentScheduleRule` describes recurring availability.

Suggested fields:

```text
id UUID
serviceId UUID
departmentId UUID
locationId UUID
dayOfWeek
startLocalTime
endLocalTime
slotDurationMinutes
capacityPerSlot
effectiveFrom
effectiveUntil
status
createdAt
updatedAt
version
```

Potential statuses:

```text
DRAFT
ACTIVE
SUSPENDED
RETIRED
```

Rules define generation behavior, not citizen reservations.

---

# 9. SLOT MATERIALIZATION

Slots are generated/materialized for a configurable future horizon.

Example conceptual horizon:

```text
today → N days ahead
```

`N` is configuration, not business invariant.

Materialization enables:

- explicit capacity;
- locking;
- cancellation;
- exceptional closure;
- reporting;
- audit;
- deterministic availability.

---

# 10. APPOINTMENT SLOT

Suggested fields:

```text
id UUID
scheduleRuleId UUID
serviceId UUID
departmentId UUID
locationId UUID
startsAt TIMESTAMPTZ
endsAt TIMESTAMPTZ
capacity INTEGER
status
version BIGINT
createdAt
updatedAt
```

Statuses:

```text
AVAILABLE
BLOCKED
CANCELLED
CLOSED
```

A slot status is not an appointment status.

---

# 11. SLOT INVARIANTS

- capacity > 0;
- `endsAt > startsAt`;
- one materialized slot identity per schedule rule/time interval;
- past slots are not holdable;
- blocked/cancelled/closed slots are not holdable;
- capacity is calculated on server;
- frontend availability is informational, never authoritative.

---

# 12. APPOINTMENT HOLD

Separate entity.

Suggested fields:

```text
id UUID
slotId UUID
citizenUserId UUID
tokenHash
status
expiresAt
idempotencyKeyHash optional
createdAt
consumedAt
cancelledAt
version
```

Statuses:

```text
ACTIVE
CONSUMED
EXPIRED
CANCELLED
```

Do not store plaintext hold token when a hash is sufficient.

---

# 13. HOLD INVARIANTS

- belongs to authenticated citizen;
- points to one slot;
- expires deterministically by `expiresAt`;
- expired hold never consumes capacity;
- consumed hold cannot be reused;
- active hold cannot be transferred between citizens;
- same idempotency operation should replay safely;
- token never appears in logs.

---

# 14. HOLD CAPACITY FORMULA

Conceptually:

```text
remainingCapacity =
slot.capacity
- confirmedAppointments
- activeUnexpiredHolds
```

Only relevant states count.

The exact SQL/query must execute inside the same critical transaction as allocation.

---

# 15. HOLD CONCURRENCY

Critical allocation must:

1. begin transaction;
2. load/lock slot;
3. validate status/time;
4. count committed reservations;
5. count unexpired active holds;
6. compare with capacity;
7. create hold;
8. commit.

Use PostgreSQL row-level locking where appropriate.

Do not use Java `synchronized` as distributed correctness.

---

# 16. LAST-SEAT RACE

Required integration test:

```text
slot.capacity = 1
Citizen A attempts hold
Citizen B attempts hold
simultaneously
```

Expected:

```text
exactly one success
exactly one 409/capacity conflict
```

Never two confirmed capacity claims.

---

# 17. APPOINTMENT

An `Appointment` exists only after valid hold confirmation.

Suggested fields:

```text
id UUID
publicReference
citizenUserId UUID
slotId UUID
serviceId UUID
departmentId UUID
locationId UUID
status
confirmedAt
checkedInAt nullable
cancelledAt nullable
completedAt nullable
checkInCodeHash
version
createdAt
updatedAt
```

---

# 18. APPOINTMENT STATES

Canonical:

```text
CONFIRMED
CHECKED_IN
WAITING
CALLED
IN_SERVICE
COMPLETED
CANCELLED
NO_SHOW
EXPIRED
```

Historical `SCHEDULED` may remain readable for compatibility but should not be created by new F5 flows.

`HELD` is removed from the new Appointment model because hold is a separate aggregate.

---

# 19. APPOINTMENT STATE MACHINE

Primary:

```text
CONFIRMED
   │
   ├── cancel ──────────────→ CANCELLED
   │
   ├── no-show policy ──────→ NO_SHOW
   │
   └── check-in ────────────→ CHECKED_IN
                                  │
                                  ▼
                                WAITING
                                  │
                                  ▼
                                CALLED
                                  │
                                  ▼
                              IN_SERVICE
                                  │
                                  ▼
                               COMPLETED
```

Exact projection may derive some queue-linked states rather than mutating appointment redundantly.

Implementation must avoid contradictory state duplication.

---

# 20. STATE PROJECTION DECISION

Queue-specific operational truth belongs primarily to `QueueTicket` / `ServiceSession`.

Appointment may expose citizen-friendly derived state:

```text
CHECKED_IN
WAITING
CALLED
IN_SERVICE
COMPLETED
```

but the implementation should document which fields are stored vs projected.

One source of truth per lifecycle fact.

---

# 21. APPOINTMENT CONFIRMATION

Command:

```text
ConfirmAppointment
```

Preconditions:

- authenticated citizen;
- owned hold;
- hold ACTIVE;
- hold not expired;
- slot still valid;
- service/location valid;
- idempotency valid.

Transaction:

1. claim idempotency record;
2. lock hold/slot as required;
3. revalidate;
4. create appointment;
5. generate server reference;
6. generate check-in credential;
7. mark hold CONSUMED;
8. append event/audit;
9. commit;
10. emit notification asynchronously after commit.

---

# 22. CONFIRMATION IDEMPOTENCY

Same:

```text
actor + operation + idempotency key + fingerprint
```

returns same successful appointment.

Same key with different request fingerprint:

```text
409 IDEMPOTENCY_KEY_REUSED
```

---

# 23. APPOINTMENT REFERENCE

Generated server-side.

Must be:

- unique;
- human-readable;
- non-authoritative for access control;
- independent from UUID.

Exact format remains configurable/provisional.

---

# 24. CHECK-IN CREDENTIAL

The citizen receives a check-in capability separate from appointment reference.

Never encode raw:

- citizenId;
- phone;
- appointment UUID;
- personal details.

Use an opaque/purpose-bound token.

---

# 25. CITIZEN CANCELLATION

Allowed only when backend returns action `CANCEL`.

Rules:

- citizen owns appointment;
- status allows cancellation;
- not checked in;
- policy cutoff satisfied;
- operation idempotent;
- preserve reason/history;
- release future capacity;
- cancel linked active queue ticket if a rare race requires it;
- notify citizen.

---

# 26. CANCELLATION POLICY

Exact cancellation cutoff is **REQUIRES VALIDATION**.

Model it as configuration/policy, not hard-coded minutes.

---

# 27. RESCHEDULING

Safe sequence:

```text
existing confirmed appointment
→ create new hold
→ validate new hold
→ atomic swap
→ new slot becomes appointment slot
→ old capacity released
→ history preserved
```

If new slot fails:

```text
original appointment remains unchanged
```

---

# 28. RESCHEDULE TRANSACTION

The swap should be atomic with respect to:

- old appointment;
- new hold;
- new slot capacity;
- old slot capacity;
- history.

Do not implement:

```text
cancel old
then create new
```

as separate non-atomic commands.

---

# 29. CHECK-IN

Check-in is a formal command.

Supported methods:

```text
QR
MANUAL_CODE
ASSISTED_STAFF
```

No GPS requirement.

---

# 30. CHECK-IN WINDOW

Service-level policy determines:

```text
opensAt = appointment.startsAt - checkInOpenBeforeMinutes
lateBoundary = appointment.startsAt + lateToleranceMinutes
noShowBoundary = appointment.startsAt + noShowAfterMinutes
```

Exact semantics must be encoded in policy/tests.

---

# 31. CHECK-IN TOKEN

Properties:

- opaque or cryptographically protected;
- purpose = CHECK_IN;
- appointment-bound server-side;
- expiration;
- one-time consumption;
- no PII;
- replay-safe;
- rate-limited endpoint;
- audited.

---

# 32. ONE-TIME SEMANTICS

First valid use:

```text
token ACTIVE
→ check-in succeeds
→ token CONSUMED
```

Repeated same citizen request:

return existing successful check-in/ticket where idempotency can be established.

Do not create second ticket.

---

# 33. CHECK-IN ATOMICITY

Required transaction:

```text
Appointment CONFIRMED
+
consume check-in token
+
mark checked in
+
create QueueTicket
=
one transaction
```

If QueueTicket creation fails:

check-in must roll back.

---

# 34. CHECK-IN OWNERSHIP

Citizen check-in:

actor derives from authenticated session.

Never accept:

```text
citizenUserId
```

from citizen request body as authority.

Assisted staff check-in uses staff authorization and records staff actor.

---

# 35. QUEUE

`Queue` is configurable.

Suggested fields:

```text
id UUID
name
locationId
departmentId
serviceId nullable
mode
status
priorityPolicy
createdAt
updatedAt
version
```

---

# 36. QUEUE MODES

Approved:

```text
APPOINTMENT_REQUIRED
WALK_IN_ALLOWED
HYBRID
```

Meaning:

### APPOINTMENT_REQUIRED
Ticket requires valid appointment/check-in.

### WALK_IN_ALLOWED
Ticket may originate without appointment under approved operational flow.

### HYBRID
Both paths allowed.

---

# 37. WALK-IN BOUNDARY

F5 defines the domain capability but must not invent municipal walk-in policy.

If no validated operational workflow exists, UI may keep walk-in creation staff-assisted only until validated.

Do not expose public citizen self-join merely because the enum exists.

---

# 38. QUEUE STATUS

Suggested:

```text
OPEN
PAUSED
CLOSED
```

A queue may exist but not accept new tickets.

---

# 39. QUEUE DESK

Suggested fields:

```text
id UUID
queueId UUID
code
displayName
status
currentStaffUserId nullable
currentServiceSessionId nullable
version
createdAt
updatedAt
```

---

# 40. DESK STATES

Canonical:

```text
CLOSED
OPEN
PAUSED
SERVING
```

---

# 41. DESK TRANSITIONS

```text
CLOSED → OPEN
OPEN → PAUSED
PAUSED → OPEN
OPEN → SERVING
SERVING → OPEN
OPEN/PAUSED → CLOSED
```

Rules:

- capability required;
- queue scope required;
- current active session considered;
- audit actor/time/reason when relevant.

---

# 42. QUEUE TICKET

Suggested fields:

```text
id UUID
queueId UUID
businessDate DATE
publicSequenceNumber
publicCode
citizenUserId nullable
appointmentId nullable
departmentId
serviceId nullable
priorityClass
priorityReason nullable
status
calledDeskId nullable
calledAt nullable
serviceStartedAt nullable
completedAt nullable
version
createdAt
updatedAt
```

---

# 43. QUEUE TICKET STATES

```text
WAITING
CALLED
SERVING
COMPLETED
TRANSFERRED
NO_SHOW
CANCELLED
```

---

# 44. ACTIVE TICKET STATES

Conceptually:

```text
WAITING
CALLED
SERVING
```

A citizen/appointment must not hold multiple active tickets for the same logical visit.

Enforce through application logic plus DB constraint/index where feasible.

---

# 45. QUEUE SEQUENCE

Approved scope:

```text
Queue + businessDate
```

Sequence generation must be concurrency-safe.

Public code may be:

```text
A001
A002
```

Exact prefix formatting is presentation configuration.

The authoritative record uses UUID.

---

# 46. SEQUENCE CONCURRENCY

Do not calculate:

```text
MAX(sequence) + 1
```

without concurrency protection.

Use a safe counter/sequence strategy scoped by Queue + business date.

Possible implementation:

- counter row locked transactionally;
- PostgreSQL-supported allocation strategy.

Decision must be documented in implementation ADR.

---

# 47. PRIORITY

Citizen cannot choose operational priority.

Priority policy is explicit.

Conceptual categories:

```text
NORMAL
PRIORITY_ELIGIBLE
SPECIAL_OPERATIONAL
```

These labels are architectural placeholders until municipal policy validates final categories.

Any override records:

- actor;
- reason;
- time;
- source.

---

# 48. CALL NEXT

Command:

```text
CallNextQueueTicket
```

Backend only chooses next ticket.

Frontend does not submit ticket ID for "next".

---

# 49. CALL NEXT ALGORITHM

Inside transaction:

1. authorize staff capability/scope;
2. validate queue OPEN;
3. validate desk OPEN;
4. select next eligible ticket;
5. lock selected ticket;
6. revalidate eligibility;
7. transition WAITING → CALLED;
8. assign desk;
9. record QueueEvent;
10. commit;
11. emit notification after commit.

---

# 50. CALL NEXT ORDER

Ordering policy is server-defined.

Conceptually:

```text
priority policy
→ queue entry order
```

Exact priority algorithm requires validated municipal rules.

No hidden frontend sorting may change operational order.

---

# 51. CALL NEXT CONCURRENCY

Required test:

```text
Desk A call-next
Desk B call-next
same queue
same instant
```

Expected:

- different tickets, or;
- one gets a no-ticket result.

Never same ticket for both desks.

---

# 52. RECALL

Command:

```text
RecallQueueTicket
```

Allowed from `CALLED`.

Does not create new ticket.

Adds event:

```text
QueueTicketRecalled
```

May update `lastCalledAt`/recall count.

---

# 53. NO SHOW

Approved policy:

policy/job-driven with optional operational confirmation depending configured mode.

No-show must not be an uncontrolled UI status patch.

Command or policy transition only.

---

# 54. TRANSFER

Command:

```text
TransferQueueTicket
```

Requires:

- source ticket active;
- destination queue valid;
- staff capability/scope;
- reason;
- transaction;
- history.

Do not erase prior queue identity/history.

---

# 55. TRANSFER SEMANTICS

Two valid implementation models:

1. same ticket changes queue with immutable transfer event;
2. source ticket becomes TRANSFERRED and a linked destination ticket is created.

The backend agent must choose through ADR based on audit/sequence invariants.

Preferred when public sequence changes by destination queue:

**linked destination ticket**.

---

# 56. SERVICE SESSION

Separate from ticket.

Suggested fields:

```text
id UUID
queueTicketId UUID
deskId UUID
staffUserId UUID
startedAt
endedAt nullable
outcomeCode nullable
notesReference nullable
status
version
```

---

# 57. SERVICE SESSION STATES

```text
ACTIVE
COMPLETED
INTERRUPTED
```

Use only if required by operational flow.

Do not overload QueueTicket with all service-delivery data.

---

# 58. START SERVICE

Command:

```text
StartServiceSession
```

Preconditions:

- ticket CALLED;
- desk matches/authorized;
- no conflicting active session;
- staff allowed.

Transition:

```text
QueueTicket CALLED → SERVING
Desk OPEN → SERVING
ServiceSession ACTIVE
```

atomically.

---

# 59. COMPLETE SERVICE

Command:

```text
CompleteServiceSession
```

Transaction:

```text
ServiceSession ACTIVE → COMPLETED
QueueTicket SERVING → COMPLETED
Desk SERVING → OPEN
```

Emit events after commit.

---

# 60. APPOINTMENT ↔ QUEUE RELATION

Appointment is not queue truth.

Check-in creates queue ticket.

The ticket references appointment.

Citizen appointment detail may project current queue state.

Do not duplicate sequence/position data into appointment table.

---

# 61. QUEUE ETA

P1 minimum:

```text
peopleAhead
lastUpdatedAt
```

P2 enhancement:

```text
estimatedWaitRange
```

only when data quality supports it.

---

# 62. ETA CALCULATION

Potential inputs:

- active tickets ahead;
- recent completed ServiceSession durations;
- number of active desks;
- service/queue segmentation.

Never present false precision.

---

# 63. ETA RESPONSE

Example:

```json
{
  "peopleAhead": 4,
  "estimatedWait": {
    "minMinutes": 15,
    "maxMinutes": 25,
    "confidence": "MEDIUM"
  },
  "lastUpdatedAt": "..."
}
```

If unreliable:

```json
{
  "peopleAhead": 4,
  "estimatedWait": null,
  "lastUpdatedAt": "..."
}
```

---

# 64. PUBLIC DISPLAY

Public display DTO contains only:

```text
ticketCode
deskDisplayName
callState
```

Potentially:

```text
calledAt
```

No:

- citizen name;
- phone;
- email;
- request details;
- citizen ID;
- sensitive service information.

---

# 65. PUBLIC DISPLAY ENDPOINT

Conceptual:

```http
GET /api/v1/public/queues/{queueId}/display
```

Return only currently relevant called/serving ticket projections.

Rate-limit/cache policy may differ from private APIs.

---

# 66. CITIZEN QUEUE DETAIL

Conceptual:

```http
GET /api/v1/citizen/queue-tickets/{ticketId}
```

OWN scope.

Response:

- public ticket code;
- status;
- people ahead;
- ETA if reliable;
- desk when called;
- location;
- lastUpdatedAt;
- availableActions.

---

# 67. LIVE UPDATE V1

Approved:

adaptive polling.

Suggested conceptual strategy:

```text
WAITING:
15–30 seconds

CALLED:
5–10 seconds

background browser/app:
pause or substantially reduce

errors:
exponential backoff + jitter
```

Exact intervals are frontend/mobile implementation configuration, not domain law.

---

# 68. SSE

Deferred.

May replace/enhance polling when operational scale demonstrates need.

No WebSocket requirement in F5.

---

# 69. DOMAIN EVENTS

Canonical minimum:

```text
AppointmentHoldCreated
AppointmentHoldExpired
AppointmentConfirmed
AppointmentCancelled
AppointmentRescheduled
AppointmentCheckedIn

QueueTicketCreated
QueueTicketCalled
QueueTicketRecalled
QueueTicketTransferred
QueueTicketNoShow

ServiceSessionStarted
ServiceSessionCompleted
```

---

# 70. DOMAIN EVENT VS QUEUE EVENT VS AUDIT

### DomainEvent

Business fact used by other modules.

### QueueEvent

Detailed queue lifecycle history.

### AuditEvent

Accountability/security history:

```text
who
what
resource
when
why
context
```

Do not collapse all three into one table just because they contain timestamps.

---

# 71. APPOINTMENT EVENT HISTORY

Citizen-safe timeline may include:

```text
Appointment confirmed
Appointment rescheduled
Check-in completed
Appointment cancelled
```

Internal audit may contain more detail.

---

# 72. QUEUE EVENT HISTORY

Potential event types:

```text
CREATED
CALLED
RECALLED
SERVICE_STARTED
COMPLETED
TRANSFERRED
NO_SHOW
CANCELLED
```

Each records relevant actor/time/context.

---

# 73. NOTIFICATION POLICY

Domain event does not automatically mean push.

Pipeline:

```text
DomainEvent
→ NotificationPolicy
→ NotificationJob
→ Channel adapters
```

---

# 74. F5 NOTIFICATIONS

Candidate notifications:

```text
AppointmentConfirmed
AppointmentReminder
AppointmentRescheduled
AppointmentCancelled
QueueTicketCalled
QueueTicketTransferred where useful
```

Exact reminder schedule requires validation/configuration.

---

# 75. PUSH AUTHORITY

Push is advisory.

Flow:

```text
QueueTicketCalled
→ push notification
→ citizen taps notification
→ app opens/deep-links
→ GET authoritative ticket
→ render current state
```

Never trust push payload as final business state.

---

# 76. PUSH PRIVACY

Preferred:

```text
"A sua senha foi chamada."
```

Avoid lock-screen PII.

Push payload should carry:

- notification ID;
- safe resource reference/token;
- route/deep-link key.

Not sensitive case detail.

---

# 77. MOBILE READINESS

F5 must be consumable by future React Native citizen app.

Native features relevant:

- push notification;
- camera QR scan;
- manual check-in code;
- secure storage;
- deep links;
- app lifecycle refresh;
- connectivity awareness.

---

# 78. CAMERA PERMISSION

Mobile asks camera permission only when user selects QR scan.

If denied:

manual code remains available.

No GPS dependency.

---

# 79. QR SCAN MOBILE FLOW

```text
Appointment Detail
→ Check in
→ Explain camera use
→ Request camera permission
→ Scan QR
→ POST check-in token
→ Server validates
→ QueueTicket returned
→ Navigate to Digital Ticket
```

Fallback:

```text
Enter code manually
```

---

# 80. MOBILE DEEP LINKS

Conceptual:

```text
boaneconecta://appointments/{id}
boaneconecta://queue/{ticketId}
```

Universal/app links later when production domain is validated.

Deep link grants navigation only, never authorization.

---

# 81. APP BACKGROUND

When app backgrounds:

- reduce/pause polling;
- push may notify;
- on foreground, re-fetch authoritative state.

Do not expect guaranteed background polling.

---

# 82. CONNECTIVITY

If offline:

- show last known ticket with stale indicator if safely cached;
- do not claim current queue position;
- refresh when connectivity returns.

Check-in itself requires confirmed server response.

---

# 83. API GROUPS

Citizen:

```text
/api/v1/citizen/appointments/*
/api/v1/citizen/queue-tickets/*
```

Admin/operational:

```text
/api/v1/admin/appointments/*
/api/v1/admin/queues/*
```

Public:

```text
/api/v1/public/queues/*
```

Exact paths may adapt to existing conventions.

---

# 84. AVAILABILITY ENDPOINT

Conceptual:

```http
GET /api/v1/citizen/appointments/availability
```

Parameters:

```text
serviceId
locationId optional according to flow
from
to
```

Response is read-only availability projection.

---

# 85. AVAILABILITY RESPONSE

Example:

```json
{
  "serviceId": "uuid",
  "locationId": "uuid",
  "days": [
    {
      "date": "2026-09-01",
      "slots": [
        {
          "slotId": "uuid",
          "startsAt": "...",
          "endsAt": "...",
          "remainingCapacity": 2,
          "availability": "AVAILABLE"
        }
      ]
    }
  ]
}
```

Do not expose internal capacity math beyond useful projection.

---

# 86. CREATE HOLD ENDPOINT

Conceptual:

```http
POST /api/v1/citizen/appointment-holds
Idempotency-Key: ...
```

Request:

```json
{
  "slotId": "uuid"
}
```

Response:

```json
{
  "holdId": "uuid",
  "expiresAt": "...",
  "version": 1
}
```

The hold token may remain HTTP-only/server-linked depending client flow; do not expose sensitive token unless actually needed.

---

# 87. CONFIRM APPOINTMENT

Conceptual:

```http
POST /api/v1/citizen/appointment-holds/{holdId}/confirm
Idempotency-Key: ...
If-Match: "..."
```

Response:

```json
{
  "appointmentId": "uuid",
  "reference": "...",
  "status": "CONFIRMED",
  "startsAt": "...",
  "availableActions": ["CANCEL", "RESCHEDULE"]
}
```

---

# 88. APPOINTMENT DETAIL

```http
GET /api/v1/citizen/appointments/{appointmentId}
```

OWN scope.

Response:

- reference;
- service;
- location;
- date/time;
- friendly state;
- arrival instructions when validated;
- check-in availability;
- queue state if present;
- availableActions.

No staff internals.

---

# 89. CANCEL APPOINTMENT

```http
POST /api/v1/citizen/appointments/{id}/cancel
Idempotency-Key: ...
```

Optional reason depending policy.

---

# 90. RESCHEDULE START

Can reuse hold endpoint for desired new slot.

Then:

```http
POST /api/v1/citizen/appointments/{id}/reschedule
Idempotency-Key: ...
```

Request references owned active new hold.

Backend performs atomic swap.

---

# 91. CHECK-IN ENDPOINT

Conceptual:

```http
POST /api/v1/citizen/appointments/{id}/check-in
Idempotency-Key: ...
```

Request:

```json
{
  "method": "QR",
  "credential": "opaque-value"
}
```

Manual uses same contract with method.

---

# 92. ASSISTED CHECK-IN

Operational endpoint:

```http
POST /api/v1/admin/appointments/{id}/check-in
```

Requires capability/scope.

Records staff actor.

May use appointment reference/manual lookup under controlled UI.

---

# 93. CHECK-IN RESPONSE

```json
{
  "appointmentId": "uuid",
  "appointmentStatus": "CHECKED_IN",
  "queueTicket": {
    "id": "uuid",
    "code": "A023",
    "status": "WAITING"
  }
}
```

Repeated idempotent success returns same ticket.

---

# 94. QUEUE CALL NEXT ENDPOINT

```http
POST /api/v1/admin/queues/{queueId}/desks/{deskId}/call-next
Idempotency-Key: ...
```

No ticket ID in request.

---

# 95. START SERVICE ENDPOINT

```http
POST /api/v1/admin/queue-tickets/{ticketId}/start-service
```

Capability and desk context required.

---

# 96. COMPLETE SERVICE ENDPOINT

```http
POST /api/v1/admin/service-sessions/{sessionId}/complete
```

Body may include validated outcome code later.

---

# 97. TRANSFER ENDPOINT

```http
POST /api/v1/admin/queue-tickets/{ticketId}/transfer
```

Request:

```json
{
  "destinationQueueId": "uuid",
  "reason": "..."
}
```

Reason mandatory.

---

# 98. NO-SHOW ENDPOINT

Operational:

```http
POST /api/v1/admin/queue-tickets/{ticketId}/no-show
```

or policy job transitions where configured.

---

# 99. AVAILABLE ACTIONS

Backend should calculate available actions.

Citizen example:

```json
{
  "availableActions": [
    "CANCEL",
    "RESCHEDULE",
    "CHECK_IN"
  ]
}
```

Staff desk example:

```json
{
  "availableActions": [
    "CALL_NEXT",
    "PAUSE_DESK"
  ]
}
```

Frontend/mobile must not recreate state machine policy independently.

---

# 100. CAPABILITIES

Appointment:

```text
appointments.read
appointments.create
appointments.reschedule
appointments.cancel
appointments.checkin
appointments.manage_capacity
```

Queue:

```text
queue.read
queue.join
queue.call_next
queue.recall
queue.transfer
queue.complete
queue.mark_no_show
queue.manage_desk
```

---

# 101. CITIZEN SCOPES

Citizen:

```text
OWN
```

for:

- holds;
- appointments;
- queue tickets.

Public display is a separate sanitized public projection.

---

# 102. STAFF SCOPES

Likely:

```text
ASSIGNED
TEAM
DEPARTMENT
TERRITORY
```

depending operation.

Do not grant municipality-wide/global scope by role name alone.

---

# 103. CAPACITY MANAGEMENT

Requires:

```text
appointments.manage_capacity
```

plus appropriate location/department/service scope.

Actions:

- create/activate schedule rule;
- block slot;
- cancel slot;
- change future capacity under rules.

Changing capacity below already committed occupancy must be rejected or handled explicitly.

---

# 104. AUTHORIZATION MODEL

Every command evaluates:

```text
ROLE
+
CAPABILITY
+
RESOURCE
+
SCOPE
+
CONTEXT
```

Example:

```text
Actor: Front Desk Staff
Capability: queue.call_next
Resource: Queue X
Scope: DEPARTMENT
Context:
  queue OPEN
  desk OPEN
  no active conflicting service
```

---

# 105. HTTP PROTECTION

Required:

- Bean Validation;
- enum validation;
- UUID validation;
- request size limits;
- rate limits;
- idempotency where critical;
- structured errors;
- no ownership leak;
- no stack traces;
- restricted CORS;
- secure headers;
- sanitized logs.

---

# 106. RATE LIMIT TARGETS

Apply operation-specific limits to:

- availability search;
- hold creation;
- confirmation;
- check-in credential attempts;
- public display;
- call-next abuse protection where relevant.

Exact thresholds are infrastructure/config decisions.

---

# 107. CHECK-IN BRUTE FORCE

Manual/QR credential verification must resist guessing.

Requirements:

- high entropy;
- rate limiting;
- expiration;
- purpose binding;
- no sequential secret;
- audit repeated failures.

---

# 108. ERROR CODES

Minimum stable F5 codes:

```text
APPOINTMENT_SLOT_NOT_AVAILABLE
APPOINTMENT_SLOT_CAPACITY_REACHED
APPOINTMENT_HOLD_NOT_FOUND
APPOINTMENT_HOLD_EXPIRED
APPOINTMENT_HOLD_ALREADY_CONSUMED
APPOINTMENT_NOT_FOUND
APPOINTMENT_STATE_CONFLICT
APPOINTMENT_CANCELLATION_NOT_ALLOWED
APPOINTMENT_RESCHEDULE_NOT_ALLOWED
CHECK_IN_NOT_OPEN
CHECK_IN_TOO_LATE
CHECK_IN_CREDENTIAL_INVALID
CHECK_IN_ALREADY_COMPLETED
QUEUE_NOT_AVAILABLE
QUEUE_TICKET_NOT_FOUND
QUEUE_TICKET_ALREADY_ACTIVE
QUEUE_STATE_CONFLICT
QUEUE_DESK_NOT_OPEN
QUEUE_NO_WAITING_TICKETS
QUEUE_TRANSFER_NOT_ALLOWED
IDEMPOTENCY_KEY_REQUIRED
IDEMPOTENCY_KEY_REUSED
RATE_LIMITED
```

---

# 109. HTTP MAPPING

General direction:

```text
400 invalid transport
401 unauthenticated
403 capability forbidden when safe
404 owned resource absent/not visible
409 concurrency/state/capacity/idempotency conflict
422 semantic validation if project convention supports it
429 rate limited
```

Stay consistent with existing API conventions.

---

# 110. DATABASE MIGRATIONS

Use additive Flyway migrations.

Potential split:

1. appointment schedule rules;
2. appointment slots;
3. appointment holds;
4. appointment extensions/migration from legacy status;
5. queues;
6. queue desks;
7. queue tickets;
8. queue events;
9. service sessions;
10. indexes/constraints.

Exact migration numbers follow repository current sequence.

---

# 111. LEGACY APPOINTMENTS

Existing appointment data must remain readable.

If legacy `SCHEDULED` exists:

- preserve;
- migrate safely if mapping is unambiguous;
- otherwise support compatibility projection.

Do not rewrite historical rows destructively without proof.

---

# 112. REQUIRED CONSTRAINTS

Potential DB constraints:

- slot capacity > 0;
- slot end > start;
- one active queue ticket per appointment;
- unique appointment reference;
- unique Queue + businessDate + public sequence;
- valid FKs;
- version fields;
- non-null state;
- service session one active per ticket.

Where PostgreSQL partial unique indexes are appropriate, test them with PostgreSQL Testcontainers.

---

# 113. INDEXES

Likely query indexes:

```text
slot(service_id, location_id, starts_at, status)
hold(slot_id, status, expires_at)
hold(citizen_user_id, status)
appointment(citizen_user_id, starts_at, status)
appointment(slot_id, status)
queue_ticket(queue_id, business_date, status, created_at)
queue_ticket(citizen_user_id, status)
queue_ticket(appointment_id)
queue_event(ticket_id, occurred_at)
service_session(desk_id, status)
```

Validate with real query plans later.

---

# 114. OPTIMISTIC LOCKING

Use `@Version` for:

- schedule rule where concurrent edits;
- slot;
- hold if mutated;
- appointment;
- queue;
- desk;
- ticket;
- service session.

Critical selection/allocation still may require pessimistic row lock.

---

# 115. IDEMPOTENCY

Required commands:

- create hold;
- confirm appointment;
- cancel;
- reschedule;
- check-in;
- call-next where retry may duplicate effect;
- transfer where appropriate.

Persist idempotency result.

Do not keep only in-memory map.

---

# 116. TIME

Business timezone:

```text
Africa/Maputo
```

Store timestamps using timezone-safe semantics.

Business date for queue sequence is derived in authoritative municipal timezone.

---

# 117. CLOCK

Inject `Clock`.

Do not scatter:

```java
Instant.now()
LocalDate.now()
```

through business logic.

This is mandatory for deterministic hold/check-in/no-show tests.

---

# 118. DOMAIN SERVICES

Suggested cohesive services:

```text
AppointmentAvailabilityService
AppointmentHoldService
AppointmentService
AppointmentPolicyService
CheckInService
QueueService
QueueTicketService
QueueSelectionService
QueueDeskService
ServiceSessionService
QueueEstimateService
```

Avoid one giant `AppointmentService` or `QueueService` doing everything.

---

# 119. CONTROLLERS

Controllers:

- parse transport;
- validate DTO;
- authorize entry if annotation/policy;
- call application service;
- map response.

No capacity math in controllers.

---

# 120. REPOSITORIES

Repositories expose domain-oriented queries.

Avoid:

```text
findAll()
```

for availability or queue operations.

---

# 121. TRANSACTIONAL OUTBOX

Notifications should be triggered through reliable after-commit event/outbox strategy when available.

Core appointment/check-in transaction must not fail because push provider is unavailable.

---

# 122. NOTIFICATION FAILURE

If push fails after appointment committed:

- appointment remains confirmed;
- notification job retries;
- delivery failure observable.

Never roll back business truth due to optional communication channel.

---

# 123. AUDIT EVENTS

Audit at least:

- capacity changes;
- hold creation failure from suspicious patterns where useful;
- appointment confirm/cancel/reschedule;
- assisted check-in;
- failed credential attempts above policy;
- queue priority override;
- call-next;
- transfer;
- no-show;
- service start/complete;
- permission denial on sensitive operation.

---

# 124. OBSERVABILITY METRICS

Technical/domain:

```text
appointment_hold_created_total
appointment_hold_expired_total
appointment_hold_conflict_total
appointment_confirmed_total
appointment_cancelled_total
appointment_rescheduled_total
appointment_checkin_total
appointment_checkin_failure_total
queue_ticket_created_total
queue_call_next_total
queue_call_next_conflict_total
queue_waiting_count
queue_wait_seconds
service_session_duration_seconds
```

Naming follows actual metrics library conventions.

---

# 125. CORRELATION

Correlation ID should connect:

```text
check-in HTTP
→ appointment transition
→ QueueTicket creation
→ audit
→ domain event
→ push job
```

---

# 126. LOGGING

Do not log:

- QR/check-in credential;
- hold token;
- PII;
- full push payload if sensitive;
- citizen document data.

Safe references:

- appointment UUID/reference where policy permits;
- queue ticket internal ID;
- correlation ID;
- actor internal ID.

---

# 127. BACKUP / RECOVERY

F5 data is business-critical.

Existing platform backup strategy must cover:

- appointments;
- holds needed for in-flight correctness;
- queues;
- ticket history;
- sessions;
- audit.

After restore, derived ephemeral holds with expired timestamps remain safely invalid due to lazy expiration.

---

# 128. FAILURE MODE — APP CRASH AFTER HOLD

Hold remains until expires.

Citizen can:

- resume owned active hold if frontend policy supports it;
- otherwise select again after expiration.

No capacity leak beyond TTL.

---

# 129. FAILURE MODE — CONFIRM RESPONSE LOST

Client must use idempotency/status recovery.

Do not create second appointment.

---

# 130. FAILURE MODE — CHECK-IN RESPONSE LOST

Repeated idempotent check-in returns existing QueueTicket.

No duplicate ticket.

---

# 131. FAILURE MODE — PUSH DOWN

Queue truth remains API.

Polling/foreground refresh works.

Push is retried asynchronously.

---

# 132. FAILURE MODE — CLOCK SKEW

Backend clock is authority.

Client countdown is display only and should reconcile with server timestamps.

---

# 133. FAILURE MODE — CLEANUP JOB DOWN

Because lazy expiration is approved, expired holds no longer count toward capacity even if cleanup does not run.

This is a key invariant of F5-D08.

---

# 134. FAILURE MODE — TWO CALL-NEXT REQUESTS

Transactional locking ensures one ticket cannot be claimed twice.

---

# 135. FAILURE MODE — RESCHEDULE NEW SLOT LOST

Atomic transaction preserves old appointment if new allocation cannot complete.

---

# 136. FAILURE MODE — DISPLAY PUBLIC

Public display failure must not affect internal queue operation.

Display projection is read-only.

---

# 137. FRONTEND CITIZEN F5

Required screens/patterns:

```text
Appointments List
Appointment Booking
Slot Selection
Hold Countdown
Booking Review
Booking Confirmation
Appointment Detail
Check-in
Digital Queue Ticket
```

---

# 138. APPOINTMENTS LIST

Sections:

- upcoming;
- past/history.

Empty:

- explain no upcoming appointments;
- action to find/book service where appropriate.

---

# 139. SLOT UI

States:

```text
AVAILABLE
SELECTED
HELD_BY_ME
UNAVAILABLE
```

Do not communicate solely by color.

---

# 140. HOLD COUNTDOWN

Countdown uses server `expiresAt`.

When zero:

- hold treated expired;
- confirmation disabled;
- refresh availability.

Do not assume client timer makes expiration authoritative.

---

# 141. BOOKING REVIEW

Show:

- service;
- location;
- date;
- time;
- relevant instructions;
- cancellation policy if validated.

Primary:

Confirm appointment.

---

# 142. CONFIRMATION

No confetti.

Show:

- reference;
- time/location;
- next step;
- add to calendar optional later;
- notification permission contextually if useful.

---

# 143. APPOINTMENT DETAIL

Priority:

1. state;
2. next action;
3. date/time;
4. location;
5. instructions;
6. actions;
7. history.

Use `availableActions`.

---

# 144. CHECK-IN UI

Methods:

- scan QR;
- enter code manually.

Assisted staff is not a citizen UI action.

Camera prompt only after user chooses scan.

---

# 145. DIGITAL TICKET

Priority:

```text
Ticket code
Status
People ahead
ETA if available
Desk when called
Last updated
```

`CALLED` must be highly perceptible with text/icon, not color only.

---

# 146. POLLING UX

Pause/reduce when:

- document hidden;
- app background.

Refresh immediately:

- foreground;
- push deep link;
- reconnect.

---

# 147. OFFLINE UX

If offline:

```text
Last updated: ...
Current status may be outdated.
```

Do not show stale ETA as current certainty.

---

# 148. RESPONSIVE WEB QA

Required:

- 320;
- 375/390;
- 430;
- 768;
- 1024;
- 1280;
- 1440;
- 1920;
- 200% zoom;
- keyboard;
- reduced motion;
- screen reader critical path.

---

# 149. MOBILE F5 READINESS

React Native implementation later must support:

- camera denied;
- notification denied;
- offline;
- cold start from push;
- background → foreground;
- QR invalid;
- QR consumed;
- session expired;
- idempotent retry;
- slow network.

---

# 150. MINIMUM ADMIN F5

Allowed operational UI only:

- schedule/capacity management;
- agenda;
- assisted check-in;
- queue;
- desk state;
- call next;
- recall;
- start service;
- complete;
- no-show;
- transfer;
- public display.

Do not expand into F6 full operations workspace.

---

# 151. STAFF QUEUE VIEW

Prioritize:

- current desk state;
- current called/serving ticket;
- waiting queue;
- call-next action;
- exceptions.

Do not make KPI dashboard.

---

# 152. PUBLIC DISPLAY VIEW

Full-screen-friendly.

Only:

```text
Senha
Balcão
```

Optional audio call is future/native/display decision and not part of F5 unless authorized.

---

# 153. TEST STRATEGY

## Unit

- hold expiry;
- capacity policy;
- check-in timing;
- state machines;
- cancellation;
- reschedule policy;
- priority ordering;
- ETA;
- availableActions.

## PostgreSQL integration

- last seat race;
- idempotent confirmation;
- active ticket uniqueness;
- queue sequence concurrency;
- call-next concurrency;
- transaction rollback;
- partial unique indexes;
- legacy migration.

## Security

- citizen A vs citizen B appointment;
- citizen A vs B hold;
- citizen A vs B ticket;
- forged QR;
- expired QR;
- reused QR;
- brute force/rate limit;
- staff capability/scope;
- public display PII scan.

## Contract

- availability;
- hold;
- confirmation;
- detail;
- cancellation;
- reschedule;
- check-in;
- digital ticket;
- admin queue;
- public display.

---

# 154. REQUIRED CONCURRENCY TESTS

1. Two citizens compete for one remaining capacity.
2. Same idempotency key confirm twice.
3. Different keys try to consume same hold.
4. Two check-ins at same time.
5. Two queue ticket creation attempts.
6. Two desks call-next simultaneously.
7. Two sequence allocations concurrently.
8. Reschedule competes for final target slot.

---

# 155. REQUIRED SECURITY TESTS

1. IDOR hold.
2. IDOR appointment.
3. IDOR ticket.
4. mass assignment citizen priority.
5. mass assignment status.
6. invalid/forged check-in token.
7. expired token.
8. replay token.
9. rate limit manual code attempts.
10. unauthorized capacity management.
11. unauthorized call-next.
12. public display contains no PII.

---

# 156. REQUIRED MIGRATION TESTS

- clean PostgreSQL;
- upgrade from current schema;
- legacy appointments;
- indexes;
- constraints;
- foreign keys;
- enum compatibility;
- rollback via forward corrective strategy.

---

# 157. PERFORMANCE TESTS

Measure:

- availability query under expected range;
- simultaneous hold burst;
- ticket polling;
- call-next;
- public display polling;
- queue with significant history.

Do not invent production SLO without infrastructure data.

---

# 158. ACCESSIBILITY TESTS

Citizen web:

- keyboard booking;
- countdown accessible;
- non-color slot states;
- QR fallback;
- queue called state;
- zoom;
- screen reader names.

---

# 159. QUALITY GATES

Backend:

```text
mvn test
integration tests with PostgreSQL
Flyway validation
authorization/security tests
concurrency tests
secret scan
git diff --check
```

Frontend:

```text
npm run lint
npx tsc -p tsconfig.app.json --noEmit
npm run test
npm run build
viewport QA
```

CI must be green.

---

# 160. DEFINITION OF DONE

F5 is complete only when:

1. schedules generate valid materialized slots;
2. availability is server-authoritative;
3. capacity cannot be exceeded under concurrency;
4. holds are separate, owned and expiring;
5. lazy expiration prevents stale capacity consumption;
6. confirmation is atomic/idempotent;
7. cancellation is policy-controlled;
8. rescheduling is atomic and preserves original on failure;
9. check-in uses QR/manual/assisted methods;
10. QR has no PII and is one-time;
11. check-in atomically creates one queue ticket;
12. queues support approved modes;
13. public sequence is queue+date scoped and concurrency-safe;
14. citizen cannot choose position/priority;
15. call-next is server-selected and concurrency-safe;
16. QueueTicket and ServiceSession remain separate;
17. public display exposes no PII;
18. citizen sees safe ticket projection;
19. polling behaves efficiently;
20. push is advisory only;
21. domain events/audit are separated;
22. all permissions are backend enforced;
23. PostgreSQL migrations pass;
24. security/concurrency/idempotency tests pass;
25. responsive/accessibility QA passes;
26. backend/frontend handoff is documented;
27. F6 is not started.

---

# 161. IMPLEMENTATION LAYERS

```text
L0 Guardrails / Baseline / ADR
L1 Domain + Migrations
L2 Slot generation + Availability
L3 Hold + Capacity Concurrency
L4 Appointment Commands
L5 Check-in
L6 Queue + Desk + Ticket
L7 ServiceSession + Operations
L8 Permissions + API Contracts
L9 Events + Notifications + Audit
L10 Citizen Web
L11 Mobile Readiness
L12 Observability + Performance
L13 Tests + Release Gate
```

---

# 162. L0 — BASELINE

Before editing:

- repo;
- branch;
- HEAD;
- clean tree;
- JDK;
- Maven;
- Spring Boot;
- Flyway;
- PostgreSQL;
- existing Appointment;
- existing security;
- existing notification;
- tests;
- CI.

Produce audit.

---

# 163. L1 — DOMAIN / MIGRATIONS

Implement:

- schedule rules;
- slots;
- holds;
- queue;
- desk;
- ticket;
- events;
- ServiceSession;
- compatibility.

Gate:

migrations validated before application workflow.

---

# 164. L2 — AVAILABILITY

Implement:

- generation/materialization;
- server availability;
- service/location filters;
- past/blocked filtering;
- remaining capacity projection.

Gate:

no frontend-derived capacity.

---

# 165. L3 — HOLD

Implement:

- create;
- ownership;
- TTL global config;
- lazy expiry;
- row lock;
- idempotency;
- last-seat test.

Gate:

capacity race proven safe.

---

# 166. L4 — APPOINTMENT COMMANDS

Implement:

- confirm;
- cancel;
- reschedule;
- detail;
- availableActions.

Gate:

atomic/idempotent behavior.

---

# 167. L5 — CHECK-IN

Implement:

- service timing policy;
- QR/manual;
- staff assisted;
- credential security;
- rate limit;
- atomic ticket creation.

Gate:

duplicate/replay/ownership tests.

---

# 168. L6 — QUEUE

Implement:

- modes;
- sequence;
- ticket state;
- priority policy;
- call-next;
- recall;
- transfer;
- no-show.

Gate:

call-next concurrency and public PII.

---

# 169. L7 — SERVICE SESSION

Implement:

- start;
- complete;
- desk transitions;
- durations.

Gate:

consistent ticket/desk/session transaction.

---

# 170. L8 — SECURITY / CONTRACTS

Finalize:

- capabilities;
- scopes;
- errors;
- OpenAPI;
- DTOs;
- rate limiting;
- availableActions.

Gate:

frontend/mobile can integrate without assumptions.

---

# 171. L9 — EVENTS / NOTIFICATIONS

Implement:

- domain events;
- queue events;
- audit;
- push/in-app notification policy hooks;
- outbox if platform provides it.

Gate:

provider failure cannot roll back business transaction.

---

# 172. L10 — CITIZEN WEB

Implement exact F5 screens only.

Do not redesign unrelated citizen portal.

---

# 173. L11 — MOBILE READINESS

No full React Native implementation unless separately authorized.

But backend contracts must support:

- mobile auth;
- unstable network;
- push;
- deep links;
- QR camera;
- old client versions.

---

# 174. L12 — OBSERVABILITY

Metrics, logs, traces/correlation, failure handling.

---

# 175. L13 — RELEASE GATE

Full tests, migrations, screenshots, docs, final report.

STOP before F6.

---

# 176. RECOMMENDED COMMITS

```text
docs(f5): freeze appointment and queue domain decisions
feat(backend): add appointment schedule rules and slots
feat(backend): add capacity-safe appointment holds
feat(backend): implement appointment confirmation and rescheduling
feat(backend): add secure check-in and queue ticket creation
feat(backend): introduce queue desks tickets and service sessions
feat(backend): add queue operational commands
feat(backend): add f5 events notifications and audit
test(backend): cover f5 concurrency authorization and migrations
feat(frontend): implement citizen appointment booking
feat(frontend): implement check-in and digital queue ticket
test(frontend): cover f5 responsive and accessibility behavior
docs(f5): document contracts operations and handoff
```

Actual split may adapt to diff.

---

# 177. STARTUP PROMPT FOR CHATGPT WORK

> You are implementing **Boane Conecta F5 — Appointments + Check-in + Queue**.
>
> Before modifying any code, read all canonical project authorities and this file:
>
> `BOANE_CONECTA_F5_APPOINTMENTS_QUEUE_ENGINEERING_SPEC_V1.md`
>
> Treat this specification as the phase-specific authority for F5. The 23 user-approved option decisions in Section 3 are frozen unless a security/domain contradiction is discovered. Non-option technical recommendations remain provisional/default unless required by another canonical authority.
>
> Current objective:
>
> `Service → Availability → Hold → Confirm Appointment → Arrival → Check-in → QueueTicket → Called → ServiceSession → Complete`
>
> Preserve the canonical distinctions:
>
> - `AppointmentSlot != AppointmentHold`
> - `AppointmentHold != Appointment`
> - `Appointment != QueueTicket`
> - `QueueTicket != ServiceSession`
> - `QueueEvent != AuditEvent != DomainEvent`
>
> Begin read-only. Confirm repository identity, branch, clean status, HEAD, JDK, Maven, Spring Boot, PostgreSQL/Flyway, current appointment model, security capabilities, notification infrastructure, tests and CI.
>
> Produce a concise baseline and any ADRs required before migrations.
>
> Execute layers L0–L13 incrementally.
>
> F5 critical invariants:
>
> 1. server owns capacity;
> 2. two concurrent actors can never exceed slot capacity;
> 3. hold TTL is globally configurable;
> 4. expired holds stop consuming capacity through lazy expiration;
> 5. confirmation is idempotent;
> 6. rescheduling obtains the new hold before atomically releasing the old slot;
> 7. check-in supports QR, manual code and assisted staff;
> 8. GPS is not required;
> 9. QR/check-in credential contains no PII and is one-time;
> 10. check-in + QueueTicket creation is one transaction;
> 11. Queue supports APPOINTMENT_REQUIRED / WALK_IN_ALLOWED / HYBRID;
> 12. citizen never controls queue position or operational priority;
> 13. queue sequence is scoped to Queue + Africa/Maputo business date;
> 14. `call-next` selects the next ticket on the backend under transactional concurrency protection;
> 15. public display exposes only safe ticket/desk projection;
> 16. polling is F5 V1 live-update strategy;
> 17. push is advisory only and API remains authoritative;
> 18. `availableActions` are calculated by the backend;
> 19. authorization uses ROLE + CAPABILITY + RESOURCE + SCOPE + CONTEXT;
> 20. F6 is not authorized.
>
> Where this specification contains a non-option technical recommendation, treat it as a default engineering proposal rather than a direct user-selected decision unless another canonical authority already makes it mandatory.
>
> Use PostgreSQL Testcontainers for production-relevant migration/concurrency testing.
>
> Do not use Java `synchronized` as distributed booking protection.
> Do not calculate `MAX(sequence)+1` without concurrency control.
> Do not create duplicate tickets on retried check-in.
> Do not expose raw QR tokens, PII or internal notes in logs/public DTOs.
> Do not use frontend visibility as authorization.
> Do not modify `master`, force-push or start F6.
>
> At completion provide:
>
> - branch/base/HEAD/commits;
> - migration list;
> - domain entities;
> - state machines;
> - REST/OpenAPI contracts;
> - capabilities/scopes;
> - error codes;
> - idempotency behavior;
> - locking/concurrency strategy;
> - notification/event behavior;
> - audit/metrics;
> - security evidence;
> - PostgreSQL migration evidence;
> - concurrency test evidence;
> - frontend/mobile handoff;
> - known risks/deferred decisions;
> - confirmation F6 not started.
>
> Stop at the F5 release gate.

---

# 177A. DECISION CORRECTION RECORD

This revision corrects the interpretation of the user's option sequence.

Previous draft incorrectly mapped some non-option recommendations as if they had been explicitly selected.

Correct interpretation:

- only the 23 A/B/C/D questions are part of the user's sequence;
- question 12 was clarified explicitly as **B**;
- non-option recommendations are no longer attributed to the user as selected choices;
- security/domain invariants from higher canonical authorities remain enforceable independently of preference mapping.

This correction changes decision provenance, not the core security guarantees of F5.

---

# 178. FINAL ENGINEERING RULE

F5 is not a calendar widget plus a queue screen.

It is a concurrency-sensitive municipal scheduling and service-delivery subsystem.

Correctness order:

```text
Security
→ Ownership
→ Capacity
→ Transactionality
→ Idempotency
→ State Machine
→ Audit
→ API Contract
→ UX
→ Visual Polish
```

The frontend and future React Native application present and request operations.

**The backend remains authoritative over time, capacity, identity, queue order, transitions, and permitted actions.**

---

**END — BOANE CONECTA F5 APPOINTMENTS, CHECK-IN & QUEUE ENGINEERING SPEC V1**

