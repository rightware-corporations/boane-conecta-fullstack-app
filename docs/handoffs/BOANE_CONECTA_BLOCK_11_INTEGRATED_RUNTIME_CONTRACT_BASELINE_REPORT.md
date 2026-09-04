# BOANE CONECTA — BLOCK 11 INTEGRATED RUNTIME CONTRACT BASELINE REPORT

## Final verdict

**BLOCK 11 — INTEGRATED RUNTIME BASELINE PARTIAL / NO-GO**

The frontend baseline remains green, and the runtime configuration/security contracts were audited statically. The integrated backend baseline could not be executed in this sandbox because the required toolchain and local infrastructure are absent. No unsafe workaround, remote database, fabricated identity or fabricated runtime fixture was used.

Block 12 is **not authorized to proceed as an integrated implementation block** until the prerequisites in section 24 are satisfied.

## 1. Baseline

- Repository: `rightware-corporations/boane-conecta-fullstack-app`.
- Working path: `/workspace/scratch/4da30144c903/usb-codebase/repo`.
- Branch: `feat/fullstack-f5-appointments-queue`.
- Committed HEAD: `88e4d852f374169e41b778d21a4076322f5062fb`.
- Remote F5 publication baseline: `378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0` (known project baseline; live ref verification produced no usable output in this restricted run).
- Reconstructed Baseline V2 report: present.
- Reconstructed Baseline V2 manifest: present.
- Expected frontend baseline: 23 test files / 76 tests.
- Existing preservation working tree was not reset, cleaned, committed, rebased, merged or pushed.

Block 10's 41-route functional coverage report remains the product inventory authority.

## 2. Environment and toolchain

| Item | Actual result | Required/impact |
|---|---|---|
| OS | Ubuntu 24.04.3 LTS, Linux x86_64 | suitable container base |
| Java | OpenJDK 17.0.20 | **insufficient**; `pom.xml` requires release 21 |
| Maven | unavailable | backend build/start/test blocked |
| Maven Wrapper | unavailable | no repository-supported fallback |
| Node.js | 24.19.0 | frontend commands executed |
| npm | 11.9.0 | frontend commands executed; proxy warning only |
| Docker | unavailable | Compose/Testcontainers blocked |
| Docker Compose | unavailable | repository infrastructure startup blocked |
| Podman | unavailable | no local container alternative |
| `psql` / `pg_isready` | unavailable | no local PostgreSQL verification tools |
| Listening app ports | neither 5173 nor 8080 occupied | no existing stack was running |
| Relevant app environment variables | none detected by name | no risk of accidentally targeting a supplied database |

No toolchain or repository dependency was installed to bypass these facts.

## 3. Infrastructure status

| Component | Status | Classification | Evidence |
|---|---|---|---|
| PostgreSQL 16 | NOT AVAILABLE | REQUIRED_TO_BOOT / REQUIRED_FOR_READ_ROUTES | datasource is mandatory; no runtime/client/container engine |
| MinIO/S3-compatible storage | NOT STARTED | REQUIRED_FOR_DOCUMENT_MUTATIONS; startup requirement unproven | existing Compose/config only |
| ClamAV | NOT STARTED | REQUIRED_FOR_DOCUMENT_MUTATIONS; startup requirement unproven | existing Compose/config only |
| Spring Boot | NOT STARTED | REQUIRED_TO_BOOT | Maven/JDK/PostgreSQL blockers |
| Vite | build verified, dev server not needed for gates | REQUIRED_FOR_BROWSER_SMOKE | configuration statically audited |

The repository's Compose backend declares `depends_on` PostgreSQL, MinIO and ClamAV. At application-code level, PostgreSQL is unquestionably required for boot/read routes. Object storage and scanner are required for safe document mutation; actual lazy/eager startup behavior could not be proven.

## 4. PostgreSQL status

No disposable local database could be established:

- Docker/Podman unavailable;
- PostgreSQL server/client unavailable;
- no database environment variables supplied;
- no remote or unknown database was contacted.

Host, port, database and username therefore remain `NOT ESTABLISHED`. Passwords were neither requested nor printed.

## 5. Flyway result

**NOT EXECUTED — INFRASTRUCTURE_BLOCKER + TOOLCHAIN_BLOCKER.**

Static repository evidence confirms migrations V1 through V19 and `ddl-auto=validate`, but it does not prove runtime application. No migration count, schema-history table, final version or Hibernate validation result is claimed.

The stop policy was respected: no migration was edited.

## 6. Backend startup

**NOT EXECUTED.** The combined blockers are:

