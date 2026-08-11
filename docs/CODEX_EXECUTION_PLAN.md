# CODEX EXECUTION PLAN

Repository: `boane-conecta-fullstack`  
Plan created: 2026-06-22  
Mode: Future implementation roadmap only. No business modules were implemented during audit.

## Execution Principles

- Preserve Manus work.
- Do not replace the architecture.
- Keep the modular monolith.
- Keep Spring Boot, PostgreSQL, Flyway, JWT, BCrypt, RBAC, and local file storage.
- Do not remove Supabase until the frontend migration path is proven.
- Do not introduce microservices, CQRS, event sourcing, Redis, Kubernetes, message brokers, or additional frameworks unless a future explicit task requires them.
- Do not claim build/test success without command evidence.

## PHASE 001 - Build and Runtime Verification Baseline

Objective:

Establish a reliable local/backend verification loop before adding or changing application behavior.

Scope:

- Confirm Java 21 and Maven availability, or add/use a Maven wrapper after approval.
- Run backend Maven commands.
- Verify Docker Compose backend/PostgreSQL path if local Maven remains unavailable.
- Run Flyway migrations against PostgreSQL.
- Verify health endpoint.
- Document exact commands and outputs.

Files affected:

- `backend/pom.xml` if dependency/plugin adjustments are required.
- `backend/mvnw`, `backend/mvnw.cmd`, `backend/.mvn/wrapper/*` only if Maven wrapper is explicitly added.
- `docs/CODEX_AUDIT_REPORT.md` or a follow-up verification log.
- No product code unless compilation defects force small fixes.

Dependencies:

- Java 21.
- Maven 3.9+ or Maven wrapper.
- Docker Desktop / Docker Compose if using containerized verification.
- PostgreSQL 16 via `docker-compose.yml`.

Acceptance Criteria:

- `java -version` confirms Java 21.
- `mvn -version` works, or `mvnw.cmd -version` works.
- `mvn test` executes and result is documented.
- `mvn package -DskipTests` executes and result is documented.
- PostgreSQL starts.
- Backend starts.
- Flyway migrations apply.
- `GET http://localhost:8080/api/v1/health` returns 200 OK.

Test Commands:

```powershell
java -version
mvn -version
mvn test
mvn package -DskipTests
docker compose up --build
```

Risks:

- Hidden compilation errors in entities/security code.
- Migration validation may fail once run against PostgreSQL.
- Port collision between frontend Vite config and backend default port 8080.

Estimated Complexity:

Medium

## PHASE 002 - Backend Authentication Completion

Objective:

Implement the documented backend auth contract using existing security foundations.

Scope:

- Add request/response DTOs for register, login, refresh, logout, me, change-password.
- Add `AuthController`.
- Add `AuthService`.
- Add `RefreshTokenRepository` and `RefreshTokenService`.
- Use existing `User`, `Role`, `UserRole`, `RefreshToken`, `JwtUtils`, `PasswordEncoder`.
- Preserve `DataInitializer`.
- Keep endpoint prefix aligned to `/api/v1/auth`.

Files affected:

- `backend/src/main/java/mz/gov/boaneconecta/auth/**`
- `backend/src/main/java/mz/gov/boaneconecta/users/repository/UserRepository.java`
- `backend/src/main/java/mz/gov/boaneconecta/roles/repository/*`
- `backend/src/main/java/mz/gov/boaneconecta/core/security/*`
- `backend/src/test/**`
- `docs/API_CONTRACT.md` if response shapes change.

Dependencies:

- PHASE 001 passing build loop.
- Confirmed role seed data.
- Decided role mapping strategy for frontend compatibility.

Acceptance Criteria:

- `POST /api/v1/auth/register` works for citizen registration.
- `POST /api/v1/auth/login` returns access and refresh tokens.
- `POST /api/v1/auth/refresh` rotates or validates refresh token according to selected policy.
- `POST /api/v1/auth/logout` revokes refresh token.
- `GET /api/v1/auth/me` returns current user/profile/roles.
- `POST /api/v1/auth/change-password` validates old password and updates hash.
- Passwords are BCrypt hashed.
- Auth tests cover success and failure cases.

Test Commands:

```powershell
mvn test
mvn package -DskipTests
```

