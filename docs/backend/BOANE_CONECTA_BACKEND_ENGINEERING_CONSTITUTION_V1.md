# BOANE CONECTA — BACKEND ENGINEERING CONSTITUTION V1

**Status:** Canonical backend engineering authority
**Project:** Boane Conecta
**Target architecture:** Production-grade municipal digital service platform
**Canonical backend style:** Spring Boot modular monolith first, PostgreSQL, explicit domain boundaries, secure-by-default
**Purpose:** define the non-negotiable backend engineering, API, data, security, infrastructure, observability, reliability, deployment and operational quality rules for Boane Conecta.

---

# 0. PURPOSE

The backend is not merely "API code".

For Boane Conecta, backend engineering includes:

```text
Domain Model
+ API Contracts
+ Business Logic
+ Authorization
+ Data Integrity
+ PostgreSQL
+ Object Storage
+ Search
+ Cache
+ Background Jobs
+ Messaging / Outbox
+ Networking
+ Reverse Proxy / Gateway
+ Rate Limiting
+ Security
+ Containers
+ Runtime
+ Cloud Infrastructure
+ CI/CD
+ Monitoring
+ Logging
+ Tracing
+ Alerting
+ Backup
+ Restore
+ Disaster Recovery
+ Operational Runbooks
```

The backend must remain authoritative for municipal business rules.

The frontend and mobile applications are clients of the domain, not alternative domain engines.

---

# 1. BACKEND NORTH STAR

Boane Conecta backend must be:

- secure by default;
- explicit;
- auditable;
- transactionally correct;
- version-aware;
- observable;
- testable;
- resilient;
- horizontally scalable where needed;
- backward-compatible during evolution;
- clear enough to defend academically;
- maintainable by a small engineering team;
- capable of supporting web and React Native clients from the same canonical domain.

It must not become:

- a collection of controllers with CRUD;
- an unstructured "service layer";
- a database exposed through HTTP;
- a role-check maze;
- a duplicated API per frontend screen;
- a monolith with no module boundaries;
- a premature microservices system;
- a distributed system with no operational maturity.

---

# 2. FULL-STACK REALITY

The system must treat the following as one engineering chain:

```text
Client
→ DNS
→ TLS
→ CDN where appropriate
→ WAF / edge controls
→ Reverse proxy / load balancer
→ Application runtime
→ Spring Security
→ Authorization policy
→ Domain command/query
→ Database / cache / object storage
→ Domain event
→ Outbox
→ Worker / notification / integration
→ Logs / metrics / traces
→ Alerting
→ Backup / recovery
```

A production feature is incomplete if only the controller and database table exist.

---

# 3. ARCHITECTURAL STYLE

V1:

**Modular Monolith**

Why:

- one transactional boundary;
- simpler deployment;
- simpler debugging;
- lower infrastructure overhead;
- good fit for current team size;
- supports later extraction only when justified.

Module boundaries must still be real.

Recommended bounded contexts:

1. Identity & Access
2. Organization & Territory
3. Service Catalog
4. Requests / Case Management
5. Documents & Media
6. Appointments
7. Queue
8. Finance
9. Communication
10. Protocol
11. Funding
12. Projects & Transparency
13. Reporting
14. Audit / Platform Services

No module may directly mutate another module's private persistence model.

---

# 4. PACKAGE ROOT

Canonical target:

```text
mz.gov.boaneconecta
```

Conceptual structure:

```text
mz.gov.boaneconecta
├── identity
├── organization
├── services
├── requests
├── cases
├── documents
├── appointments
├── queue
├── finance
├── communication
├── protocol
├── funding
├── projects
├── reporting
└── platform
    ├── security
    ├── audit
    ├── events
    ├── outbox
    ├── notifications
    ├── workflow
    ├── rules
    ├── calendar
    ├── sla
    ├── idempotency
    ├── observability
    └── storage
```

---

# 5. MODULE INTERNAL STRUCTURE

Preferred:

```text
module/
├── api/
│   ├── controller
│   ├── request
│   └── response
├── application/
│   ├── command
│   ├── query
│   ├── handler
│   └── service
├── domain/
│   ├── model
│   ├── policy
│   ├── event
│   └── repository
└── infrastructure/
    ├── persistence
    ├── integration
    ├── mapper
    └── config
```

Exact folders may evolve.

The principle is mandatory:

**HTTP, application orchestration, domain logic and infrastructure concerns must not collapse into one class.**

---

# 6. DOMAIN RULES

