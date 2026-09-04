# BOANE CONECTA — LOCAL INTEGRATED RUNBOOK V1

## Purpose

Reproduce the current Boane Conecta stack locally without changing tracked source, weakening security or using production data. This runbook reflects the Block 11 environment audit on 2026-09-04.

> Current tracked configuration has a port conflict: Vite declares port `8080`, while Spring Boot also defaults to `8080`. Until a separately authorized configuration repair is made, start Vite with the runtime argument `--port 5173`. Backend CORS already expects `http://localhost:5173` by default.

## Prerequisites

- Git;
- JDK 21 (the Maven project compiles with `release=21`);
- Maven 3.9+ or an approved Maven Wrapper added in a separate change;
- Node.js compatible with the committed frontend lockfile;
- npm;
- Docker Engine with Docker Compose v2 for the repository-supported infrastructure path;
- free local ports 5173, 8080, 5432, 9000, 9001 and 3310.

Do not use Java 17 for this backend. Do not point the integration profile at production or an unknown database.

## Ports

| Component | Port | Required for |
|---|---:|---|
| Frontend Vite | 5173 | browser UI and configured CORS origin |
| Spring Boot API | 8080 | `/api/v1` |
| PostgreSQL | 5432 | all persisted backend routes |
| MinIO API | 9000 | document mutations/storage |
| MinIO console | 9001 | local storage administration |
| ClamAV | 3310 | document malware scanning |

## Environment variable names

Provide values through a local, ignored environment mechanism. Never commit secrets.

### Database

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`

### Backend/security

- `SPRING_PROFILES_ACTIVE`
- `BACKEND_PORT`
- `JWT_SECRET`
- `JWT_ACCESS_EXPIRATION`
- `JWT_REFRESH_EXPIRATION`
- `ADMIN_BOOTSTRAP_PASSWORD`
- `FRONTEND_URL`

### Object storage/scanner

- `OBJECT_STORAGE_ENDPOINT`
- `OBJECT_STORAGE_REGION`
- `OBJECT_STORAGE_ACCESS_KEY`
- `OBJECT_STORAGE_SECRET_KEY`
- `OBJECT_STORAGE_QUARANTINE_BUCKET`
- `OBJECT_STORAGE_TRUSTED_BUCKET`
- `SCANNER_HOST`
- `SCANNER_PORT`
- `SCANNER_TIMEOUT_MILLIS`
- `SCANNER_POLL_DELAY_MILLIS`

### Domain timing

- `REQUEST_DRAFT_TTL_DAYS`
- `APPOINTMENT_HOLD_TTL`
- `APPOINTMENT_CANCELLATION_CUTOFF`
- `APPOINTMENT_CHECK_IN_OPENS_BEFORE`
- `APPOINTMENT_CHECK_IN_LATE_TOLERANCE`
- `APPOINTMENT_CHECK_IN_MAX_FAILED_ATTEMPTS`

### Frontend

- `VITE_API_BASE_URL`

Expected local values are documented by `.env.example`; secrets must be replaced locally. Do not copy development defaults to production.

## Safe target checks

Before database startup or Flyway:

```powershell
Get-NetTCPConnection -State Listen |
  Where-Object LocalPort -In 5173,8080,5432,9000,9001,3310

docker context show
docker compose config
```

Confirm that the configured datasource host is local or the named Compose service `postgres`. Stop if it resolves to an unknown or remote host.

## Infrastructure startup

The repository Compose file defines PostgreSQL 16, MinIO, ClamAV and the backend. For a full stack:

```powershell
Set-Location "F:\codebases777\BoaneConeta\repo"
docker compose up -d postgres minio clamav
docker compose ps
docker compose logs postgres --tail 100
```

For read-only service/auth/queue tests, PostgreSQL is the persistence dependency. MinIO and ClamAV are operational dependencies for document mutations. Their clients may still be constructed at backend startup; verify actual startup behavior before classifying them as optional.

## Database and Flyway sequence

Use a fresh disposable database name dedicated to integration. The authoritative migration path is V1 through V19.

```powershell
$env:SPRING_PROFILES_ACTIVE = "local"
$env:DATABASE_URL = "jdbc:postgresql://localhost:5432/<disposable_database>"
$env:DATABASE_USERNAME = "<local_user>"
$env:DATABASE_PASSWORD = "<local_password>"
$env:JWT_SECRET = "<local-strong-secret-at-least-256-bits>"
$env:ADMIN_BOOTSTRAP_PASSWORD = "<local-strong-admin-password>"
$env:FRONTEND_URL = "http://localhost:5173"
```

Do not print password values in logs or reports. On first Spring Boot startup, Flyway must apply V1–V19 and Hibernate `ddl-auto=validate` must succeed. Stop on any migration or schema-validation failure; do not edit a migration in place.

## Backend command

```powershell
Set-Location "F:\codebases777\BoaneConeta\repo\backend"
mvn spring-boot:run
```

Alternative full Compose startup, after environment values are provided:

```powershell
Set-Location "F:\codebases777\BoaneConeta\repo"
docker compose up --build backend
```

Expected API base: `http://localhost:8080/api/v1`.

