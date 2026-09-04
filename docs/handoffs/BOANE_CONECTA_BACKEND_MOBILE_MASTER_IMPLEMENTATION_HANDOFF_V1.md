# BOANE CONECTA — BACKEND & MOBILE MASTER IMPLEMENTATION HANDOFF V1

**Status:** Canonical implementation handoff and startup authority
**Purpose:** connect the frontend product canon, backend engineering canon, F3 implementation plan and future React Native application into one controlled execution system.

---

# 0. CANONICAL PACK

After this handoff, the project should treat the following as the canonical engineering set.

## Product / UX

1. `BOANE_CONECTA_WORK_MASTER_HANDOFF_V1.md`
2. `BOANE_CONECTA_RESPONSIVE_WIREFRAME_ATLAS_V1.md`
3. `BOANE_CONECTA_DESIGN_UX_CONSTITUTION_V1.md`
4. `BOANE_CONECTA_OPERATING_GOVERNANCE_AND_STARTUP_SPEC_V1.md`

## Frontend implemented state

5. `FRONTEND_F0_FOUNDATION.md`
6. `FRONTEND_F1_PUBLIC_HOME.md`
7. `FRONTEND_F2_SERVICE_CATALOG.md` when present

## Backend

8. `BOANE_CONECTA_BACKEND_ENGINEERING_CONSTITUTION_V1.md`
9. `BOANE_CONECTA_BACKEND_ARCHITECTURE_INFRASTRUCTURE_OPERATIONS_ATLAS_V1.md`
10. `BOANE_CONECTA_F3_BACKEND_IMPLEMENTATION_PLAN_V1.md`

## Mobile

11. `BOANE_CONECTA_CITIZEN_MOBILE_REACT_NATIVE_ARCHITECTURE_SPEC_V1.md`

This document is the startup/governance bridge across all of them.

---

# 1. AUTHORITY ORDER

When conflict exists:

1. latest explicit approved decision;
2. security/domain invariant;
3. Master Handoff;
4. Operating Governance;
5. phase-specific implementation plan;
6. Backend Constitution / Architecture Atlas;
7. Wireframe Atlas / UX Constitution;
8. implemented baseline.

Stop if conflict is material.

Do not silently improvise.

---

# 2. CURRENT BACKEND OBJECTIVE

Current specifically prepared backend plan:

**F3 backend foundation**

It exists to support:

```text
Service Detail
→ Eligibility
→ Auth
→ RequestDraft
→ Guided Form
→ Documents
→ Review
→ Idempotent Submit
→ Confirmation
→ Request Detail
```

The F3 plan confirms the existing backend currently lacks drafts, form versions, eligibility, optimistic autosave, pre-request document attachment, idempotency and immutable submitted snapshots.

Therefore this is a domain/backend implementation, not a frontend-only task.

---

# 3. F3 HARD BOUNDARIES

F3 backend may implement:

- form definition/versioning;
- RequestDraft;
- eligibility;
- autosave;
- document requirements;
- secure upload lifecycle;
- review validation;
- idempotency;
- submitted snapshot;
- request projection;
- audit/metrics needed by F3.

F3 backend may NOT automatically implement:

- appointment engine;
- queue engine;
- payments;
- staff workspace;
- finance;
- protocol;
- funding;
- executive reporting.

---

# 4. BACKEND WORK BRANCH

Backend should use a dedicated feature branch derived from canonical master/baseline according to repo policy.

Recommended conceptual name:

```text
feat/backend-f3-request-foundation
```

Do not implement backend changes directly on frontend feature branch unless an explicit integration decision is made.

---

# 5. PRE-CODING AUDIT

Agent must inspect:

- repo identity;
- branch;
- working tree;
- recent commits;
- backend build;
- JDK;
- Spring Boot;
- Maven;
- PostgreSQL config;
- Flyway sequence;
- current security;
- request entities/controllers;
- documents;
- auth;
- tests;
- CI.