Domain entities represent business concepts.

Avoid entities that merely mirror tables.

Domain behavior should answer business questions such as:

- can this request be submitted?
- may this actor approve this case?
- is this document valid for this requirement?
- can this appointment be rescheduled?
- may this payment be refunded?
- can this funding reviewer evaluate this application?

Do not place those rules in React, controllers or random repository methods.

---

# 7. REQUEST != CASE

Canonical distinction:

```text
Request
= citizen intent/submission

Case
= municipal operational process
```

A request may create a case.

A case may contain:

- assignment;
- internal notes;
- SLA;
- review;
- decisions;
- tasks;
- escalation.

The citizen should not see internal case implementation details.

---

# 8. COMMANDS AND QUERIES

Critical state transitions use explicit commands.

Prefer:

```http
POST /cases/{id}/approve
POST /cases/{id}/request-information
POST /payments/{id}/refund
POST /queue/{id}/call-next
```

over:

```http
PATCH /resource/{id}
{
  "status": "APPROVED"
}
```

Queries may use standard REST reads.

---

# 9. STATE MACHINES

Any non-trivial lifecycle must have an explicit state machine.

Examples:

- RequestDraft
- CitizenRequest
- Case
- Document
- Appointment
- QueueTicket
- Payment
- Protocol
- FundingApplication
- ContentPublication

Transitions define:

- allowed source states;
- actor capability;
- scope;
- preconditions;
- side effects;
- audit;
- events.

---

# 10. VERSIONED DEFINITIONS

Anything that affects submitted history must be versioned.

Examples:

- service definitions;
- forms;
- workflow definitions;
- fee definitions;
- document requirements;
- eligibility rules;
- declarations;
- public content where legally/operationally relevant.

Submitted records pin versions.

Never reinterpret historical submissions through today's rules.

---

# 11. API DESIGN

Canonical groups:

```text
/api/v1/public/*
/api/v1/citizen/*
/api/v1/admin/*
/api/v1/executive/*
/api/internal/*
```

Provider webhooks get explicit paths.

Do not expose internal service implementation paths.

---

# 12. API VERSIONING

Start with `/api/v1`.

Breaking changes require:

- version strategy;
- deprecation;
- migration period;
- client compatibility review.

Do not silently break mobile clients after app-store release.

---

# 13. API ERROR CONTRACT

Canonical direction:

```json
{
  "code": "VALIDATION_FAILED",
  "message": "Não foi possível concluir a operação.",
  "correlationId": "uuid",
  "details": []
}
```

For field validation:

```json
{
  "code": "VALIDATION_FAILED",
  "message": "Existem campos por corrigir.",
  "correlationId": "uuid",
  "details": [
    {
      "field": "request_reason",
      "code": "REQUIRED",
      "message": "Preencha este campo."
    }
  ]
}
```

Never expose:

- stack trace;
- SQL;
- filesystem paths;
- credentials;
- storage keys;
- scanner diagnostics;
- framework exceptions.

---

# 14. HTTP SEMANTICS

Use:

- GET — read
- POST — command/create
- PUT — replace/idempotent full semantic update
- PATCH — partial update where appropriate
- DELETE — logical removal where business semantics allow

Status codes must be meaningful.

Do not return 200 for every outcome.

---

# 15. IDENTIFIERS

Internal:

UUID.

Public:

human-readable reference.

Examples are provisional:

```text
BC-REQ-2026-00182
BC-PAY-2026-00182
BC-PRO-2026-00182
```

References generated server-side.

---

# 16. AUTHENTICATION

Authentication answers:

**Who is the actor?**

Authorization answers:

**May this actor perform this action on this resource in this context?**

Never conflate the two.

---

# 17. AUTHORIZATION

Canonical model:

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

Default deny.

Scopes:

- OWN
- ASSIGNED
- TEAM
- DEPARTMENT
- TERRITORY
- MUNICIPALITY
- GLOBAL

Frontend visibility is not security.

Backend must enforce every sensitive action.

---

# 18. AVAILABLE ACTIONS

Useful API projection:

```json
{
  "availableActions": [
    "REQUEST_INFORMATION",
    "SEND_FOR_APPROVAL"
  ]
}
```

This reduces duplicated policy logic in web/mobile.

---

# 19. SEPARATION OF DUTIES

High-risk actions may require independent actors.

Examples:

- editor != emergency publisher;
- finance operator != refund approver;
- funding evaluator != committee decision;
- case analyst != final approver where policy requires.