Risks:

- Frontend currently expects Supabase role names.
- Refresh token storage policy must be chosen carefully.
- `JwtUtils` may need claims/role support without breaking existing filter behavior.

Estimated Complexity:

High

## PHASE 003 - Security Hardening and Cross-Cutting API Standards

Objective:

Make the Spring backend safe and predictable before expanding business endpoints.

Scope:

- Add CORS configuration using `app.frontend-url`.
- Add global exception handling.
- Add validation error response handling.
- Add authentication entry point/access denied responses.
- Add audit logging service/repository and write path for auth/security events.
- Enforce account status checks in `UserDetailsImpl`.
- Define RBAC annotation conventions.
- Define ownership validation helper pattern for citizen-owned resources.

Files affected:

- `backend/src/main/java/mz/gov/boaneconecta/core/config/**`
- `backend/src/main/java/mz/gov/boaneconecta/core/exception/**`
- `backend/src/main/java/mz/gov/boaneconecta/core/audit/**`
- `backend/src/main/java/mz/gov/boaneconecta/core/security/**`
- `backend/src/test/**`
- `docs/SECURITY.md`

Dependencies:

- PHASE 001 build baseline.
- Prefer PHASE 002 auth completion first, because audit events and entry points need real auth paths.

Acceptance Criteria:

- Browser-compatible CORS policy works for configured frontend origin.
- Unauthorized requests return consistent JSON.
- Forbidden requests return consistent JSON.
- Validation failures return consistent field errors.
- Login/logout/auth failures create audit events.
- Disabled/suspended users cannot authenticate.
- Security tests cover key paths.

Test Commands:

```powershell
mvn test
mvn package -DskipTests
```

Risks:

- Over-tight CORS may block local development.
- Authority naming must align with roles and frontend mapping.

Estimated Complexity:

Medium

## PHASE 004 - Repository, Service, and Controller Completion for Existing Backend Modules

Objective:

Turn the existing schema/entities into operational REST APIs incrementally, without changing the architecture.

Scope:

- Add repositories for existing entities.
- Add service layer for validated business operations.
- Add controllers module by module.
- Start with modules already needed by the frontend service layer.
- Preserve current Flyway schema unless a verified mismatch requires a migration.

Recommended order:

1. Public lookup modules: districts, departments, municipal services, news/projects if entity gap is resolved.
2. Citizen profile and citizen requests.
3. Documents/local file storage.
4. Admin users/services/requests/content.
5. Complaints, payments, appointments, notifications.

Files affected:

- `backend/src/main/java/mz/gov/boaneconecta/*/repository/**`
- `backend/src/main/java/mz/gov/boaneconecta/*/service/**`
- `backend/src/main/java/mz/gov/boaneconecta/*/controller/**`
- `backend/src/main/java/mz/gov/boaneconecta/*/dto/**`
- `backend/src/test/**`
- `docs/API_CONTRACT.md`

Dependencies:

- PHASE 001 build baseline.
- PHASE 002 auth for protected modules.
- PHASE 003 API/security standards.

Acceptance Criteria:

- Each implemented module has DTOs, service tests, controller tests or integration tests.
- Entities are not exposed directly in API responses unless explicitly accepted.
- RBAC is enforced on protected endpoints.
- Ownership checks exist for citizen-owned resources.
- API paths match `docs/API_CONTRACT.md` or docs are updated.

Test Commands:

```powershell
mvn test
mvn package -DskipTests
```

Risks:

- Existing frontend expects different table/resource names from Supabase.
- Content tables currently lack Java entities.
- Broad implementation in one pass would increase regression risk.

Estimated Complexity:

High

## PHASE 005 - Frontend Backend Integration Migration

Objective:

Move the frontend from direct Supabase access to the Spring API incrementally, preserving the existing UI.

Scope:

- Do not modify UI layout/design unless required by API state handling.
- Wire `Auth.tsx` and `useAuth` to backend auth through a compatibility layer.
- Normalize backend role names to frontend route guards.
- Replace direct Supabase reads/writes page by page with existing `src/services/*.service.ts` wrappers.
- Update environment variables.
- Retain Supabase code until replacement is verified and no longer referenced.

Files affected:

- `frontend/src/hooks/useAuth.tsx`
- `frontend/src/hooks/useUserRole.tsx`
- `frontend/src/services/*.service.ts`
- `frontend/src/lib/api.ts`
- `frontend/src/pages/**/*.tsx`
- `frontend/src/components/services/ServicePaymentDialog.tsx`
- `frontend/src/types/**`
- `.env.example`
- frontend README/docs

Dependencies:

- Backend auth endpoints implemented.
- Backend public/admin/citizen endpoints available for targeted page migration.
- Role mapping decision.

Acceptance Criteria:

- Login/register/logout/me use backend JWT API.
- Protected routes continue to work.
- Admin/citizen redirects use mapped backend roles.
- Migrated pages no longer import Supabase.
- Direct Supabase dependency list shrinks after each page migration.
- No UI redesign is introduced.

Test Commands:

```powershell
npm.cmd test
npm.cmd run build
```

Backend support commands:

```powershell
mvn test
mvn package -DskipTests
```

Risks:

- Current backend may not expose all data needed by existing pages.
- Supabase Edge Functions for payments require a replacement decision.
- Frontend and backend default port conflict must be resolved.

Estimated Complexity:

High

## PHASE 006 - Database Consistency, Performance, and Migration Validation

Objective:

Align Flyway schema, JPA entities, repositories, and real access patterns.

Scope:

- Decide whether to add Java entities for `news`, `notices`, `projects`, `tenders`, `gallery_items`, `faqs` or defer those tables.
- Add explicit indexes for foreign keys and frequent filters.
- Consider enum/status `CHECK` constraints where stable.
- Validate migrations on clean PostgreSQL.
- Keep migrations append-only; do not rewrite existing applied migration files unless repository history confirms they are not deployed.

Files affected:

- `backend/src/main/resources/db/migration/V8__*.sql` and later.
- `backend/src/main/java/mz/gov/boaneconecta/content/**`
- Entity/repository files only as needed.
- `docs/DATABASE.md`

Dependencies:

- PHASE 001 migration execution baseline.
- Module priority from PHASE 004.

Acceptance Criteria:

- Clean database migrates from V1 to latest successfully.
- Hibernate validation passes.
- Entity/table matrix is updated and all operational tables have intentional JPA coverage.
- Indexes exist for high-traffic foreign keys and filters.
- Database docs reflect verified schema.

Test Commands:

```powershell
mvn test
mvn package -DskipTests
docker compose up --build
```

Risks:

- Existing migrations may already be deployed somewhere; prefer additive migrations.
- Adding constraints before data cleanup may fail.

Estimated Complexity:

Medium

## PHASE 007 - Test Coverage and Documentation Synchronization

Objective:

Bring tests and docs into alignment with verified implementation.

Scope:

- Add backend unit/integration tests around auth, security, repositories, services, controllers.
- Add frontend tests for auth guard behavior and service adapters.
- Update docs to distinguish implemented, planned, and deprecated Supabase paths.
- Replace generic frontend README content with project-specific setup.
- Document local ports and environment variables.

Files affected:

- `backend/src/test/**`
- `frontend/src/**/*.test.tsx`
- `frontend/src/test/**`
- `README.md`
- `frontend/README.md`
- `docs/*.md`
- `.env.example`

Dependencies:

- PHASE 001 baseline.
- At least PHASE 002 auth completion.
- Optional: module-specific docs after PHASE 004/005.

Acceptance Criteria:

- Backend tests cover security/auth critical paths.
- Frontend tests cover protected/public route behavior.
- Root setup instructions match actual ports and env vars.
- API docs only claim implemented endpoints.
- Supabase migration status is documented honestly.

Test Commands:

```powershell
mvn test
npm.cmd test
npm.cmd run build
```

Risks:

- Docs can drift again if not updated with each implementation phase.
- Tests may need stable fixtures or test containers later; avoid adding heavy infrastructure unless required.

Estimated Complexity:

Medium

## Recommended Immediate Next Action

Do PHASE 001 only.

Reason:

The audit found a build stop condition: Maven and Java are unavailable in the current shell, and no Maven wrapper exists. Implementation should not proceed until the repository can be compiled, tested, packaged, and started from a known baseline.