Output before coding:

```text
BASELINE
RISKS
CONFLICTS
MIGRATION INVENTORY
SECURITY INVENTORY
API INVENTORY
TEST INVENTORY
```

---

# 6. ADR REQUIREMENT

Before migrations, record decisions for:

- draft aggregate;
- form schema model;
- concurrency;
- idempotency;
- document quarantine;
- scanner abstraction;
- retention;
- legacy endpoint;
- request/case creation;
- event/outbox behavior.

---

# 7. F3 IMPLEMENTATION SEQUENCE

Use existing B0–B9 plan.

```text
B0 Baseline/ADR
B1 Versioned Forms
B2 RequestDraft
B3 Eligibility/Autosave
B4 Documents
B5 Review Validation
B6 Idempotent Submit
B7 Citizen Request Projection
B8 Operational Hardening
B9 Verification/Handoff
```

No skipping security/migration gates.

---

# 8. INFRASTRUCTURE REQUIREMENT

Even if F3 implementation initially runs locally, code must remain compatible with:

```text
edge
→ multiple backend instances
→ PostgreSQL
→ Redis where needed
→ object storage
→ background workers
```

No local-disk durable business state.

---

# 9. DOCUMENT STORAGE

Reuse canonical document domain.

Do not create:

```text
request_uploads
funding_uploads
complaint_uploads
```

as unrelated blob systems.

One canonical document system with contextual links.

---

# 10. SECURITY GATE

Required F3 tests:

- Citizen A cannot read Citizen B draft;
- Citizen A cannot attach Citizen B document;
- stale version rejected;
- duplicate submit creates one request;
- idempotency key reuse with different payload rejected;
- MIME spoof rejected;
- traversal filename neutralized;
- oversized upload rejected;
- internal information never exposed in citizen projection.

---

# 11. DATABASE GATE

Use PostgreSQL Testcontainers.

Validate:

- clean migration;
- upgrade migration;
- indexes;
- JSONB;
- unique constraints;
- optimistic locking;
- existing request compatibility.

---

# 12. OBSERVABILITY GATE

F3 must expose metrics/logging for:

- draft create;
- save conflict;
- validation failure;
- upload rejection;
- scan backlog;
- submit success/failure;
- idempotency replay/conflict.

All sanitized.

---

# 13. OPERATIONS GATE

Document:

- startup;
- migration;
- env vars;
- storage config;
- scanner behavior;
- cleanup jobs;
- local test;
- staging test;
- failure recovery.

---

# 14. API HANDOFF

Frontend/mobile receive exact:

- OpenAPI;
- enums;
- headers;
- errors;
- examples;
- request/response;
- concurrency;
- idempotency;
- upload limits;
- document states;
- timeline projection.

No client builds on undocumented assumptions.

---

# 15. MOBILE READINESS

Even before mobile implementation, backend F3 contracts should avoid web-only assumptions.

Required:

- bearer/session strategy compatible with native clients;
- API version stability;
- explicit error codes;
- idempotency;
- unstable-network recovery;
- pagination;
- no cookie-only hidden dependency unless native strategy documented.

---

# 16. FUTURE MOBILE PRODUCT

Citizen React Native app will prioritize:

```text
Home
Requests
Services
Alerts
Account
```

Native capability roadmap:

- push;
- camera;
- documents;
- QR;
- secure storage;
- biometrics optional;
- connectivity;
- optional location;
- calendar/share where useful.

---

# 17. BACKEND MOBILE SUPPORT SERVICES

Future backend capabilities:

## Installation Service

- register installation;
- push token;
- app version;
- revoke token.

## Notification Service

- in-app record;
- push dispatch;
- deep-link metadata.

## Mobile Compatibility

- API compatibility;
- minimum supported version policy if needed.

---

# 18. MOBILE SECURITY

Backend must assume mobile app can be inspected/tampered.

Therefore:

- no embedded backend secrets;
- server validates everything;
- app metadata not trusted for authorization;
- tokens revocable;
- deep links authorized server-side.

---

# 19. NATIVE CAMERA CONTRACT

Mobile camera captures file.

Backend decides:

- type;
- size;
- security;
- classification;
- validation.

Client image processing does not make file trusted.

---

# 20. PUSH CONTRACT

Push is advisory.

Payload:

- safe title/body;
- notification ID;
- resource type/id/reference;
- route key.

App fetches authoritative detail.

---

# 21. OFFLINE CONTRACT

Backend should make critical actions recoverable.

Use:

- version;
- idempotency;
- status endpoints.

Do not pretend offline action succeeded until server confirms.

---

# 22. CI/CD ROADMAP

Backend pipeline target:

```text
Maven compile
→ unit
→ static analysis
→ Testcontainers integration
→ security/authorization
→ migration
→ contract/OpenAPI
→ image build
→ image scan
```

Mobile pipeline target:

```text
lint
→ typecheck
→ tests
→ EAS build
→ device smoke
→ internal distribution
```

---

# 23. ENVIRONMENT ROADMAP

```text
LOCAL
TEST
STAGING
PRODUCTION
```

Mobile also requires staging API build.

---

# 24. CLOUD / HOSTING

No provider is frozen by this handoff.

Architecture requires:

- private DB;
- TLS;
- secrets;
- object storage;
- backup;
- monitoring;
- scalable application instances.

Current provider choices may evolve.

---

# 25. NETWORK / EDGE

Before production:

- DNS;
- HTTPS;
- WAF;
- reverse proxy;
- request size;
- rate limits;
- CORS;
- headers;
- private DB/Redis.

---

# 26. CONTAINERS

Backend production artifact should be container-ready.

Use:

- non-root;
- minimal image;
- health;
- no secrets;
- deterministic build.

---

# 27. MONITORING

Before public production:

- uptime;
- API errors;
- latency;
- DB health;
- worker;
- storage;
- backups;
- critical domain metrics.

---

# 28. BACKUP / RECOVERY

No launch without:

- automated DB backup;
- object storage recovery strategy;
- restore test;
- runbook.

---

# 29. SECURITY REVIEW BEFORE PRODUCTION

Review:

- auth;
- authorization;
- IDOR;
- session/token;
- uploads;
- CORS;
- CSP/web headers;
- rate limits;
- secrets;
- DB exposure;
- logging;
- provider webhook;
- dependency vulnerabilities.

---

# 30. QUALITY STANDARD

The same principle used for frontend anti-AI-slop becomes backend anti-demo-code:

Reject:

- giant service classes;
- fake production guarantees;
- role-only auth;
- direct status mutation;
- no tests;
- no migration safety;
- no idempotency;
- vendor coupling;
- no logs/metrics;
- no recovery plan.

---

# 31. TRACEABILITY

For backend:

```text
Use Case
→ Actor
→ Capability
→ Domain Command
→ Business Rule
→ State Transition
→ API
→ Transaction
→ Audit Event
→ Domain Event
→ Test
```

---

# 32. F3 EXAMPLE TRACE

```text
UC-CIT-003 Submit Request
→ Citizen
→ requests.submit / OWN
→ SubmitRequestDraft
→ BR-REQ-003
→ IN_PROGRESS → SUBMITTED
→ POST /citizen/request-drafts/{id}/submit
→ atomic transaction
→ audit RequestSubmitted
→ domain RequestSubmitted
→ concurrency/idempotency integration tests
```

---

# 33. IMPLEMENTATION REPORT TEMPLATE

At completion:

```text
Repository:
Branch:
Base:
HEAD:
Commits:

Migrations:
Entities:
State machines:
Endpoints:
Capabilities:
Scopes:
Errors:
Idempotency:
Concurrency:
Storage:
Jobs:
Outbox:
Audit:
Metrics:

Tests:
- unit
- integration
- security
- migration
- contract
- concurrency

Build:
Known risks:
Deferred:
Frontend handoff:
Mobile implications:

Master modified? NO
Frontend modified? expected NO
Force push? NO
Next phase started? NO
```