---

# 20. SESSION SECURITY

Target:

- short-lived access tokens;
- refresh rotation;
- session/device tracking;
- revocation;
- logout-all-sessions capability;
- anomaly detection;
- stronger MFA for staff/admin later.

Mobile tokens require secure storage.

---

# 21. PASSWORD SECURITY

Use modern password hashing supported by Spring Security.

Requirements:

- no plaintext;
- no reversible encryption;
- rate-limit login attempts;
- breach-resistant reset workflow;
- no password in logs;
- no password in analytics.

---

# 22. REAUTHENTICATION

Sensitive actions may require reauth:

- permissions change;
- emergency publication;
- refund;
- waiver;
- confidential decision;
- break-glass access.

---

# 23. INPUT VALIDATION

Three layers:

1. Transport validation
2. Domain validation
3. Persistence constraints

Frontend validation is convenience only.

---

# 24. MASS ASSIGNMENT

Never bind arbitrary client DTO directly to persistence entities.

Explicit request DTOs only.

Fields like:

- role;
- owner;
- priority;
- status;
- approval;
- amount;
- reference

must not become client-controlled accidentally.

---

# 25. IDOR / BOLA

Object lookup must include authorization context.

For citizen-owned resources prefer:

```text
findByIdAndCitizenId(...)
```

rather than:

```text
findById(...)
then compare later
```

Unauthorized existence should not leak.

---

# 26. RATE LIMITING

Rate limits are operation-specific.

Examples:

- login;
- password reset;
- search;
- request draft creation;
- autosave burst;
- upload;
- submit;
- webhook;
- exports.

Return `Retry-After` where useful.

Rate limiting is not a substitute for authorization.

---

# 27. ABUSE CONTROLS

Consider:

- per-IP;
- per-user;
- per-session;
- per-endpoint;
- burst;
- sustained;
- file volume;
- export volume.

Suspicious behavior should be observable.

---

# 28. CSRF

If browser authentication uses cookies:

CSRF protection mandatory.

If bearer tokens are used:

review storage model and XSS risk carefully.

Do not assume "SPA" removes CSRF/XSS concerns.

---

# 29. CORS

Explicit allowlist.

No production:

```text
Access-Control-Allow-Origin: *
```

for authenticated APIs.

---

# 30. SECURITY HEADERS

Edge/application target:

- HSTS
- CSP
- X-Content-Type-Options
- frame restrictions
- Referrer-Policy
- Permissions-Policy

Tune per public web/mobile/API needs.

---

# 31. FILE UPLOAD SECURITY

Upload pipeline:

```text
receive
→ validate size
→ extension check
→ MIME check
→ magic-byte detection
→ safe generated object key
→ quarantine
→ malware scan
→ validation
→ trusted storage state
```

Original filename is metadata only.

Never trust:

- extension;
- browser MIME;
- user filename.

---

# 32. DOCUMENT STATES

Example:

```text
RECEIVED
SCANNING
VALID
REJECTED
EXPIRED
REPLACED
ARCHIVED
```

Exact states must align with domain.

---

# 33. OBJECT STORAGE

Document bytes belong in object storage.

Database stores:

- metadata;
- ownership;
- classification;
- version;
- hashes;
- scan state;
- linkage.

Do not store large binaries in normal PostgreSQL rows without formal decision.

---

# 34. STORAGE ACCESS

Prefer signed/controlled download endpoints.

No public bucket for citizen documents.

Storage IAM should follow least privilege.

---

# 35. DATA CLASSIFICATION

Canonical:

- PUBLIC
- PERSONAL
- INTERNAL
- CONFIDENTIAL
- RESTRICTED

Classification affects:

- authorization;
- logs;
- export;
- cache;
- retention;
- download;
- audit.

---

# 36. DATABASE

Canonical DB:

PostgreSQL.

Use PostgreSQL behavior as production authority.

Do not let H2 define architecture.

---

# 37. DATABASE MIGRATIONS

Flyway.

Rules:

- additive where possible;
- backward-compatible;
- tested from clean DB;
- tested from current production-like snapshot;
- no destructive schema rewrite without migration plan;
- indexes intentional;
- constraints explicit.

---

# 38. DATABASE CONSTRAINTS

Business invariants should have DB protection when possible.

Examples:

- unique request reference;
- one request per submitted draft;
- unique idempotency actor+operation+key;
- valid enum/check;
- foreign-key ownership linkage.