1. project requires JDK 21 but only JDK 17 is installed;
2. Maven is unavailable;
3. Maven Wrapper is absent;
4. PostgreSQL runtime is unavailable.

Consequently, server port, active runtime profile, datasource connection, Spring Security startup, storage/scanner connectivity and health response were not runtime-verified.

## 7. Frontend startup and configuration

Static configuration evidence:

- API client default: `http://localhost:8080/api/v1`;
- `.env.example`: `VITE_API_BASE_URL=http://localhost:8080/api/v1`;
- backend default port: 8080;
- backend CORS/default frontend URL: `http://localhost:5173`;
- **tracked Vite development port: 8080**.

This is a proven `CONFIGURATION_ONLY` P0 defect: frontend and backend cannot both bind 8080, and the configured CORS origin expects 5173. No source was changed. The runbook uses `npm run dev -- --port 5173` as a reversible runtime override.

## 8. CORS

Runtime preflight was not possible. Static `SecurityConfig` evidence establishes:

- exact allowed origin: `app.frontend-url` / `FRONTEND_URL`;
- methods: GET, POST, PUT, PATCH, DELETE, OPTIONS;
- allowed headers: Authorization, Content-Type, Accept, If-Match, Idempotency-Key, X-Correlation-ID;
- exposed headers: Authorization, ETag, X-Correlation-ID;
- credentials allowed: true;
- max age: 3600 seconds;
- OPTIONS globally permitted.

No wildcard or security weakening was introduced. Runtime CORS remains `UNVERIFIED` until backend startup.

## 9. Test identities

No identity was created because no disposable database/backend existed.

Supported mechanisms proven statically:

| Role | Mechanism | Runtime login |
|---|---|---|
| SUPER_ADMIN | `AdminBootstrap`, password supplied through `ADMIN_BOOTSTRAP_PASSWORD` | NOT TESTED |
| CITIZEN | public `/auth/register` | NOT TESTED |
| ADMIN | no supported creation/assignment API | BLOCKED_BY_DATA_BOOTSTRAP_GAP |
| MANAGER | no supported creation/assignment API | BLOCKED_BY_DATA_BOOTSTRAP_GAP |
| EMPLOYEE | no supported creation/assignment API | BLOCKED_BY_DATA_BOOTSTRAP_GAP |
| EDITOR | no supported creation/assignment API | BLOCKED_BY_DATA_BOOTSTRAP_GAP |

The fixed bootstrap email in source is not a password fixture. The demo citizen credentials displayed by `/auth` are unsupported by migrations/bootstrap and were not used.

## 10. Role normalization

Static frontend adapter mapping remains:

| Backend | Frontend |
|---|---|
| SUPER_ADMIN | super_admin |
| ADMIN | admin |
| MANAGER | gestor |
| EMPLOYEE | funcionario |
| EDITOR | editor |
| CITIZEN | municipe |

The chain `backend auth response → frontend adapter → route role` is structurally present but **not runtime-verified**.

## 11. Auth endpoint evidence

Runtime calls to login, refresh, logout, me and registration were not executed. Static controller/security evidence confirms the routes and public/authenticated boundaries.

No sanitized success fixture exists because fabricating one would violate the prompt. Static error handlers show the expected envelope uses `ApiResponse.failure(...)`, but actual serialized responses/statuses remain unverified.

## 12. Runtime route/access matrix

`STATIC_EXPECTATION` means route/controller evidence exists but no HTTP/browser runtime proof was possible.