---

# 34. BACKEND AGENT STARTUP PROMPT

Use this prompt after all files are placed in the repo:

> You are the backend engineering agent for Boane Conecta. Before editing anything, read all canonical project authorities, with special attention to:
>
> - `BOANE_CONECTA_BACKEND_ENGINEERING_CONSTITUTION_V1.md`
> - `BOANE_CONECTA_BACKEND_ARCHITECTURE_INFRASTRUCTURE_OPERATIONS_ATLAS_V1.md`
> - `BOANE_CONECTA_F3_BACKEND_IMPLEMENTATION_PLAN_V1.md`
> - `BOANE_CONECTA_OPERATING_GOVERNANCE_AND_STARTUP_SPEC_V1.md`
>
> Treat the Backend Constitution as the quality and engineering rules, the Backend Architecture Atlas as the full-stack runtime/infrastructure model, and the F3 Backend Plan as the current phase-specific implementation authority.
>
> Current authorization is backend F3 only: versioned forms, RequestDraft, eligibility, optimistic autosave, canonical secure documents, structured validation, immutable snapshots, transactional idempotent submission, submission-status recovery and citizen-safe request detail.
>
> Do not implement appointments, queue, payments, staff case workspace, finance, protocol, funding or executive reporting.
>
> Start with a read-only repository audit. Confirm repo identity, branch, clean status, current HEAD, JDK, Maven, Spring Boot, PostgreSQL, Flyway migrations, security model, request/document/auth modules, tests and CI. Produce a baseline summary and ADR decisions before any schema change.
>
> Enforce ROLE + CAPABILITY + RESOURCE + SCOPE + CONTEXT. Frontend visibility is never authorization. Prevent BOLA/IDOR, mass assignment, stale overwrites, duplicate submission, unsafe upload and sensitive-data logging.
>
> Use PostgreSQL Testcontainers for persistence/migration tests. Implement idempotency persistently. Keep document bytes in canonical object storage domain. Use additive Flyway migrations. Preserve legacy submitted requests.
>
> Build B0–B9 incrementally and stop if a domain/security/migration conflict requires scope expansion.
>
> At completion, run all gates and return the full backend implementation report and frontend/mobile handoff. Do not merge master, do not force push and do not begin the next phase.

---

# 35. MOBILE AGENT STARTUP PROMPT — FUTURE

> You are implementing the Boane Conecta Citizen Mobile App in React Native + TypeScript, using the canonical mobile architecture specification and existing backend contracts.
>
> Mobile is not a web wrapper. Use native capabilities only where they improve citizen service: push notifications, camera/document capture, QR/check-in, secure storage, biometrics optional, connectivity and optional location.
>
> The backend remains authoritative. Never embed provider secrets, never trust local validation as domain validation, never treat push as authoritative state and never blindly retry critical commands after timeout.
>
> Begin with M0 foundation only unless another mobile phase is explicitly authorized. Validate both Android and iOS, permission denied states, offline/degraded behavior, accessibility, secure token storage and API compatibility.
>
> Do not request unused native permissions. Do not implement background location. Do not duplicate backend business logic in the app.

---

# 36. FINAL DIRECTIVE

The project now has to be engineered as a complete digital-service system:

```text
UI/UX
+
Web Frontend
+
Mobile
+
Backend Domain
+
Database
+
Storage
+
Auth/Permissions
+
Networking
+
Cloud
+
CI/CD
+
Security
+
Rate Limiting
+
Cache/CDN
+
Scaling
+
Observability
+
Backups/Recovery
```

No single layer is "the backend".

The backend is the operational core that makes the complete system trustworthy.

---

**END — BACKEND & MOBILE MASTER IMPLEMENTATION HANDOFF V1**