Application checks alone are insufficient for race conditions.

---

# 39. TRANSACTIONS

Transactional boundaries surround business units of work.

Avoid giant transaction across:

- remote calls;
- slow scanning;
- external payment providers.

Use outbox/events for asynchronous side effects.

---

# 40. OPTIMISTIC CONCURRENCY

Use when users/workers may edit same logical resource.

Examples:

- request draft;
- case;
- content draft;
- funding evaluation.

Never silently last-write-wins for important business data.

---

# 41. IDEMPOTENCY

Mandatory for critical retries:

- request submission;
- payment intent;
- payment webhook;
- appointment reservation;
- queue join where applicable;
- funding application submission;
- protocol scheduling.

Idempotency key is not merely request deduplication in memory.

Persist authoritative outcome.

---

# 42. POSTGRESQL INDEXING

Indexes should follow real access patterns.

Evaluate:

- FK indexes;
- status+owner;
- status+updated;
- timestamps;
- unique references;
- JSONB access;
- partial indexes.

Do not over-index every field.

---

# 43. QUERY PERFORMANCE

Watch:

- N+1;
- unbounded list endpoints;
- huge joins;
- lazy-loading outside transaction;
- large JSON projections.

Use pagination.

---

# 44. PAGINATION

Public/admin list endpoints should use stable pagination.

Prefer cursor/keyset for very large operational feeds.

Offset may be acceptable for smaller catalogs.

Do not return tens of thousands of rows.

---

# 45. SEARCH

Search is a domain capability.

V1 may use PostgreSQL search where sufficient.

Later evaluate dedicated engine only if justified.

Do not introduce Elasticsearch/OpenSearch prematurely.

---

# 46. CACHE

Cache only when:

- data is read-heavy;
- invalidation strategy is understood;
- stale behavior is acceptable.

Redis target use cases may include:

- rate limiting;
- ephemeral locks/holds;
- short-lived cache;
- session metadata;
- distributed coordination where justified.

Redis must not become source of truth for critical business state.

---

# 47. CDN

Use CDN for:

- public static assets;
- public cacheable media;
- frontend build assets.

Do not CDN-cache personalized API responses without explicit policy.

---

# 48. BACKGROUND JOBS

Examples:

- notifications;
- draft expiry;
- idempotency cleanup;
- SLA evaluation;
- scheduled publication;
- reminder generation;
- scanner processing;
- reconciliation;
- reporting snapshot.

Jobs must be:

- idempotent;
- observable;
- retry-aware;
- safe under duplicate execution.

---

# 49. DOMAIN EVENTS

Domain event describes a business fact.

Examples:

```text
RequestSubmitted
CaseAssigned
AppointmentConfirmed
PaymentConfirmed
EmergencyAlertPublished
FundingApplicationSubmitted
```

Events are not audit logs.

---

# 50. TRANSACTIONAL OUTBOX

For reliable asynchronous integration:

```text
domain transaction
→ business changes
→ outbox record
→ commit
→ dispatcher
→ downstream
```

Avoid dual-write:

```text
DB commit + broker call
```

without reliability strategy.

---

# 51. NOTIFICATION ARCHITECTURE

Canonical pipeline:

```text
Domain Event
→ Notification Policy
→ Notification Job
→ Channel Adapter
→ Delivery Attempt
→ Delivery Status
```

Channels may include:

- in-app
- push
- email
- SMS
- WhatsApp

Not every event goes to every channel.

---

# 52. EXTERNAL INTEGRATIONS

Every provider gets adapter boundary.

Examples:

- payment;
- messaging;
- malware scanner;
- email;
- push;
- storage.

Domain code should not depend directly on vendor SDK models.

---

# 53. WEBHOOK SECURITY

Provider webhooks require:

- signature validation;
- timestamp/replay protection;
- idempotency;
- schema validation;
- audit;
- controlled response;
- dead-letter/retry strategy where relevant.

---

# 54. NETWORKING

Production conceptual path:

```text
Internet
→ DNS
→ TLS
→ CDN/WAF
→ Load Balancer / Reverse Proxy
→ Application
→ Private Database
→ Private Redis
→ Object Storage
```

Database must not be publicly exposed.

---

# 55. TLS

TLS everywhere externally.

Internal TLS depends on infrastructure but must be assessed.

Certificates automated.

No production HTTP login/API.

---

# 56. WAF

WAF is an additional layer.

Use for:

- known attack patterns;
- abusive IP rules;
- request size controls;
- bot mitigation where needed.

