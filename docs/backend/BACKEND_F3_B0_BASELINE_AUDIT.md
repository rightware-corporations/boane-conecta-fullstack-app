# Boane Conecta Backend F3 — B0 Baseline Audit

Status: completed  
Branch: `feat/backend-f3-request-foundation`  
Local base: `216666c769c815543664aefd7ff0a7fad419da7c`  
Remote-equivalent F2 tree: `a93dcbab11e87ce507bde48e7821309ccdfab81d`

## Repository baseline

- Repository: `rightware-corporations/boane-conecta-fullstack-app`
- Source branch: `feat/frontend-v2-foundation`
- Worktree before B0: clean
- Backend delta in F0–F2: zero
- Backend source files: 150 Java files
- Backend test files: 9
- Existing test methods: 28
- Existing Flyway migrations: V1–V8
- Existing CI workflows: none

## Runtime inventory

- Project target: Java 21
- Sandbox Java: 17.0.20
- Spring Boot: 3.3.1
- Build: Maven
- Sandbox Maven: unavailable
- Sandbox Docker: unavailable
- Database target: PostgreSQL
- Test database currently used: H2 PostgreSQL compatibility mode

The sandbox cannot execute the Java 21 Maven/Testcontainers gates until tooling is provisioned. A GitHub Actions PostgreSQL/Testcontainers pipeline is required before F3 can be declared verified.

## Migration inventory

- V1: PostgreSQL UUID extension
- V2: users, roles, permissions, refresh tokens, audit logs
- V3: districts, departments, citizen profiles
- V4: services, requirements, fees, documents, citizen requests, request history and request documents
- V5: complaints, payments and appointments
- V6: notifications and public content
- V7: initial roles, departments and districts
- V8: refresh-token indexes

All F3 migrations must be additive, preserve V1–V8 data and begin after V8.

## Security inventory

Current strengths:

- bearer JWT access tokens;
- hashed, rotated refresh tokens;
- BCrypt passwords;
- stateless Spring Security;
- explicit CORS origin;
- method security;
- citizen ownership queries exist for requests and documents;
- refresh-token uniqueness/indexes;
- authorization tests cover anonymous and role rejection.

Current gaps:

- authorization is primarily role-based rather than capability/scope/context-based;
- CORS does not allow/expose F3 concurrency, idempotency and correlation headers;
- no correlation IDs or stable API error codes;
- no operation-specific rate limiting;
- no persistent idempotency;
- no optimistic concurrency;
- no outbox;
- no Actuator/Micrometer production readiness and metrics;
- no Testcontainers security/migration suite;
- default local bootstrap credentials must never be accepted in production.

## Request inventory

Current request creation:

- `POST /api/v1/citizen/requests` immediately creates `SUBMITTED`;
- citizen can currently supply priority;
- request contains assignment and operational status fields;
- admin can mutate status directly;
- no RequestDraft, form version, eligibility, validation snapshot or idempotency;
- references use `BC-yyyyMMdd-random` style;
- citizen ownership reads use `findByIdAndCitizenUser`.

This model is retained for compatibility but is not the F3 write model.

## Document inventory

Current strengths:

- citizen ownership checks;
- generated stored filename;
- normalized path and traversal guard;
- 10 MB size guard;
- MIME allowlist;
- private visibility by default;
- request-document link table.

Current gaps:

- durable bytes use local filesystem;
- browser MIME is trusted;
- no magic-byte detection;
- no hash, version or classification;
- no quarantine/trusted zones;
- no scan lifecycle;
- status model is only ACTIVE/ARCHIVED/REJECTED;
- no requirement-level draft attachment;
- no object-storage abstraction;
- no cleanup or scanner worker.

## Data/time inventory

- Existing migrations use PostgreSQL `TIMESTAMP` without timezone.
- Existing entities use `LocalDateTime`.
- F3 new durable timestamps will use timezone-safe semantics and `timestamptz`.
- Legacy timestamp conversion is not part of F3 and requires a separate migration plan.

## Test inventory

Existing tests cover authentication, refresh rotation, roles, requests, documents, appointments, complaints, payments, notifications and reports.

Gaps:

- persistence tests run against H2 rather than PostgreSQL;
- no clean/upgrade Flyway verification;
- no real concurrency races;
- no idempotency replay tests;
- no BOLA tests for drafts;
- no upload spoofing/magic-byte tests;
- no storage/scanner failure injection;
- no OpenAPI contract validation.

## B0 conclusion

F3 must introduce a new controlled request-draft/submission path and harden shared platform services without performing a big-bang rewrite of unrelated legacy modules. B1 is authorized only under the approved ADR bundle.
