# BOANE CONECTA — BACKEND ARCHITECTURE, INFRASTRUCTURE & OPERATIONS ATLAS V1

**Status:** Canonical backend/infrastructure systems atlas
**Purpose:** map the complete backend stack, bounded contexts, infrastructure layers, runtime topology, trust boundaries, operational responsibilities, failure modes and future scaling paths.

---

# 0. SYSTEM MAP

```text
WEB PUBLIC
WEB CITIZEN
WEB STAFF
WEB EXECUTIVE
REACT NATIVE CITIZEN APP
        │
        ▼
DNS
        │
        ▼
TLS / EDGE
        │
        ├── CDN — public assets only
        ├── WAF
        └── Rate / abuse edge controls
        │
        ▼
LOAD BALANCER / REVERSE PROXY
        │
        ▼
SPRING BOOT APPLICATION
        │
        ├── Spring Security
        ├── Authorization Policy
        ├── API
        ├── Application Services
        ├── Domain Modules
        ├── Workflow / Rules
        ├── Outbox
        └── Observability
        │
        ├───────────────┬───────────────┬───────────────┐
        ▼               ▼               ▼               ▼
 PostgreSQL          Redis        Object Storage     Provider APIs
        │               │               │               │
        ▼               ▼               ▼               ▼
 backups         ephemeral/cache     files        payment/messages/
 recovery        rate/holds          quarantine    push/email/scanner
```

---

# 1. TRUST ZONES

## Zone 0 — Public Internet

Untrusted.

Includes:

- browser;
- mobile device;
- bots;
- third-party providers.

Every input is untrusted.

## Zone 1 — Edge

Responsibilities:

- TLS;
- WAF;
- public rate controls;
- request-size limits;
- CDN;
- routing.

## Zone 2 — Application

Trusted runtime, but still assumes compromised/malformed inputs.

## Zone 3 — Data

Private:

- PostgreSQL;
- Redis;
- private object storage;
- backups.

## Zone 4 — Administration

Privileged:

- CI/CD;
- secret manager;
- infrastructure management;
- monitoring.

Strongest access controls required.

---

# 2. BOUNDED CONTEXT ATLAS

## Identity & Access

Owns:

- users;
- credentials;
- sessions;
- refresh tokens;
- MFA later;
- roles;
- memberships;
- capabilities;
- scope grants.

Does not own:

- case assignment;
- citizen service definitions.

## Organization & Territory

Owns:

- municipal organization tree;
- departments;
- teams;
- service desks;
- territory hierarchy.

## Service Catalog

Owns:

- MunicipalService;
- ServiceVersion;
- requirements;
- fee definitions;
- submission channels;
- service availability;
- form linkage.

## Requests

Owns:

- RequestDraft;
- CitizenRequest;
- answer snapshots;
- citizen request history.

## Case Management

Owns:

- Case;
- workflow instance;
- assignment;
- tasks;
- decisions;
- SLA operational state.

## Documents & Media

Owns:

- Document;
- DocumentVersion;
- classification;
- storage metadata;
- scan lifecycle;
- access policy.

## Appointments

Owns:

- appointment;
- location;
- slot;
- hold;
- check-in relation.

## Queue

Owns:

- Queue;
- Desk;
- QueueTicket;
- QueueEvent;
- ServiceSession.

## Finance

Owns:

- obligation;
- payment intent;
- provider transaction;
- adjustment;
- receipt;
- reconciliation.

## Communication

Owns:

- news;
- communiqué;
- alert;
- event;
- notification policy/delivery.

## Protocol

Owns:

- formal request/correspondence;
- triage;
- destination;
- decision;
- scheduling link;
- follow-up.

## Funding

Owns:

- program;
- call;
- application;
- reviewer assignment;
- evaluation;
- committee decision;
- award;
- monitoring.

## Projects & Transparency

Owns:

- project;
- milestone;
- public status;
- approved transparency projection.

## Reporting

Owns:

- metric definition;
- internal report;
- executive view;
- public snapshot.

---