WAF does not replace secure code.

---

# 57. REVERSE PROXY

Responsibilities may include:

- TLS termination;
- request limits;
- compression;
- forwarding headers;
- rate controls;
- health routing;
- access logs.

Spring must correctly process trusted proxy headers.

---

# 58. LOAD BALANCING

App instances should be as stateless as practical.

No critical in-memory session assumption.

Sticky sessions should not be architecture's only correctness mechanism.

---

# 59. HORIZONTAL SCALING

Design for multiple app instances:

- shared DB;
- shared Redis where needed;
- object storage;
- distributed-safe jobs;
- idempotency;
- no local-disk business state.

---

# 60. CONTAINERS

Docker image rules:

- minimal runtime;
- non-root user;
- pinned base image strategy;
- health checks;
- no secrets baked in;
- multi-stage build;
- deterministic artifact;
- vulnerability scanning.

---

# 61. JAVA RUNTIME

Use supported JDK version approved for the project.

Do not chase latest JDK without framework compatibility validation.

Version must be pinned in:

- build;
- CI;
- container;
- documentation.

---

# 62. SPRING BOOT

Framework configuration must be explicit.

Avoid:

- magic security defaults;
- broad component scanning surprises;
- production dev profiles;
- accidental debug endpoints.

---

# 63. CONFIGURATION

Configuration sources:

- environment;
- secret manager;
- config files without secrets.

Separate:

- dev;
- test;
- staging;
- production.

No production secrets committed.

---

# 64. SECRETS

Secrets include:

- DB password;
- JWT signing material;
- provider keys;
- SMTP;
- storage credentials;
- push credentials;
- encryption keys.

Rotate.

Audit access.

Never print.

---

# 65. CI

Every PR should eventually execute:

```text
compile
→ unit tests
→ static analysis
→ integration tests
→ migration validation
→ security scan
→ build image
→ artifact checks
```

Frontend/backend can have scoped jobs.

---

# 66. CD

Deployment requires:

- immutable artifact;
- environment config;
- migration strategy;
- health verification;
- rollback/forward-fix strategy.

Do not SSH-edit production source code.

---

# 67. BRANCH GOVERNANCE

No direct uncontrolled production work on master.

Use:

- feature branch;
- review;
- tests;
- PR;
- controlled merge.

No force push on shared protected branches.

---

# 68. DATABASE DEPLOYMENT

Migrations run in controlled order.

Avoid multiple app instances racing Flyway unpredictably.

Have pre-deploy backup when migration risk warrants it.

---

# 69. HEALTH CHECKS

Separate:

- liveness;
- readiness.

Readiness should reflect dependencies required to serve traffic.

Do not restart healthy process merely because external optional provider is temporarily down.

---

# 70. LOGGING

Structured logs.

Include:

- timestamp;
- level;
- service;
- environment;
- correlation ID;
- actor ID only where safe;
- resource reference where safe;
- event.

No:

- passwords;
- tokens;
- document bytes;
- full PII payloads.

---

# 71. CORRELATION IDs

Every request:

- accepts or generates correlation ID;
- returns it in errors;
- propagates to logs;
- propagates to downstream jobs/events where possible.

---

# 72. METRICS

Technical:

- request rate;
- latency;
- error rate;
- DB pool;
- queue depth;
- memory;
- CPU.

Domain:

- submission success;
- validation failure;
- payment exception;
- queue wait;
- SLA breach;
- notification delivery.

Avoid metrics with unknown definitions.

---

# 73. TRACING

Distributed tracing becomes important when asynchronous/external interactions grow.

At minimum preserve trace/correlation across:

- HTTP;
- outbox;
- worker;
- provider callback.

---

# 74. ERROR TRACKING

Capture application exceptions centrally.

Must include:

- environment;
- release;
- correlation;
- sanitized context.

Do not send sensitive payloads to third-party tracking.

---

# 75. ALERTING

Alert on symptoms that matter.

Examples:

- sustained 5xx;
- submit failures;
- DB unavailable;
- migration failure;
- scanner backlog;
- payment webhook failures;
- disk/storage issue;
- backup failure.

Avoid alert fatigue.

---

# 76. SLO / SLI

Do not invent contractual production SLOs without operational context.

But define measurable SLIs:

- availability;
- API latency;
- error rate;
- job delay;
- submission success.

---

# 77. BACKUPS

PostgreSQL:

- automated backups;
- retention policy;
- encrypted;
- restore tested.

