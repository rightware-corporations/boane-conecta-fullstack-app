# ADR F3-001 — Approved Backend Foundation Decisions

Status: accepted  
Scope: backend F3 only

## Context

The existing backend can create submitted citizen requests and store documents locally, but F3 requires server drafts, versioned definitions, secure documents, optimistic autosave and idempotent submission. The following decisions were explicitly approved before the first F3 migration.

## Decisions

### 1. Branch and baseline

Use `feat/backend-f3-request-foundation`, derived from the F2 implemented tree. Do not modify the frontend feature branch directly.

### 2. Draft aggregate

Create a dedicated `RequestDraft` aggregate. Do not represent F3 drafts as `CitizenRequest(status=DRAFT)`.

### 3. Request and Case

F3 produces an immutable citizen Request. Case remains a distinct future operational aggregate. Existing request assignment/status fields are treated as legacy compatibility debt and are not extended by the new F3 write model. F3 does not implement the staff Case workspace.

### 4. Versioned definitions

Service form definitions, eligibility rules, document requirements and declarations are immutable by published version. Drafts and submitted snapshots pin their versions/checksums.

### 5. Dynamic answers

Use constrained JSONB for dynamic answers and schemas. Do not use generic EAV and do not execute arbitrary expressions. The server validates every field against the pinned schema.

### 6. Concurrency

Use a numeric JPA/database version and `If-Match`/ETag semantics. Stale writes return a stable 409 conflict; no silent last-write-wins.

### 7. Idempotency

Use a persistent PostgreSQL idempotency record scoped by actor, operation and key hash. Retain completed F3 submit records for seven days by default. Same key plus different fingerprint is rejected.

### 8. Authentication

Retain bearer access tokens and rotated refresh tokens for web/mobile compatibility. F3 does not introduce cookie-only authentication. Authorization adds capability/resource/scope/context checks while retaining role compatibility.

### 9. API errors

Evolve the current `ApiResponse` envelope compatibly by adding stable `code`, `correlationId` and structured details. Do not silently replace every existing response in one migration.

### 10. Reference format

Preserve the existing server-generated request reference format during F3. A format redesign is not required for domain correctness and examples in the canon are provisional.

### 11. Time

Use `Instant`/offset-safe API semantics and PostgreSQL `timestamptz` for new F3 data. Do not convert all existing `LocalDateTime` columns in F3.

### 12. Draft retention

Authenticated drafts expire after 90 days by default, configurable by environment. Expiry is a multi-instance-safe scheduled operation.

### 13. Documents

Reuse the canonical Document domain. Introduce DocumentVersion and contextual draft links; do not create a separate request-upload blob subsystem.

### 14. Object storage

Use an application-owned storage interface with an S3-compatible adapter. Use MinIO for local/test topology. No production business bytes depend on application local disk.

### 15. Malware scanning

Use a scanner adapter with ClamAV-compatible implementation. Required documents must reach `VALID` before submission. Test profile may use a deterministic fake adapter; production fails closed when scanning is unavailable or unconfigured.

### 16. Upload lifecycle

Use explicit states `RECEIVED`, `SCANNING`, `VALID`, `REJECTED`, `EXPIRED`, `REPLACED`, `ARCHIVED`. Validate size, allowlist, signature/magic bytes, storage key and ownership server-side.

### 17. Legacy create endpoint

Keep the direct create endpoint temporarily for compatibility, mark it deprecated and remove citizen control over operational priority. New F3 clients use RequestDraft and submit commands only.

### 18. Submission

Submission is a single transactional command that validates the draft, persists immutable snapshots, creates exactly one CitizenRequest, links documents, writes history/audit/domain/outbox records and stores the idempotent result.

### 19. Offline and timeout

Offline submission is not authorized. After an ambiguous timeout, clients call submission status rather than blindly retrying.

### 20. Mobile boundary

F3 backend remains compatible with future React Native clients, but no mobile phase is implemented now.

## Consequences

- New migrations and modules are additive.
- H2 is no longer sufficient as the F3 persistence authority.
- PostgreSQL Testcontainers and CI are required.
- Local object storage and scanner services must be represented in development topology.
- F4 and later remain blocked.