# 3. SHARED PLATFORM SERVICES

These must not be recreated per feature:

- audit;
- notification delivery;
- workflow;
- rules;
- business calendar;
- SLA;
- idempotency;
- object storage;
- correlation IDs;
- domain events;
- outbox;
- security;
- feature flags where needed.

---

# 4. REQUEST JOURNEY — F3

```text
Service Version
   │
   ├── Form Version
   ├── Document Requirement Snapshot
   ├── Fee Definition
   └── Eligibility Rules
   │
   ▼
RequestDraft
   │
   ├── eligibility
   ├── answers JSONB
   ├── documents
   ├── version
   └── expiry
   │
   ▼
Validate
   │
   ▼
Idempotent Submit
   │
   ├── Answer Snapshot
   ├── CitizenRequest
   ├── Request History
   ├── Document Links
   ├── Case optional
   ├── Domain Event
   ├── Audit Event
   └── Outbox
```

The F3 plan explicitly requires server authority for forms, drafts, autosave, documents and submission.

---

# 5. APPOINTMENT JOURNEY

Future phase:

```text
Service
→ Location
→ Capacity Rule
→ Slot Generation
→ Available Slot
→ Hold
→ Confirm Appointment
→ Reminder
→ Arrival
→ Check-in
→ Queue Ticket
```

Appointment != QueueTicket.

---

# 6. QUEUE JOURNEY

```text
Queue Open
→ Citizen eligible
→ Ticket
→ WAITING
→ CALLED
→ SERVING
→ COMPLETED
```

Alternative:

- TRANSFERRED
- NO_SHOW
- CANCELLED

`CALL NEXT` must be atomic.

---

# 7. PAYMENT JOURNEY

```text
Case
→ Obligation
→ Payment Intent
→ Provider
→ Provider Transaction
→ Callback
→ Validation
→ Reconciliation
→ Receipt
→ Workflow Event
```

Never:

```text
request.paid = true
```

---

# 8. NOTIFICATION JOURNEY

```text
Domain Event
→ Notification Policy
→ Recipient Resolution
→ Channel Selection
→ Outbox
→ Worker
→ Adapter
→ Provider
→ Delivery Attempt
→ Delivery Status
```

Mobile push is one channel.

---

# 9. DATABASE OWNERSHIP

One PostgreSQL cluster/database can support modular monolith.

Logical ownership remains per module.

Discourage cross-module table joins in random repositories.

Prefer:

- application query service;
- projection;
- explicit reporting read model.

---

# 10. DB SCHEMA PRINCIPLES

Use:

- UUID PKs;
- timestamptz;
- check constraints;
- explicit FKs;
- unique constraints;
- version columns;
- JSONB only where schema-flexibility is justified;
- indexes based on query patterns.

Avoid:

- generic EAV for everything;
- comma-separated IDs;
- status free text;
- nullable fields with unclear semantics.

---

# 11. DATABASE HA FUTURE

Initial production may use managed PostgreSQL.

Future options:

- standby;
- managed HA;
- PITR;
- read replica for reporting if justified.

Do not introduce DB sharding.

---

# 12. REDIS ROLE

Redis can support:

- rate limit counters;
- appointment holds;
- temporary queue hints;
- cache;
- distributed locks;
- session metadata.

Critical durable business truth remains PostgreSQL.

---

# 13. OBJECT STORAGE ROLE

Buckets/logical zones:

```text
quarantine/
trusted/
public/
exports/
temporary/
```

Access policies differ.

Citizen uploads never move directly to public.

---

# 14. CDN ROLE

CDN:

- frontend assets;
- public media;
- safe transparency downloads where approved.

Not:

- citizen private docs;
- internal reports;
- authenticated API.

---

# 15. EDGE SECURITY

Edge controls:

- HTTPS only;
- max request size;
- bot/abuse rules;
- WAF;
- rate limits;
- geographic rules only if justified;
- access logs.

Application still validates everything.

---

# 16. DNS

Use managed DNS.

Records documented.

Avoid hard-coded provider IP in clients.