Object storage:

- versioning/lifecycle where appropriate;
- recovery plan.

Backup without restore testing is incomplete.

---

# 78. RECOVERY

Define:

- RPO;
- RTO;
- restore sequence;
- credential recovery;
- DNS/deployment recovery;
- data reconciliation.

Values require infrastructure/stakeholder decision.

---

# 79. DISASTER RECOVERY

Minimum runbook:

```text
detect incident
→ stop unsafe writes if necessary
→ preserve evidence
→ choose recovery point
→ restore DB/storage
→ verify migrations
→ verify integrity
→ bring services up
→ validate critical journeys
→ communicate
→ postmortem
```

---

# 80. SECURITY TESTING

Backend security suite should include:

- auth bypass;
- IDOR/BOLA;
- broken object property authorization;
- role escalation;
- mass assignment;
- injection;
- upload spoofing;
- path traversal;
- rate limit;
- replay;
- stale token;
- duplicate commands.

---

# 81. SQL INJECTION

Use parameterized persistence APIs.

No concatenated user SQL.

Dynamic filtering must use safe builders.

---

# 82. XSS / CONTENT SAFETY

Backend should not blindly trust rich content.

If HTML is supported:

- sanitize;
- restrict;
- CSP.

Prefer structured rich-text model when possible.

---

# 83. SSRF

Any URL-fetch feature must:

- allowlist schemes;
- block internal IP ranges;
- enforce timeouts;
- size limits;
- DNS/rebinding awareness.

Do not introduce arbitrary server-side fetch.

---

# 84. DESERIALIZATION

Reject unknown/invalid polymorphic payloads where risky.

Do not enable unsafe Java deserialization.

---

# 85. DEPENDENCY SECURITY

Maintain:

- dependency updates;
- vulnerability scanning;
- SBOM where possible.

Do not blindly auto-upgrade major framework versions in production branch.

---

# 86. PRIVACY

Minimize collected data.

Define purpose.

Define retention.

Do not retain abandoned drafts forever.

Do not expose PII in staff/executive views beyond task need.

---

# 87. AUDIT

Audit records should answer:

- who;
- what;
- resource;
- when;
- previous state;
- new state;
- reason;
- context;
- correlation.

Audit is append-oriented and tamper-resistant.

---

# 88. AUDIT VS LOG

Logs:

technical operation.

Audit:

business/security accountability.

Do not treat logs as legal/business audit trail.

---

# 89. BUSINESS CALENDAR

SLA and deadlines may require:

- timezone;
- working days;
- closures;
- holidays;
- business hours.

Business calendar is centralized.

No duplicated deadline math per module.

---

# 90. TIMEZONE

Canonical business timezone:

```text
Africa/Maputo
```

Persist timestamps with timezone-safe semantics.

API uses ISO-8601.

---

# 91. MONEY

Use exact decimal/minor units.

Never JavaScript/Java floating-point for authoritative money.

Currency explicitly represented.

---

# 92. RETRIES

Retry only when operation is safe.

Use exponential backoff/jitter for external providers.

Do not retry non-idempotent commands blindly.

---

# 93. CIRCUIT BREAKERS

Use for unstable external integrations where justified.

Do not add complexity to internal calls unnecessarily.

---

# 94. TIMEOUTS

Every external call needs finite timeout.

No thread should wait indefinitely for:

- provider;
- scanner;
- storage;
- messaging.

---

# 95. BULKHEADS

Protect critical system from optional subsystem overload.

Example:

notification provider failure should not block committed request submission.

---

# 96. GRACEFUL DEGRADATION

If optional service fails:

- core transaction may succeed;
- side effect is queued/retried;
- UI receives accurate state.

Never pretend a failed critical operation succeeded.

---

# 97. FEATURE FLAGS

Use sparingly for:

- risky rollout;
- provider switch;
- staged feature.

Flags require ownership/removal.

Do not build permanent hidden branches of business logic.

---

# 98. DATA EXPORT

Exports:

- capability-gated;
- scope-aware;
- classified;
- audited;
- potentially async for large datasets.

No unrestricted "download all".

---

# 99. ADMIN OPERATIONS

Administrative maintenance endpoints must be separate and protected.

Avoid hidden "magic" query parameters.

---

# 100. PRODUCTION DEBUG

No open:

- Swagger write operations to public;
- actuator sensitive endpoints;
- debug stack traces;
- database consoles.

---

# 101. OPENAPI

API contracts should be documented.