## Health verification

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/v1/health"
```

Also inspect startup logs for:

- active profile;
- datasource connection;
- Flyway V1–V19 success;
- Hibernate validation success;
- Spring Security initialization;
- absence of default-password warnings after a local password is supplied.

## Test identities

Supported mechanisms currently evidenced by code:

- `SUPER_ADMIN`: `AdminBootstrap` creates the fixed bootstrap admin email and assigns `SUPER_ADMIN`; the password comes only from `ADMIN_BOOTSTRAP_PASSWORD`.
- `CITIZEN`: POST `/api/v1/auth/register` creates a disposable citizen through the public registration contract.

No supported admin API currently assigns `ADMIN`, `MANAGER`, `EMPLOYEE` or `EDITOR`. Do not invent credentials or edit production data. A future bounded fixture mechanism is required for the complete role matrix.

## Frontend installation and startup

```powershell
Set-Location "F:\codebases777\BoaneConeta\repo\frontend"
npm ci
$env:VITE_API_BASE_URL = "http://localhost:8080/api/v1"
npm run dev -- --port 5173
```

Open `http://localhost:5173`. Do not start the current Vite configuration on 8080 while the backend is using that port.

## CORS verification

```powershell
$headers = @{
  Origin = "http://localhost:5173"
  "Access-Control-Request-Method" = "GET"
  "Access-Control-Request-Headers" = "authorization,content-type"
}
Invoke-WebRequest -Method Options `
  -Uri "http://localhost:8080/api/v1/public/services" `
  -Headers $headers
```

Expected policy from source:

- exact allowed origin from `FRONTEND_URL`;
- methods GET, POST, PUT, PATCH, DELETE and OPTIONS;
- Authorization, Content-Type, Accept, If-Match, Idempotency-Key and X-Correlation-ID headers;
- credentials allowed;
- no wildcard-origin expansion.

## Verification order

1. health;
2. public services list;
3. bootstrap-admin login/me/refresh/logout;
4. disposable citizen registration/login/me;
5. read-only Admin Services, queue snapshots, appointments and queue configuration;
6. citizen dashboard, requests, notifications and appointment list;
7. document reads;
8. document mutations only after MinIO and ClamAV are healthy.

Do not call queue mutations, schedule mutations, appointment mutations or document mutations merely to prove startup.

## Regression gates

Frontend:

```powershell
Set-Location "F:\codebases777\BoaneConeta\repo\frontend"
npm ci
npm run lint
npx tsc -p tsconfig.app.json --noEmit
npm run test
npm run build
```

Backend, with JDK 21, Maven and Docker available:

```powershell
Set-Location "F:\codebases777\BoaneConeta\repo\backend"
mvn test
```

Some backend tests use Testcontainers/PostgreSQL and require a healthy Docker engine.

## Shutdown

Stop foreground frontend/backend processes with `Ctrl+C`, then:

```powershell
Set-Location "F:\codebases777\BoaneConeta\repo"
docker compose down
```

Do not add `-v` unless the disposable volumes have been positively identified and deletion is explicitly intended.

## Known blockers from Block 11

- audited sandbox lacks Maven and Maven Wrapper;
- audited sandbox has JDK 17, while the project requires JDK 21;
- audited sandbox lacks Docker/Podman and PostgreSQL tools/runtime;
- current Vite tracked port 8080 conflicts with backend port 8080;
- backend CORS default and `.env.example` expect frontend origin 5173;
- only SUPER_ADMIN and CITIZEN have supported identity-creation mechanisms;
- no runtime fixtures were captured because the backend could not start in the audited environment.

