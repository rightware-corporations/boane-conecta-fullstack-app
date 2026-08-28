# Boane Conecta — F3 Request Foundation Implementation

Status: implemented on `feat/backend-f3-request-foundation`
Scope: backend request foundation only; no mobile client, no F2/F3 frontend redesign.

## Delivered stages

1. **B0 — Baseline and ADR lock:** baseline audit plus approved decisions for drafts, versioning, concurrency, idempotency, document security and compatibility.
2. **B1 — Versioned definitions:** immutable service/form versions, schema validation, controlled publication and a citizen-readable published definition.
3. **B2 — Draft lifecycle:** create/resume/read with a 90-day TTL and ETag version.
4. **B3 — Incremental answers:** partial answers, conditional visibility, hidden-value policy and eligibility evaluation guarded by `If-Match`.
5. **B4 — Secure documents:** signature verification, quarantine object storage, immutable versions, malware scan and requirement-specific draft links.
6. **B5 — Validation/review:** structured field, document and global errors; valid drafts become `READY_FOR_REVIEW`.
7. **B6 — Atomic submission:** declaration acceptance, immutable snapshot, normal server-owned priority, history, outbox and seven-day idempotent replay.
8. **B7 — Safe citizen detail:** a citizen-specific projection that excludes staff identities, internal comments and administrative metadata.
9. **B8 — Operations:** correlation IDs, backward-compatible error codes, scheduled retention, scan and outbox workers, health/Prometheus endpoints, MinIO and ClamAV local services.
10. **B9 — Verification:** unit contracts, PostgreSQL Flyway migration test and Java 21 GitHub Actions gate.

## Principal API flow

All citizen routes require bearer authentication and role `CITIZEN`.

| Operation | Method and route | Concurrency/idempotency |
|---|---|---|
| Read definition | `GET /api/v1/citizen/services/{serviceId}/request-definition` | Published versions only |
| Create/resume draft | `POST /api/v1/citizen/request-drafts` | Returns `ETag` |
| Read draft | `GET /api/v1/citizen/request-drafts/{draftId}` | Returns `ETag` |
| Save answers | `PATCH .../{draftId}/answers` | Requires `If-Match` |
| Evaluate eligibility | `PUT .../{draftId}/eligibility` | Requires `If-Match` |
| Attach document | `PUT .../{draftId}/documents/{requirementKey}` | Requires `If-Match` |
| Validate | `POST .../{draftId}/validate` | Requires `If-Match` |
| Submit | `POST .../{draftId}/submit` | Requires `If-Match` and `Idempotency-Key` |
| Safe request detail | `GET /api/v1/citizen/requests/{requestId}` | Ownership enforced |

The legacy direct `POST /api/v1/citizen/requests` route remains temporarily compatible, emits deprecation/sunset headers, and ignores citizen-supplied priority. New clients must use the draft flow.

## Submission invariants

- One submitted request per draft is enforced by database uniqueness and a pessimistic draft lock.
- The declaration version must equal the draft's immutable form version.
- Full server validation is repeated inside the submission transaction.
- Only `VALID` documents satisfying the published requirement can be submitted.
- Answers, eligibility, document manifest, declaration acceptance and schema checksum are snapshotted immutably.
- The response is replayed for the same idempotency key and fingerprint; key reuse with another payload returns conflict.
- F3 submissions always receive server-owned `NORMAL` priority.

## Document trust boundary

Uploads enter the quarantine bucket as `RECEIVED`. A worker locks a bounded batch, reads the object, scans with ClamAV and either moves it into the trusted bucket as `VALID` or fails closed as `REJECTED`. Downloads and draft attachments require `VALID`. Tests use deterministic in-memory storage and a clean scanner fake.

## Local infrastructure

`docker compose up --build` starts PostgreSQL 16, MinIO, ClamAV and the backend. Object-storage and scanner credentials/endpoints are environment configurable. Production must provide strong non-default secrets and durable bucket policies.

## Quality gates

Run from `backend/` with Java 21:

```bash
mvn --batch-mode --no-transfer-progress verify
```

The test suite includes the existing module/security contracts, dynamic form and eligibility rules, file-signature rules, and a Testcontainers PostgreSQL test that applies the full Flyway history. CI runs the same command on pushes to this feature branch and on pull requests.

## Explicit non-goals

- No mobile React Native implementation.
- No `Case` aggregate expansion; it remains a later bounded-context decision.
- No merge to `master`.
- No replacement of bearer/rotated-refresh authentication.