Mobile clients should call stable API hostname.

---

# 17. API HOSTNAMES

Conceptual:

```text
www.<domain>
api.<domain>
```

Exact municipal domain requires approval.

Staging separated.

---

# 18. PRIVATE NETWORK

Target:

- application may access DB/Redis privately;
- DB/Redis have no public inbound;
- administrative access through controlled mechanisms.

---

# 19. LOAD BALANCER

Performs:

- TLS or passes to proxy;
- health routing;
- multiple app instances later;
- request limits;
- forwarded headers.

---

# 20. APPLICATION INSTANCES

Must tolerate >1 instance.

Therefore:

- no local session truth;
- no local file storage;
- no single-instance scheduler assumption;
- distributed-safe jobs.

---

# 21. CONTAINER TOPOLOGY — LOCAL

Developer:

```text
docker compose
├── backend
├── postgres
├── redis optional
└── object-storage emulator optional
```

Frontend may run separately.

---

# 22. CONTAINER TOPOLOGY — PROD

Conceptually:

```text
edge
→ backend replicas
→ managed postgres
→ managed redis
→ object storage
→ worker replicas
```

Exact provider can evolve.

---

# 23. WORKER MODEL

Initially same codebase, separate execution profile if useful.

Example:

```text
api process
worker process
scheduler process
```

Later split only if operationally beneficial.

---

# 24. OUTBOX TABLE

Fields conceptually:

- id;
- aggregate type;
- aggregate id;
- event type;
- payload;
- occurred_at;
- published_at;
- retry_count;
- next_attempt;
- last_error_sanitized.

Payload must avoid unnecessary sensitive data.

---

# 25. DEAD LETTER

Failed async jobs need:

- bounded retries;
- dead-letter state;
- operator visibility;
- manual retry.

No infinite retry storm.

---

# 26. SCHEDULER

Responsibilities:

- draft expiry;
- reminders;
- SLA;
- content scheduling;
- cleanup.

Multi-instance safe.

---

# 27. SECURITY LAYERS

```text
Edge
→ Authentication
→ Authorization
→ Domain Validation
→ DB Constraints
→ Audit
```

Each layer is independent defense.

---

# 28. THREAT MODEL — PUBLIC API

Threats:

- enumeration;
- injection;
- scraping;
- abuse;
- payload bombs;
- bot login attempts.

Mitigations:

- validation;
- limits;
- WAF;
- rate limit;
- pagination;
- safe errors.

---

# 29. THREAT MODEL — CITIZEN

Threats:

- IDOR;
- stolen session;
- duplicate submission;
- malicious file;
- client tampering;
- local device compromise.

Mitigations:

- OWN-scope query;
- secure sessions;
- idempotency;
- scan;
- server validation;
- secure mobile storage.

---

# 30. THREAT MODEL — STAFF

Threats:

- excessive privilege;
- accidental disclosure;
- malicious insider;
- compromised account.

Mitigations:

- scope;
- capabilities;
- least privilege;
- MFA target;
- reauth;
- audit;
- session control.

---

# 31. THREAT MODEL — PROVIDERS

Threats:

- fake webhook;
- replay;
- provider outage;
- compromised API key.

Mitigations:

- signatures;
- idempotency;
- timeouts;
- secret rotation;
- reconciliation;
- monitoring.

---

# 32. AUTHORIZATION MATRIX PRINCIPLE

Permission is evaluated at command time.

Example:

```text
Actor: Case Officer
Capability: cases.request_information
Resource: Case
Scope: ASSIGNED
Context: IN_REVIEW
→ ALLOW
```

---

# 33. DATA FLOWS

Sensitive data flow documentation should exist for:

- registration/login;
- request;
- document upload;
- payment;
- protocol;
- funding;
- notifications;
- analytics.

---

# 34. PII REDACTION

Logs should use:

- user internal id if necessary;
- request reference;
- document id.

Avoid:

- full name;
- phone;
- document contents;
- form answers.

---

# 35. ENCRYPTION

At rest:

- managed PostgreSQL encryption;
- object storage encryption;
- backup encryption.

Application-level field encryption only if threat/requirements justify complexity.

---

# 36. KEY MANAGEMENT

Keys externalized.

Rotation plan.

Do not commit signing private keys.

---

# 37. BACKUP ATLAS

PostgreSQL:

```text
continuous/PITR where supported
+ daily snapshots
+ retention
+ periodic restore test
```

Object storage:

```text
versioning/lifecycle
+ cross-zone/provider strategy later if required
```

Secrets:

reconstruct from secret manager, not backup file.

---

# 38. RECOVERY TEST

At scheduled interval:

1. restore isolated DB;
2. run integrity checks;
3. run application;
4. validate login;
5. validate request detail;
6. validate document metadata;
7. validate critical references.

---

# 39. MONITORING DASHBOARD — TECHNICAL

Track:

- request count;
- p50/p95/p99 latency;
- 4xx/5xx;
- JVM memory;
- CPU;
- threads;
- DB pool;
- DB slow queries;
- worker backlog;
- provider errors.

---

# 40. MONITORING DASHBOARD — DOMAIN

Track:

- drafts created;
- drafts abandoned;
- request submission success;
- validation failures;
- document scan failures;
- payment reconciliation exceptions;
- queue wait;
- appointment no-show;
- SLA breaches.

---

# 41. ALERT ROUTING

P0/P1 alerts go to responsible engineering/on-call path.

Business alerts may go to operational staff.

Do not mix technical pager with citizen notifications.

---

# 42. RELEASE PIPELINE

```text
feature branch
→ PR
→ static checks
→ unit tests
→ integration tests
→ security tests
→ migration tests
→ build
→ image scan
→ deploy staging
→ smoke test
→ approval
→ production
→ health check
→ monitor
```

---

# 43. MIGRATION PIPELINE

Before deploy:

- Flyway validate;
- backup/risk assessment;
- migration compatibility.

After:

- schema version;
- app health;
- key query checks.

---

# 44. ROLLBACK

Code rollback:

possible if schema remains backward-compatible.

Schema rollback:

prefer forward fix.

Never assume both are equivalent.

---

# 45. OBSERVABILITY CORRELATION

Correlation should connect:

```text
HTTP request
→ application command
→ audit event
→ outbox event
→ worker
→ provider
→ callback
```

---

# 46. API GATEWAY FUTURE

Do not require a complex gateway initially.

Introduce when needs justify:

- multiple services;
- advanced policies;
- traffic routing;
- partner APIs.

Reverse proxy + app may be sufficient V1.

---

# 47. MICROSERVICES EXIT CRITERIA

Only extract a module if:

- independent scale requirement;
- independent deployment value;
- team ownership;
- isolation need;
- domain boundary mature;
- observability/CI maturity exists.

Not because "microservices are modern".

---

# 48. KUBERNETES

Not required initially.

Use only if deployment scale/operations justify it.

A managed container platform may be better V1.

---

# 49. SERVERLESS

May be useful for isolated jobs/integrations later.

Do not fragment core domain across functions prematurely.

---

# 50. MOBILE BACKEND IMPLICATIONS

Mobile introduces:

- old client versions;
- unstable networks;
- background push;
- app/device identity;
- secure token storage;
- deep links;
- upload resume considerations;
- app-version telemetry;
- API compatibility window.

Backend contracts must account for these.

---

# 51. MOBILE API VERSION HEADER

Potential future:

```text
X-App-Version
X-Platform
X-Device-Installation-Id
```

Use only with privacy/security policy.

Do not make authorization depend on spoofable metadata.

---

# 52. PUSH TOKENS

Push token model:

- user;
- installation;
- platform;
- provider token;
- enabled;
- last_seen;
- invalidated_at.

Tokens are secrets-ish operational identifiers.

Do not log unnecessarily.

---

# 53. PUSH DELIVERY

```text
Notification Job
→ user installations
→ push adapter
→ APNs/FCM/Expo Push
→ delivery result
→ invalid token cleanup
```

Push is advisory.