OpenAPI must represent:

- auth;
- request;
- response;
- enums;
- errors;
- headers;
- idempotency;
- concurrency.

Frontend/mobile should not reverse-engineer backend.

---

# 102. CONTRACT TESTING

Provide stable examples/fixtures for:

- success;
- validation;
- forbidden;
- not found;
- conflict;
- rate limit;
- idempotent replay;
- stale version.

---

# 103. BACKWARD COMPATIBILITY

Particularly important for mobile.

A web deployment can update instantly.

A mobile app version may remain installed for months.

Backend must support a deliberate compatibility window.

---

# 104. API DEPRECATION

Deprecation requires:

- telemetry;
- documented replacement;
- date/window;
- client migration;
- removal decision.

---

# 105. PERFORMANCE ENGINEERING

Measure before optimizing.

Focus:

- DB query latency;
- API latency;
- serialization;
- object storage;
- external calls;
- queue delays.

---

# 106. LOAD TESTING

Critical flows:

- login;
- public service search;
- request autosave;
- request submit;
- queue;
- payment webhook;
- notification dispatch.

Production targets depend on capacity.

---

# 107. CACHING SAFETY

Never cache personalized response under public key.

Cache keys must include authorization context where necessary.

No sensitive response in shared CDN.

---

# 108. JOB SCHEDULING

Scheduled tasks need:

- distributed lock/leader strategy in multi-instance deployment;
- idempotency;
- monitoring;
- retry.

---

# 109. DATA PURGE

Retention cleanup is explicit.

Examples:

- expired drafts;
- stale idempotency records;
- old temporary uploads;
- logs;
- notification payloads.

Do not hard-delete legally relevant submitted records casually.

---

# 110. ENVIRONMENT PARITY

Dev can be simpler.

But test/staging should expose production-relevant behavior:

- PostgreSQL;
- Flyway;
- object storage abstraction;
- auth;
- concurrency.

---

# 111. TEST PYRAMID

Backend:

```text
Unit
↑ many

Module/integration
↑ substantial

Contract/security
↑ critical

End-to-end
↑ focused
```

Do not rely solely on controller mock tests.

---

# 112. TESTCONTAINERS

Use PostgreSQL Testcontainers for production-relevant persistence.

This prevents false confidence from H2 differences.

---

# 113. MIGRATION TESTS

Test:

1. clean install;
2. upgrade from current baseline;
3. constraints;
4. indexes;
5. old data compatibility.

---

# 114. CONCURRENCY TESTS

Test actual races.

Examples:

- two submits;
- two queue desks call-next;
- same payment webhook twice;
- stale draft save;
- simultaneous appointment slot booking.

---

# 115. FAILURE INJECTION

Where practical test:

- DB timeout;
- provider timeout;
- scanner failure;
- notification failure;
- duplicate webhook;
- network retry.

---

# 116. CODE QUALITY

No giant services.

No utility dumping ground.

No repeated business rule in multiple modules.

No uncontrolled static globals.

No swallowing exceptions.

---

# 117. EXCEPTION MAPPING

Domain exception → stable API error.

Infrastructure exception → sanitized service error.

Unexpected exception → correlation ID + generic response + internal trace.

---

# 118. MAPPING

DTOs != entities.

Use explicit mapping.

Avoid accidental lazy relation serialization.

---

# 119. ENTITY EXPOSURE

Never return JPA entity directly from controller.

Risks:

- PII leak;
- internal fields;
- lazy recursion;
- future contract break.

---

# 120. ENUM EVOLUTION

Enums in API are contracts.

Mobile compatibility matters.

Unknown enum handling should be considered on clients.

---

# 121. DATABASE CONNECTION POOL

Configure pool according to DB capacity.

Do not assume more connections = more throughput.

Monitor saturation.

---

# 122. RESOURCE LIMITS

Containers need:

- CPU limits;
- memory limits;
- JVM memory configuration.

Avoid uncontrolled JVM heap in container.

---

# 123. JVM OBSERVABILITY

Monitor:

- heap;
- GC;
- threads;
- CPU;
- connection pool;
- request latency.

---

# 124. STARTUP FAILURE

Application should fail fast when critical configuration is invalid.

Do not start partially with unusable database migration state.

---

# 125. READINESS

Do not accept traffic until:

- app initialized;
- migrations compatible;
- DB reachable;
- critical services ready.

---

# 126. DEPLOYMENT STRATEGY

Start simple:

- rolling/recreate depending platform;
- health verification;
- quick rollback.