| Route | Role | Frontend access | Backend endpoint/result | HTTP | Contract aligned | Runtime status | Blocker |
|---|---|---|---|---|---|---|---|
| `/auth` | anonymous | allowed | auth endpoints declared | N/E | partial | BLOCKED | backend/toolchain |
| `/admin` | SA/Admin/Manager/Employee/Editor | allowed | no endpoint required | N/A | yes | STATIC_EXPECTATION | browser auth unavailable |
| `/admin/filas` | SA/Admin/Manager/Employee | allowed | GET queue snapshots declared | N/E | yes | BLOCKED | no backend/identities |
| `/admin/agenda` | SA/Admin/Manager/Employee | allowed | GET admin appointments declared | N/E | yes | BLOCKED | no backend/identities |
| `/admin/servicos` | SA/Admin/Manager | allowed | GET admin services declared | N/E | yes | BLOCKED | no backend/identities |
| `/admin/filas/configuracao` | SA/Admin | allowed | queue/admin reads declared | N/E | yes | BLOCKED | no backend/identities |
| `/municipe` | Citizen + SA/Admin frontend | dashboard requires CITIZEN | predicted 403 for SA/Admin | N/E | no | BLOCKED | auth mismatch not runtime-proven |
| `/municipe/perfil` | Citizen + SA/Admin frontend | profile requires CITIZEN | predicted 403 for SA/Admin | N/E | no | BLOCKED | auth mismatch not runtime-proven |
| `/municipe/pedidos` | Citizen + SA/Admin frontend | requests require CITIZEN | predicted 403 for SA/Admin | N/E | no | BLOCKED | auth mismatch not runtime-proven |
| `/municipe/pedidos/:id` | Citizen + SA/Admin frontend | owner-scoped detail requires CITIZEN | predicted 403 for SA/Admin | N/E | no | BLOCKED | no fixture/identity |
| `/municipe/documentos` | Citizen + SA/Admin frontend | documents require CITIZEN | predicted 403 for SA/Admin | N/E | no | BLOCKED | no backend/storage/identity |
| `/municipe/pagamentos` | Citizen + SA/Admin frontend | payments require CITIZEN | predicted 403 for SA/Admin | N/E | no + DTO mismatch | BLOCKED | no backend/identity |
| `/municipe/agendamentos` | Citizen + SA/Admin frontend | appointments require CITIZEN | predicted 403 for SA/Admin | N/E | no at auth boundary | BLOCKED | no backend/identity |
| `/municipe/notificacoes` | Citizen + SA/Admin frontend | notifications require CITIZEN | predicted 403 for SA/Admin | N/E | no | BLOCKED | no backend/identity |
| `/servicos` | anonymous | allowed | GET public services | N/E | yes | BLOCKED | no backend/database |
| `/servicos/:slug` | anonymous | allowed | GET service by valid slug | N/E | yes | BLOCKED | no real database slug |
| `/filas/:queueId/display` | anonymous | allowed | GET public queue projection | N/E | yes | BLOCKED | no real queue fixture |

`N/E` = not executed.

## 13. Citizen authorization mismatch evidence

Runtime proof was blocked, so this remains a **high-confidence static AUTHORIZATION_MISMATCH**, not a claimed HTTP observation:

- every citizen route in `App.tsx` permits `municipe`, `super_admin` and `admin`;
- `SecurityConfig` requires `ROLE_CITIZEN` for `/api/v1/citizen/**`;
- relevant controllers use `hasRole('CITIZEN')` and/or principal ownership.

The backend must not be weakened. Block 12 should narrow frontend citizen route access or introduce a separately approved, audited impersonation/support model; current evidence supports narrowing.

## 14. Internal route evidence

Internal read routes and backend annotations align statically for Filas, Agenda, Services and queue configuration. The complete role matrix could not be executed because only SUPER_ADMIN and CITIZEN have supported bootstrap mechanisms, and neither backend nor database was available.

No queue, appointment, schedule or configuration mutation was attempted.

## 15. Public Services evidence

The client/controller paths and DTO adapter remain aligned statically, with existing frontend API tests. Runtime list/detail and real slug behavior were not exercised because no database/backend existed.

## 16. Admin Services fixture validation

No real fixture was captured. Existing tests validate the explicit DTO-to-presentation adapter, but this is not substituted for runtime evidence. `docs/runtime/fixtures/README.md` records the blocked catalogue.

## 17. F5 read-only smoke evidence

Queue snapshots, admin appointment list, queue configuration reads, citizen appointment list/availability and queue-ticket projection were not called. There was no disposable backend/database or identity. No shared data was mutated.

## 18. Error-contract evidence

Static evidence:

- 401 handler returns HTTP 401 with `ApiResponse.failure("Authentication required")`;
- 403 handler returns HTTP 403 with `ApiResponse.failure("Access denied")`;
- validation handler builds field-level `ApiError(field,message)` entries;
- frontend `ApiErrorPayload` models `message` and permits unknown fields but does not expose a typed field-error collection.

Runtime 400/401/403/404 fixtures were not captured. The frontend can display the top-level message but does not have a typed contract for field errors. This is a `FRONTEND_CONTRACT_DEFECT` to address only after real fixtures are captured.

## 19. Backend gates

**BLOCKED_BY_TOOLCHAIN.** `mvn test` was not run because Maven is unavailable, Maven Wrapper is absent and Java 17 does not satisfy Java 21. Testcontainers tests would additionally require Docker.

No backend PASS claim is made.

## 20. Frontend gates

Executed after a clean `npm ci` installation:

| Gate | Result |
|---|---|
| `npm ci` | PASS — 498 packages installed from lockfile |
| `npm run lint` | PASS |
| `npx tsc -p tsconfig.app.json --noEmit` | PASS |
| `npm run test` | PASS — 23 files, 76/76 tests |
| `npm run build` | PASS — 2242 modules transformed |
| `git diff --check` | verified separately; LF/CRLF notices are informational |

Warnings were limited to the known npm proxy setting, deprecated transitive packages, React Router future flags and stale Browserslist data. No dependency or lockfile was updated.

## 21. Runtime fixture catalogue

Path: `docs/runtime/fixtures/README.md`.

Real fixture count: **0**. This is deliberate and honest. The catalogue lists expected future filenames and sanitization rules; it contains no tokens, passwords, personal data or invented payloads.

## 22. Integration defects

| ID | Classification | Finding | Evidence level | Repair boundary |
|---|---|---|---|---|
| B11-01 | TOOLCHAIN_BLOCKER | Maven and Wrapper absent; JDK 17 vs required 21 | runtime environment | install/prepare external toolchain, no repo change required unless Wrapper separately approved |
| B11-02 | INFRASTRUCTURE_BLOCKER | no Docker/Podman/PostgreSQL | runtime environment | provide local disposable PostgreSQL and container runtime |
| B11-03 | CONFIGURATION_ONLY | Vite and backend both default to 8080; CORS expects 5173 | tracked config | use runtime `--port 5173`; later authorize tracked Vite correction |
| B11-04 | DATA_BOOTSTRAP_GAP | only SUPER_ADMIN and CITIZEN have supported creation mechanisms | code contract | approve safe local role-fixture mechanism |
| B11-05 | AUTHORIZATION_MISMATCH | citizen frontend guards allow SA/Admin; backend requires CITIZEN | static high-confidence | Block 12 frontend guard correction |
| B11-06 | ROUTE_REDIRECT_DEFECT | Editor/Employee/Manager defaults target placeholders | static high-confidence | Block 12 redirect correction |
| B11-07 | SECURITY_CONCERN | `/auth` displays unsupported demo credentials | static | Block 12 remove misleading credentials; never seed them merely to match UI |
| B11-08 | TEST_FIXTURE_GAP | no real service/queue/request data fixture mechanism | runtime blocked | approved disposable seed/fixture strategy |
| B11-09 | FRONTEND_CONTRACT_DEFECT | frontend lacks typed field-error list | static | capture real errors first; bounded later repair |

## 23. P0/P1 classification

### P0

- B11-01 toolchain;
- B11-02 infrastructure;
- B11-03 port/CORS development configuration;
- B11-04 role identity bootstrap;
- B11-05 citizen authorization mismatch;
- B11-06 placeholder redirects;
- B11-07 unsupported demo credentials.

### P1

- B11-08 disposable real-data fixtures;
- B11-09 typed error contract after runtime capture;
- integrated read-only verification of Services, F5 and citizen surfaces;
- backend test suite and PostgreSQL migration evidence.

## 24. Exact Block 12 prerequisites

Before Block 12 implementation:

1. make JDK 21 and Maven 3.9+ available, or separately authorize a Maven Wrapper addition;
2. provide Docker Compose or local PostgreSQL 16 on a disposable database;
3. run Flyway V1–V19 and `ddl-auto=validate` successfully;
4. run backend tests, including Testcontainers where required;
5. start backend and verify health/CORS at 8080/5173;
6. establish SUPER_ADMIN and disposable CITIZEN via supported mechanisms;
7. approve a safe test-only mechanism for ADMIN/MANAGER/EMPLOYEE/EDITOR identities;
8. capture real sanitized auth, service, citizen, appointment and queue fixtures;
9. execute the route/access matrix and confirm the predicted 403 behavior;
10. return a reviewed PASS or a narrowly bounded runtime-remediation authorization.

Block 12 should then be bounded to access/redirect safety and elimination of mock public lookup. It must not start the citizen request creation journey.

## 25. Git and boundary verification

Block 11 created documentation and a fixture-catalogue README only. It did not alter application code, backend, migrations, package manifests, lockfiles or environment files. The accumulated Baseline V2 working tree remains intentionally dirty and unstaged.

No commit, push, merge, reset, clean, rebase or history reconciliation occurred.

## 26. Final assessment

**PARTIAL / NO-GO** is caused by environment/toolchain absence, not by a proven Flyway or backend repository failure. The frontend remains stable. The backend, migrations, auth, CORS and real contracts remain unverified at runtime and must not be described as passing.

The safe next action is to reproduce the runbook on the Windows development machine or in an environment with JDK 21, Maven, Docker Compose and PostgreSQL, then resume Block 11 from database target validation. Do not begin Block 12 automatically.