Authoritative state remains API.

---

# 54. DEEP LINKS

Notification payload carries safe route reference.

App fetches authoritative resource after open.

Do not embed sensitive full content in push payload.

---

# 55. CAMERA UPLOAD FLOW

```text
Camera
→ local preview
→ metadata strip as needed
→ compression policy
→ multipart upload
→ server quarantine
→ scan
→ validation
→ document state
```

Do not trust EXIF or client compression for validation.

---

# 56. OFFLINE MOBILE

Allowed:

- cached public catalog;
- local draft UI state where safe;
- read stale non-sensitive data with indication.

Not automatically allowed:

- payment confirmation;
- request submission;
- final approval;
- queue call;
- authoritative booking.

---

# 57. SYNC CONFLICT

Mobile background/resume sync must use server versions.

No silent overwrite.

---

# 58. API TIMEOUT RECOVERY

For critical mobile command:

```text
POST
→ network timeout
→ do NOT blindly retry
→ GET status/idempotency result
→ display authoritative outcome
```

---

# 59. ENVIRONMENT MATRIX

```text
LOCAL
TEST
STAGING
PRODUCTION
```

Each has:

- own DB;
- own secrets;
- own storage;
- own provider sandbox/live;
- explicit base URL.

---

# 60. STAGING

Must permit:

- production-like migrations;
- mobile pre-release;
- provider sandbox;
- security testing;
- visual/integration QA.

No real citizen production PII copied casually.

---

# 61. DATA SEEDING

Development seeds are clearly marked synthetic.

Do not seed fake municipal content into production migrations.

---

# 62. ADMIN BOOTSTRAP

Admin creation should be controlled.

No hardcoded production password.

Bootstrap secrets external.

---

# 63. AUDIT STORAGE

Audit may initially live PostgreSQL.

Ensure:

- indexing;
- retention;
- append semantics;
- restricted access.

Later archive if volume requires.

---

# 64. REPORTING READ MODELS

Heavy reporting should not degrade citizen transactions.

Options later:

- materialized views;
- replicas;
- snapshot tables;
- ETL.

Start simple.

---

# 65. PUBLIC TRANSPARENCY

Public transparency is an approved projection.

Never expose internal reporting tables directly.

---

# 66. BACKEND DELIVERY PACKAGE

Every backend phase handoff includes:

- branch;
- commit SHAs;
- migrations;
- entities;
- state machines;
- endpoints;
- auth;
- capabilities/scopes;
- error codes;
- idempotency;
- concurrency;
- examples;
- tests;
- operational notes;
- known risks;
- deferred work.

---

# 67. F3 SPECIFIC GATE

The existing F3 backend plan already establishes:

- draft aggregate;
- form versioning;
- eligibility;
- optimistic autosave;
- secure documents;
- review validation;
- idempotent submission;
- safe request projection.

This Atlas adds deployment and operations requirements around it.

---

# 68. FUTURE PHASE MAP

```text
B-F3 Request Foundation
→ B-F4 Citizen Home/Notifications
→ B-F5 Appointment/Queue
→ B-F6 Staff Case Engine
→ B-F7 Finance/Communication
→ B-F8 Protocol/Funding
→ B-F9 Executive/Reporting/Transparency
→ Production hardening
```

Exact sequencing remains controlled by canonical roadmap.

---

# 69. BACKEND QA STOP GATE

Stop if:

- migration threatens data;
- permissions unclear;
- critical operation lacks idempotency;
- upload bypasses canonical documents;
- provider cannot be verified;
- secret would enter repo;
- API breaks mobile compatibility without plan;
- backend contract conflicts with canonical domain.

---

# 70. FINAL SYSTEM PRINCIPLE

Boane Conecta backend is not:

```text
frontend
+
some APIs
```

It is:

```text
a governed municipal operating platform
whose HTTP API is one interface to a larger secure, observable,
recoverable and auditable domain system.
```

---

**END — BACKEND ARCHITECTURE, INFRASTRUCTURE & OPERATIONS ATLAS V1**