Blue-green/canary later if justified.

---

# 127. DATABASE ROLLBACK

Prefer forward-compatible migration and forward fix.

Schema rollback can be unsafe after new writes.

Plan before release.

---

# 128. CI SECURITY

CI secrets:

- least privilege;
- environment scoped;
- not printed;
- rotated.

PR from untrusted source must not gain production secrets.

---

# 129. ARTIFACT INTEGRITY

Build once, deploy same artifact.

Do not rebuild different binaries per environment.

Config changes per environment.

---

# 130. IMAGE SCANNING

Container images should be scanned.

Critical vulnerabilities require triage before production.

---

# 131. SBOM

Generate SBOM where tooling permits.

Useful for:

- dependency inventory;
- incident response;
- compliance.

---

# 132. CDN / PUBLIC MEDIA

Public news/project images may use CDN.

Citizen documents do not become public CDN assets.

---

# 133. STATIC ASSET VERSIONING

Immutable fingerprints.

Long cache lifetime.

---

# 134. ERROR BUDGET THINKING

Reliability decisions should prioritize user-impacting failures.

Request submission failure is more critical than delayed analytics.

---

# 135. CRITICALITY CLASSES

Suggested:

P0:
security breach/data corruption/critical service unavailable.

P1:
major citizen workflow unavailable.

P2:
degraded non-critical feature.

P3:
minor defect.

Exact incident process later.

---

# 136. RUNBOOKS

Critical systems need runbooks:

- DB down;
- bad deployment;
- failed migration;
- storage unavailable;
- push provider down;
- payment webhook backlog;
- scanner backlog;
- restore.

---

# 137. INCIDENT RESPONSE

Sequence:

```text
detect
→ classify
→ contain
→ communicate
→ recover
→ verify
→ postmortem
→ action items
```

---

# 138. POSTMORTEM

Blameless engineering analysis.

Capture:

- timeline;
- impact;
- root contributors;
- detection gap;
- remediation;
- prevention.

---

# 139. BACKEND ANTI-SLOP RULES

Reject implementation if it contains:

- controller doing everything;
- generic CRUD for workflow;
- `role == ADMIN` everywhere;
- status strings with no state machine;
- duplicated document subsystem;
- unbounded list endpoints;
- direct vendor SDK throughout domain;
- secrets in properties;
- `catch(Exception){}` silence;
- no idempotency on critical command;
- no ownership query on citizen resource;
- synchronous notification dependency on core transaction;
- no migration test;
- no observability;
- "works on my machine" as production gate.

---

# 140. BACKEND QUALITY DIMENSIONS

Every backend feature is evaluated on:

1. domain correctness
2. authorization
3. data integrity
4. API clarity
5. transactional correctness
6. concurrency safety
7. idempotency
8. privacy
9. security
10. observability
11. failure behavior
12. performance
13. scalability
14. migration safety
15. testability
16. maintainability
17. operability
18. client compatibility

---

# 141. DEFINITION OF BACKEND DONE

A feature is done when:

- domain invariants defined;
- permissions defined;
- API contract defined;
- validation defined;
- transaction defined;
- concurrency/idempotency defined;
- persistence/migration defined;
- error behavior defined;
- audit defined;
- metrics/logging defined;
- tests pass;
- production failure behavior considered;
- client handoff documented.

---

# 142. BACKEND REVIEW QUESTIONS

Before approval:

1. Who may call this?
2. Which resource scope?
3. What can race?
4. What can retry?
5. What happens twice?
6. What if DB succeeds but external provider fails?
7. What is audited?
8. What is logged?
9. What data is sensitive?
10. What expires?
11. What is backed up?
12. What happens during restore?
13. How does mobile old-version compatibility work?
14. What is the rollback/forward-fix path?
15. What metric tells us it is broken?

---

# 143. F3 RELATIONSHIP

The existing F3 plan remains the specific implementation authority for:

- versioned forms;
- RequestDraft;
- eligibility;
- autosave;
- documents;
- structured validation;
- idempotent submission;
- citizen-safe request detail.

This Constitution supplies the broader production engineering rules surrounding that implementation.

---

# 144. FINAL DIRECTIVE

Do not optimize Boane Conecta backend for code volume or demo speed.

Optimize for:

**correct municipal behavior + safe citizen data + reliable operations + auditable decisions + clean client contracts.**

---

**END — BOANE CONECTA BACKEND ENGINEERING CONSTITUTION V1**
