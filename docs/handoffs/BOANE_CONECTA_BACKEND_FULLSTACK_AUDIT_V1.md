# BOANE CONECTA — Backend / Database / Fullstack Readiness Audit V1

**Data da auditoria:** 2026-09-04  
**Modo:** auditoria read-only; nenhuma implementação, migration, alteração de configuração, commit, merge ou push  
**Resultado global:** **PARTIAL / NOT READY FOR UNCONTROLLED BACKEND DEVELOPMENT**  
**Base de evidência:** Git remoto, árvore local, código Java/TypeScript, migrations SQL, testes, Docker, CI e handoffs existentes.

> Regra de leitura: **OBSERVED** significa comprovado no código ou Git; **DOCUMENTED** significa descrito num documento e sujeito a reconfirmação; **UNKNOWN** significa que a evidência não estava acessível; **RECOMMENDATION — NOT CURRENT STATE** não descreve implementação existente.

## 1. Executive Summary

O candidato canónico fullstack e backend é `rightware-corporations/boane-conecta-fullstack-app`. O Git remoto é publicamente clonável e a sua branch publicada mais avançada observada é `feat/fullstack-f5-appointments-queue`, em `378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0`. Essa branch está 286 commits à frente de `master` e contém frontend React/Vite, backend Java 21/Spring Boot, PostgreSQL/Flyway, Docker Compose e documentação.

A cópia de trabalho auditada está na mesma branch nominal, mas no commit local `88e4d852f374169e41b778d21a4076322f5062fb` e possui alterações frontend recuperadas ainda não publicadas. Portanto há duas verdades que não devem ser confundidas:

- **verdade remota reproduzível:** F5 em `378fc31a`;
- **verdade local funcional mais recente:** `88e4d852` + working tree sujo com Baseline V2/Blocos 01–11.

O backend não é um stub. Possui autenticação, catálogo municipal, pedidos dinâmicos, documentos seguros, reclamações, pagamentos, marcações, filas, notificações e relatórios. A base de dados tem 19 migrations ordenadas e constraints importantes. Contudo, a prontidão fullstack é limitada por contratos frontend/backend incompatíveis, ausência de uma matriz RBAC autoritativa, falta de utilizadores de teste para todas as roles, CI incompleto para branches atuais, e ausência de execução backend/PostgreSQL no ambiente desta auditoria.

**Decisão recomendada:** preservar/publicar primeiro a Baseline V2 de forma controlada; depois executar um bloco de ambiente reprodutível e prova PostgreSQL antes de desenvolver domínios novos.

## 2. Repository Authority

### 2.1 Repository audit

| Repositório | Visibilidade | Default/HEAD | HEAD SHA | Branches relevantes | Estrutura observada | Conclusão |
|---|---|---|---|---|---|---|
| `rightware-corporations/boane-conecta-fullstack-app` | Publicamente clonável; campo API de visibilidade não obtido | `master` | `4ff50eb6359328589eea6be2cf3e4b72b1a70364` | `feat/frontend-v2-foundation`, `feat/backend-f3-request-foundation`, `feat/fullstack-f4-citizen-portal`, `feat/fullstack-f5-appointments-queue` | `frontend/`, `backend/`, `docs/`, `.github/`, Compose, env example | **CANONICAL CANDIDATE — HIGH** |
| `rightware-corporations/boane-conecta` | **UNKNOWN**; acesso anónimo não confirmado | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | **OPEN DECISION**; não usar sem nova verificação autenticada |
| `miltonmarino-rightware/boane-conecta-fullstack` | Legacy remote na cópia local | UNKNOWN nesta auditoria | baseline histórico conhecido | legacy | baseline recuperada antiga | Não canónico para novo desenvolvimento |

Open PRs não foram verificáveis porque `gh`/API autenticada não estavam disponíveis. Isto permanece **UNKNOWN**.

### 2.2 Branches remotas verificadas

| Branch | SHA | Último commit observado | Data |
|---|---|---|---|
| `master` | `4ff50eb6359328589eea6be2cf3e4b72b1a70364` | Fix test profile bootstrap admin password | 2026-08-14 |
| `engineer/gh-audit-and-stabilization` | `e9b902cc4b6eb62775b3e1905dbdb7c63d4afffc` | pin Lombok for Java 21 | 2026-08-12 |
| `feat/frontend-v2-foundation` | `17029bcb82ae3788e360794c681f930af8cae813` | document F2 implementation and QA | 2026-08-27 |
| `feat/backend-f3-request-foundation` | `52e44fed15d90305c193c0b2c857efed56cfe21a` | normalize F3 handoff | 2026-08-28 |
| `feat/fullstack-f4-citizen-portal` | `c4d590a6c349b90ec01d8e5342aadadf1f3abfa9` | update citizen types | 2026-08-28 |
| `feat/fullstack-f5-appointments-queue` | `378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0` | scope appointment agenda access | 2026-08-29 |

**CANONICAL FULLSTACK CANDIDATE:** `rightware-corporations/boane-conecta-fullstack-app`  
**CANONICAL BACKEND CANDIDATE:** idem, `backend/`  
**ACTIVE PUBLISHED DEVELOPMENT BRANCH:** `feat/fullstack-f5-appointments-queue` @ `378fc31a`  
**MOST ADVANCED LOCAL STATE:** mesma branch nominal @ `88e4d852` + alterações não committed  
**CONFIDENCE:** HIGH para o candidato fullstack; MEDIUM para autoridade final enquanto o segundo repo e PRs permanecerem UNKNOWN.

## 3. Branch / HEAD Evidence

### 3.1 Estado local auditado

| Campo | Evidência |
|---|---|
| Caminho | `/workspace/scratch/4da30144c903/usb-codebase/repo` |
| Origin | `https://github.com/rightware-corporations/boane-conecta-fullstack-app.git` |
| Branch | `feat/fullstack-f5-appointments-queue` |
| HEAD committed local | `88e4d852f374169e41b778d21a4076322f5062fb` |
| Remote F5 | `378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0` |
| Working tree | **DIRTY**: 8 tracked frontend files modificados e múltiplos ficheiros frontend/docs untracked |
| Backend local delta | Nenhuma alteração acumulada dos Blocos 01–11 observada |
| Default divergence | remote F5 está `0 behind / 286 ahead` de `master` |

As alterações locais incluem `InternalShell`, contratos Admin Services, testes, relatórios dos Blocos 01–11 e manifestos de reconstrução. Não podem ser descartadas nem confundidas com o remoto.

### 3.2 Recent F5 history

`378fc31 fix(backend): scope appointment agenda access` → `73a275a fix(backend): normalize appointment availability location` → `1c4ca27 feat(frontend): manage scoped queue operators` → `fd9496b feat(backend): enforce explicit queue staff scopes` → `0e0a53a refactor(backend): remove legacy appointment mutations`.

## 4. Current Architecture

| Área | Estado | Evidência |
|---|---|---|
| Frontend web | PRESENT | `frontend/`, React/Vite/TypeScript |
| Backend | PRESENT | `backend/pom.xml`, Spring Boot 3.3.1/Java 21 |
| Mobile app | ABSENT | apenas `docs/mobile/`; sem código React Native na raiz |
| PostgreSQL | PRESENT in architecture | Compose `postgres:16`, JDBC/PostgreSQL driver |
| Migrations | PRESENT | Flyway V1–V19 |
| Object storage | PRESENT | S3 SDK + MinIO no Compose |
| Malware scanning | PRESENT | ClamAV + `DocumentScanWorker` |
| CI | PARTIAL | apenas `.github/workflows/backend-quality.yml` |
| Frontend container | ABSENT | sem Dockerfile frontend |
| Deployment config | PARTIAL | `backend/RAILWAY_DEPLOYMENT.md`, profile prod; sem pipeline integral |
| Legacy Supabase | PRESENT/STALE | `frontend/supabase/` migrations/functions ainda no repo |

Arquitectura observada: SPA React → REST `/api/v1` → Spring Security/JWT → services/repositories JPA → PostgreSQL; ficheiros passam por quarentena S3/MinIO e scanner ClamAV. Workers processam scanning, retenção de drafts e outbox.

## 5. Frontend State

- React + Vite + TypeScript + TanStack Query; 41 rotas wired no audit funcional anterior.
- A Baseline V2 local adiciona `InternalShell`, navegação interna e Admin Services read-only para Gestor.
- Tokens JWT e refresh são guardados em `localStorage` (`frontend/src/lib/api.ts`).
- Há clientes REST reais para catálogo, cidadão, marcações e filas.
- Permanecem clientes legacy/speculativos, conteúdo estático, Supabase residual e ações simuladas.
- `frontend/vite.config.ts` usa porta 8080 enquanto o backend também usa 8080; CORS/backend espera por defeito `http://localhost:5173`.
- Gates mais recentes do frontend: lint PASS; TypeScript PASS; 23 ficheiros/76 testes PASS; build PASS; diff-check PASS.

## 6. Backend State

### 6.1 Backend stack — observed

| Componente | Observado |
|---|---|
| Linguagem/runtime | Java 21 (`backend/pom.xml`) |
| Framework | Spring Boot 3.3.1 |
| Build | Maven; sem Maven Wrapper |
| REST | Spring MVC/Web |
| Persistência | Spring Data JPA/Hibernate |
| DB | PostgreSQL; H2 apenas em profile de testes |
| Migration | Flyway + módulo PostgreSQL |
| Security | Spring Security, stateless bearer JWT, method security |
| Tokens | JJWT 0.11.5; access + refresh persistido/hashed/rotacionado/revogado |
| Passwords | BCrypt |
| Validation | Jakarta Bean Validation |
| Error format | `ApiResponse<T>` + `GlobalExceptionHandler`/field errors |
| Observability | Actuator health/info/prometheus; correlation ID filter |
| Storage | AWS SDK S3; MinIO local |
| File safety | assinatura de ficheiro, quarentena, ClamAV, scan worker |
| Workers | document scan, draft retention, outbox dispatch |

### 6.2 Functional inventory

| Domínio | Estado | Evidência principal |
|---|---|---|
| Auth/session | IMPLEMENTED | `AuthController`, `AuthService`, `RefreshTokenService` |
| Departments/districts | IMPLEMENTED | public/admin controllers + repositories |
| Municipal services | IMPLEMENTED | public/admin CRUD, requirements, fees |
| Versioned request definitions | IMPLEMENTED | F3 forms package, V9 |
| Citizen request drafts/submission | IMPLEMENTED backend-only/partial frontend | draft controllers/services, idempotency/outbox, V10–V12 |
| Documents | IMPLEMENTED | versioning, upload, scan, ownership paths |
| Complaints | IMPLEMENTED backend; frontend contract broken | public/citizen/admin controllers |
| Payments | IMPLEMENTED backend; frontend contract broken | citizen/admin controllers |
| Appointments | IMPLEMENTED | holds, availability, confirmation, lifecycle/check-in |
| Queues | IMPLEMENTED | configuration, scopes, operations, projections |
| Notifications | IMPLEMENTED | citizen read/update, admin create/list |
| Reports | IMPLEMENTED backend, no executive frontend | `AdminReportController` |
| News/notices/projects/tenders/gallery/FAQ | DATABASE-ONLY | V6 tables; no corresponding controllers/services |
| Licences | ABSENT backend | frontend-only |
| User administration | ABSENT | auth/user repositories exist; no admin user API |
| Contact/donations/taxes | FRONTEND-ONLY | no matching Spring controllers |

Inventário físico observado: 33 controller classes, 68 service-named classes, 37 repositories, security config/filter/handlers e 25 test/support Java files.

## 7. Database State

PostgreSQL 16 é o alvo. O schema é governado por Flyway; Hibernate usa `ddl-auto=validate` em runtime normal/prod. O profile `test` usa H2 PostgreSQL mode, `create-drop` e Flyway desativado.

### 7.1 Database entity matrix

| Entidade/tabelas | Propósito/FKs importantes | Constraints/estado | API/front/test |
|---|---|---|---|
| users, roles, permissions, user_roles, role_permissions | identidade e RBAC | UUID, email único, relações N:N | auth usa; UI usa roles; testes auth |
| refresh_tokens, audit_logs | sessão e auditoria | hash/expiry/revocation | auth usa; testes security |
| districts, departments, citizen_profiles | estrutura/munícipe | slugs e FKs a users | public/admin/citizen; testes parciais |
| municipal_services, service_requirements, service_fees | catálogo | slugs/status/FKs | public/admin + frontend real |
| municipal_service_versions, service_form_definitions/versions | definição versionada | status/version/JSONB | APIs F3; frontend create ausente |
| documents, document_versions | anexos seguros | owner/status/classification/storage | citizen/admin; testes documento |
| citizen_requests, request_status_history, request_documents | processo municipal | ownership/status/FKs | APIs; frontend leitura parcial |
| request_drafts, draft_documents | composição dinâmica | version/expiry/ownership | backend real; frontend missing |
| request_answer_snapshots, idempotency_records, domain_outbox_events | submissão atómica | unique/idempotency/state | backend real; testes F3 |
| complaints, complaint_status_history | reclamações | complaint number/status/assignment | APIs; frontend DTO incompatível |
| payments, receipts | pagamentos | status/reference/request FK | APIs; frontend endpoint/DTO incompatíveis |
| appointment_slots, holds, appointments, schedule_rules | agenda | capacity/status/version/unique slots | fullstack F5; testes amplos |
| municipal_queues, queue_desks, queue_tickets, service_sessions | filas | state machines/version/sequence | fullstack F5; testes unit/integration |
| queue_events, queue_staff_scopes | auditoria/escopo operador | FKs e uniqueness | admin queue; testes scope |
| notifications | mensagens do sistema | recipient/read/context | citizen/admin APIs |
| news, notices, projects, tenders, gallery_items, faqs | conteúdo | tabelas em V6 | sem backend/API; frontend estático/especulativo |

Não há política transversal de soft delete: catálogo usa estados; várias relações filhas são hard-delete. Timestamps/audit fields existem de forma desigual por domínio.

## 8. Migrations

| Migration | Objectivo | Risco/reversibilidade | Evidência de teste |
|---|---|---|---|
| V1 | extensões PostgreSQL | LOW; depende de privilégios | `PostgresMigrationTest` intended |
| V2 | auth/users/RBAC/audit | HIGH; fundacional | integração auth; PostgreSQL não executado aqui |
| V3 | estrutura institucional/citizen | MEDIUM | H2/service tests parciais |
| V4 | serviços/pedidos/documentos | HIGH | integrações de negócio |
| V5 | complaints/payments/appointments | HIGH | integrações dedicadas |
| V6 | content/notifications | MEDIUM | notifications; conteúdo sem API |
| V7 | seed roles/departments/districts | MEDIUM; dados operacionais | startup/bootstrap indirect |
| V8 | índices refresh token | LOW | auth tests |
| V9 | definitions versionadas | HIGH; JSONB/versionamento | F3 tests |
| V10 | request drafts | MEDIUM | dynamic request tests |
| V11 | versões seguras de documentos/backfill | **HIGH**; transformação e alteração de coluna | Postgres required |
| V12 | submission/idempotency/outbox | HIGH; atomicidade | service tests; Postgres required |
| V13 | contexto notificações | LOW–MEDIUM | notification tests |
| V14 | holds/check-in/queue | **HIGH**; migration extensa/multi-domínio | F5 tests + Postgres required |
| V15 | audit lifecycle appointment | MEDIUM | appointment tests |
| V16 | check-in seguro/queue sequence | HIGH; altera invariantes/constraint | concurrency test intended |
| V17 | queue operations/events | MEDIUM–HIGH | queue tests |
| V18 | queue invariants | MEDIUM; constraints sobre dados existentes | Postgres required |
| V19 | queue staff scopes | MEDIUM | scope/service tests |

As migrations são forward-only; não existem down migrations. **BLOCKER de confiança, não de código:** V1–V19 não foram executadas contra PostgreSQL real nesta sandbox. `PostgresMigrationTest` e `F5PostgresConcurrencyTest` dependem de Testcontainers/Docker.

## 9. Authentication

| Capacidade | Estado |
|---|---|
| Login | IMPLEMENTED `POST /api/v1/auth/login` |
| Registration citizen | IMPLEMENTED `POST /api/v1/auth/register` |
| Password hashing | BCrypt |
| Access JWT | IMPLEMENTED; default 900s |
| Refresh token | IMPLEMENTED; default 7 days; hash persistido e rotação |
| Logout/revocation | IMPLEMENTED |
| Current user | IMPLEMENTED `/auth/me` |
| Change password | IMPLEMENTED; revoga sessões |
| Password reset/recovery | ABSENT |
| Email/phone verification | ABSENT |
| Brute-force/rate limiting | ABSENT |
| Lockout policy | entidade suporta status/locked check; política automatizada não comprovada |
| CORS | origem única configurável, credentials=true |
| CSRF | disabled; coerente com bearer stateless, mas token em localStorage aumenta impacto XSS |
| Security headers | defaults Spring; política explícita não encontrada |
| Test identities | SUPER_ADMIN bootstrap + CITIZEN registration apenas |

O `AdminBootstrap` cria `admin@boane.gov.mz` com `ADMIN_BOOTSTRAP_PASSWORD`; localmente há default fraco `ChangeMe123!`, acompanhado de warning. Produção exige variável sem default no profile prod. README ainda publica credenciais de desenvolvimento.

## 10. RBAC / Permissions

Roles reais: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `EDITOR`, `EMPLOYEE`, `CITIZEN`. Mapeamento frontend: manager→`gestor`, employee→`funcionario`, citizen→`municipe`.

| Role | Login | Área/API observada | Poderes confirmados | Limites/gaps |
|---|---|---|---|---|
| SUPER_ADMIN | Sim | admin | todos os métodos role-protected observados; bootstrap | gestão de utilizadores não existe |
| ADMIN | Sim | admin | catálogo, departamentos/distritos, schedules, queues, operações | matriz permission-table não é autoridade efetiva |
| MANAGER | Sim | admin/internal | leitura/gestão em complaints/payments; agenda/queue scoped; Services read na Baseline V2 | fixture/assignment ausente; alguns scopes dependem de domínio |
| EDITOR | Sim | admin filter genérico | acesso global `/admin/**` passa filtro, mas controllers limitam | conteúdo editorial backend ausente; landing/links podem divergir |
| EMPLOYEE | Sim | admin operations | agenda/queues/reclamações/pagamentos conforme annotations/scopes | assignment/test user ausente |
| CITIZEN | Sim | citizen | recursos próprios: perfil, pedidos, documentos, appointments, complaints, payments, notifications | frontend permite admin/SA em algumas rotas, backend não |

O schema contém permissions e role_permissions, mas a aplicação usa predominantemente `hasRole/hasAnyRole` em `SecurityConfig` e `@PreAuthorize`. O frontend também possui metadata/capabilities. Isto é **CG-001 OPEN**: não existe matriz única e autoritativa. Não se deve inventar uma no frontend.

**RECOMMENDED / MISSING — NOT IMPLEMENTED:** workflow formal para criar/atribuir roles internas; política de scopes organizacionais; permissão-resource/action autoritativa; testes negativos completos por role e ownership.

## 11. API Inventory

Todas as respostas de negócio usam maioritariamente `ApiResponse<T>`. Inventário por família (paths reais):

| Família | Endpoints reais principais | Auth/roles | Persistência/testes |
|---|---|---|---|
| Health | `GET /api/v1/health` | public | health |
| Auth | `POST auth/register`, `login`, `refresh`, `logout`, `change-password`; `GET auth/me` | 3 públicos; restantes auth | users/roles/refresh; security integration |
| Public institutional | `GET public/departments[/slug]`, `districts[/slug]`, `services[/slug]` | public | catálogo; business tests |
| Admin institutional | CRUD `admin/departments`, `districts`, `services`; nested requirements/fees | SA/Admin; Services read local widened to Manager only in Baseline V2 frontend | DB real; service tests |
| Request definitions | admin create/publish/read versions; citizen read active definition | admin vs citizen | V9; F3 tests |
| Drafts/submission | citizen create/get/save eligibility/save answers/validate/attach docs; submit idempotently | CITIZEN + owner | V10–V12; request tests |
| Citizen requests | list/detail/status timeline | CITIZEN + owner | citizen_requests; integration |
| Documents | citizen upload/list/get/download/delete and admin review/download variants | owner/admin methods | V4/V11; document tests |
| Complaints | public/citizen create; citizen list/detail; admin list/detail/assign/status | public/CITIZEN/internal | V5; complaint tests |
| Payments | citizen create/list/detail; admin list/detail/status | CITIZEN/internal | V5; payment tests |
| Appointments | availability/list/detail/cancel/reschedule/check-in; hold/create/confirm | CITIZEN/owner | V5/V14–V16; extensive tests |
| Admin agenda | list/detail/check-in; schedule rules CRUD/status; materialize slots | SA/Admin/Manager/Employee depending operation | F5 tests |
| Queue config | list/get/create/update/status/desks/staff scopes/options | SA/Admin | V14–V19; queue tests |
| Queue operations | snapshots/open/close/call/recall/start/complete/no-show/transfer | internal + staff scope | queue state; unit/concurrency |
| Queue projection | public display; citizen ticket detail | public/CITIZEN owner | queue tables |
| Notifications | citizen list/count/read/read-all; admin create/list | CITIZEN/internal | V6/V13; tests |
| Reports | admin summary/operational endpoints | internal annotations | aggregate reads; report tests |

Status codes detalhados não são consistentemente declarados via `ResponseEntity`; muitos controllers devolvem 200 envelopes inclusive create/update. Exceptions globais determinam 400/401/403/404/409. Esta semântica deve ser formalizada num contrato/OpenAPI futuro.

### Missing APIs required by current frontend

- public request lookup contract real;
- licences;
- contact messages;
- donations/funds/taxes flows;
- content CRUD/public APIs for news/projects/notices/tenders/gallery/FAQ;
- admin user/role management;
- frontend’s legacy `/admin/service-requests` contract;
- frontend’s `/payments/initiate` contract (ou remoção/alinhamento do cliente).

## 12. Frontend Contract Matrix

| Feature/screen | Frontend action | Actual/expected endpoint | Backend/DB | Gap |
|---|---|---|---|---|
| Auth | login/register/refresh/logout/me | `/auth/*` | real/real | mostly aligned; demo credentials unsafe/stale |
| Public services | browse/detail/search | `GET /public/services` | real/real | aligned |
| Admin Services | list | `GET /admin/services` | real/real | Baseline V2 adapter aligned; Manager authorization needs backend verification |
| Citizen dashboard/profile | read/update | `/citizen/dashboard`, `/citizen/me` | real/real | generally aligned |
| Citizen requests list/detail | read | `/citizen/requests` | real/real | partial presentation |
| New citizen request | guided create/submit | definitions + drafts + submit APIs | backend real/DB real | **frontend missing** |
| Public request lookup | simulated lookup | no used real endpoint | absent/unknown | **hardcoded mock + delay** |
| Complaints | submit public form | `/public/complaints` | backend real/DB real | request fields mismatch; response `reference` vs `complaintNumber` |
| Payments | initiate/list/detail | frontend legacy/snake_case; `/payments/initiate` | backend uses `POST /citizen/payments` | endpoint + DTO mismatch |
| Appointments | availability/hold/confirm/manage/check-in | citizen appointment/hold APIs | real/real | F5 mostly aligned |
| Queue admin/display | config/operate/display | `/admin/queues*`, public display | real/real | mostly aligned; scope tests important |
| Admin requests | placeholder/legacy client | frontend `/admin/service-requests` | backend `/admin/requests` | path/model mismatch |
| Reports/executive | no wired executive UI | admin reports backend | real DB aggregate | backend-only |
| News/projects/notices | static/speculative | no Spring content API | tables only | frontend and DB without backend service |
| Users | placeholder/speculative | `/admin/users` | absent | missing backend |
| Licences | UI | none | absent | frontend-only |
| Contact | submit | `/contact/messages` expected | absent | frontend-only |
| Donations | simulated delay | none | absent | frontend-only |

## 13. Business Flows

| Fluxo | Estado | Evidência/gap |
|---|---|---|
| Register citizen → login/refresh/logout | COMPLETE backend, partial production controls | AuthService/RefreshTokenService; no verification/reset/rate limit |
| Browse municipal service | COMPLETE | public API + frontend catalog + DB |
| Define versioned service form | BACKEND-ONLY | admin definition API/V9; UI absent |
| Citizen creates draft → answers → validates → submits idempotently | BACKEND-ONLY/PARTIAL | robust F3 backend; guided frontend absent |
| Citizen views own requests | PARTIAL fullstack | real API/ownership; presentation partial |
| Upload → quarantine → scan → trusted/rejected | IMPLEMENTED backend; runtime unverified | S3/MinIO/ClamAV workers |
| Public complaint submit | BROKEN contract | frontend/backend DTO mismatch |
| Payment initiation/tracking | BROKEN contract | wrong frontend endpoint/DTO; no external payment provider proof |
| Appointment availability → hold → confirm → check-in | COMPLETE in code | F5 controllers/state machines/tests; runtime PostgreSQL pending |
| Queue configure → assign scoped operator → serve ticket | COMPLETE in code | V14–V19 + services/tests; concurrency runtime pending |
| Content authoring/publishing | FRONTEND/DB FRAGMENTS | no Spring domain/API |
| Admin user/role provisioning | ABSENT | only bootstrap/register paths |

## 14. Test Inventory

| Tipo | Inventário/resultado |
|---|---|
| Frontend unit/component | 23 files / 76 tests; **PASS** na execução anterior desta mesma árvore |
| Backend integration | Auth, BusinessModules, CitizenRequests, Complaints, Documents, Notifications, Payments, Reports, Appointments |
| Backend unit/domain | appointment services, queues, citizen profile, file signature, dynamic request rules |
| Migration PostgreSQL | `PostgresMigrationTest` via Testcontainers |
| Concurrency PostgreSQL | `F5PostgresConcurrencyTest` via Testcontainers |
| H2 | profile test, PostgreSQL mode, Flyway disabled |
| Contract tests | alguns clients frontend; sem schema/OpenAPI consumer-driven formal |
| E2E/browser | ABSENT |

### Gates executados/estado

| Comando | Estado | Nota |
|---|---|---|
| `npm run lint` | PASS | frontend |
| `npx tsc -p tsconfig.app.json --noEmit` | PASS | frontend |
| `npm run test` | PASS | 76/76 |
| `npm run build` | PASS | 2242 modules na execução registada |
| `git diff --check` | PASS | working delta |
| `mvn verify` | **NOT RUN / BLOCKED** | ambiente tinha JDK 17, Maven ausente; projecto requer Java 21 |
| Testcontainers/PostgreSQL | **NOT RUN / BLOCKED** | Docker/Podman ausente na sandbox |

## 15. Docker / Environment

Compose inclui PostgreSQL 16, MinIO, ClamAV e backend. PostgreSQL tem healthcheck; backend espera Postgres healthy, mas MinIO/ClamAV apenas started. Há volumes persistentes de DB/MinIO e bind `./storage`. Não há frontend container, network explícita ou restart policy.

| Porta | Serviço | Risco |
|---|---|---|
| 5432 | PostgreSQL | conflito se workstation já usa Postgres |
| 8080 | backend | **conflita com Vite tracked em 8080** |
| 9000/9001 | MinIO API/console | verificar serviços locais |
| 3310 | ClamAV | verificar serviço local |

Variáveis relevantes (nomes apenas): `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `JDBC_DATABASE_URL`, `JDBC_DATABASE_USERNAME`, `JDBC_DATABASE_PASSWORD`, `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `JWT_SECRET`, `JWT_ACCESS_EXPIRATION`, `JWT_REFRESH_EXPIRATION`, `ADMIN_BOOTSTRAP_PASSWORD`, `FRONTEND_URL`, `BACKEND_PORT`, `PORT`, `JAVA_OPTS`, `STORAGE_ROOT`, `OBJECT_STORAGE_ENDPOINT`, `OBJECT_STORAGE_REGION`, `OBJECT_STORAGE_ACCESS_KEY`, `OBJECT_STORAGE_SECRET_KEY`, `OBJECT_STORAGE_QUARANTINE_BUCKET`, `OBJECT_STORAGE_TRUSTED_BUCKET`, `SCANNER_HOST`, `SCANNER_PORT`, `SCANNER_TIMEOUT_MILLIS`, `SCANNER_POLL_DELAY_MILLIS`, `REQUEST_DRAFT_TTL_DAYS`, appointment timing variables e `VITE_API_BASE_URL`.

Defaults locais incluem passwords/JWT/MinIO previsíveis. São aceitáveis apenas num ambiente dev isolado, nunca produção. Nenhum segredo real foi reproduzido; **SECRET EXPOSURE SUSPECTED: NO evidence**, mas deve haver scan automatizado antes de publicação.

## 16. Security Findings

| Severidade | Finding | Evidência/impacto |
|---|---|---|
| HIGH | RBAC fragmentado sem matriz autoritativa | permissions DB + role annotations + frontend metadata podem divergir |
| HIGH | Ausência de rate limiting/brute-force defense | endpoints login/register/refresh públicos |
| HIGH | Refresh/access tokens em localStorage | XSS pode exfiltrar sessão |
| HIGH | Fluxos/fixtures para roles internas ausentes | impossível provar least privilege end-to-end |
| HIGH | PostgreSQL migrations/concurrency não executados neste ambiente | invariantes F3/F5 sem prova runtime atual |
| MEDIUM | Default dev credentials/secrets previsíveis | `application.yml`, Compose, README; risco de uso fora de dev |
| MEDIUM | CORS single origin + credentials; configuração pode falhar por porta | `SecurityConfig`, default 5173 vs Vite 8080 |
| MEDIUM | Security headers não explicitamente endurecidos | defaults apenas; CSP/HSTS deployment não comprovados |
| MEDIUM | File upload runtime chain não validada | bom desenho, mas MinIO/ClamAV não testados aqui |
| MEDIUM | Legacy Supabase/payment functions coexistem | superfície e confusão operacional |
| MEDIUM | Potential BOLA/IDOR requires systematic negative tests | ownership existe em vários services, mas cobertura transversal incompleta |
| LOW | Exception filter oculta detalhe de JWT em debug | correto para cliente; garantir observabilidade segura |
| INFO | JPA reduz SQL injection direta | manter parâmetros/repositories; não elimina authorization risks |

Não foi observado mass assignment evidente nos DTOs record/validated, mas é necessária revisão endpoint por endpoint antes de produção.

## 17. CI/CD / Deployment

`backend-quality.yml` instala Temurin 21 e executa `mvn verify`, porém push triggers só incluem `master` e `feat/backend-f3-request-foundation`; a branch F5 não está listada. PRs com backend acionam o workflow. Não existe workflow frontend/fullstack/E2E nem publicação/deployment integral.

Backend Dockerfile faz multi-stage Maven/Temurin 21 e executa jar. Profile prod usa env obrigatórias para JWT, bootstrap, storage/scanner e frontend URL. `backend/RAILWAY_DEPLOYMENT.md` existe, mas Railway runtime real, migrations-on-deploy e rollback não foram observados.

**CURRENTLY DEPLOYABLE? PARTIAL.** O backend é containerizável, mas não há prova desta revisão com PostgreSQL/MinIO/ClamAV, frontend container, smoke test pós-deploy, backup/restore, rollback ou secrets managed.

## 18. Test User Matrix

Não criar estas contas agora. Credenciais devem existir apenas em fixtures dev/test via environment, nunca hardcoded em produção.

| Persona ID proposto | Role real | Dados/relacionamentos | Permitir | Negar/provar |
|---|---|---|---|---|
| `test.superadmin` | SUPER_ADMIN | user active + role | config institucional/queue/schedules | citizen ownership bypass não implícito |
| `test.admin` | ADMIN | active + department opcional | admin CRUD e operations autorizadas | ações exclusivas SA se surgirem |
| `test.manager` | MANAGER | department + queue scopes | reads/assign/status permitidos; Services read | queue fora do scope; admin config proibido |
| `test.editor` | EDITOR | department editorial | apenas capabilities realmente existentes | Services/queue/citizen APIs indevidas |
| `test.employee.a` | EMPLOYEE | department + queue A scope | agenda/queue A operations | queue B, config, user management |
| `test.employee.b` | EMPLOYEE | different scope | cross-scope denial | recursos A |
| `test.citizen.a` | CITIZEN | profile/district/own records | own drafts/docs/requests/payments/appointments | citizen B resources e admin |
| `test.citizen.b` | CITIZEN | independent ownership | own resources | citizen A resources |
| `test.locked` | qualquer test role | account locked/inactive | nenhum login | login/session refresh |

Actualmente só há caminhos suportados para SUPER_ADMIN bootstrap e CITIZEN registration. ADMIN/MANAGER/EDITOR/EMPLOYEE precisam de fixture/provisionamento controlado.

## 19. Test Dataset Matrix

| Dataset | Mínimo | Edge/status variants | Relações/teste |
|---|---:|---|---|
| roles/users/profiles | 9 personas acima | active/inactive/locked/duplicate email | cross-role/cross-owner |
| departments/districts | 2–3 cada | active/inactive, slug duplicate | scopes e catálogo |
| services/requirements/fees | 4 services | draft/published/archived; free/fee; long text | departments/forms |
| definitions/form versions | 2 services × versions | draft/published/retired; invalid schema | version pinning |
| request drafts | 6 | empty/incomplete/valid/expired/conflict | each citizen/service |
| submitted requests/history | 8 | lifecycle variants, duplicate idempotency | ownership/assignment |
| documents/versions | 8 | clean/infected/invalid signature/oversize | request/draft owners |
| complaints | 6 | public/citizen, priorities/status/assigned | response contract |
| payments/receipts | 6 | pending/paid/failed/refunded/duplicate | request/citizen |
| schedules/slots/holds/appointments | 10+ | full capacity/expired hold/cancel cutoff/no-show | concurrent confirmation |
| queues/desks/scopes/tickets/sessions | 2 queues | open/paused/closed; priority; transfer/no-show | staff scope and sequencing |
| notifications | 6 | unread/read/context missing | owner only |
| content tables | 0 until API decision | no fake content | content domain is not implemented |

Cada conjunto deve cobrir happy/empty/error/401/403/404/409/invalid/duplicate/concurrency/long/boundary/restart persistence.

## 20. Gap Analysis

| Feature | Frontend | Backend | DB | Auth/RBAC | Tests | Status/severity | Próximo trabalho |
|---|---|---|---|---|---|---|---|
| Source authority | local unpublished | remote F5 | n/a | n/a | hashes/reports | **P0** | preserve + controlled publication |
| Local runtime | buildable | not run here | not run | identities incomplete | frontend only run | **P0** | reproducible environment |
| Migrations | n/a | Flyway configured | V1–V19 | n/a | TC tests not run | **P0/P1** | real Postgres gate |
| Auth | wired | robust core | real | controls incomplete | integration exists | P1/P2 | fixtures + hardening |
| RBAC | local metadata | annotations | permission tables | divergent | partial | **P1** | canonical matrix and negative tests |
| Citizen request creation | missing | advanced | advanced | owner rules | backend tests | **P1** | guided frontend integration |
| Complaints | form | real | real | mixed public/citizen | tests | **P1 broken** | align DTO/response |
| Payments | legacy mismatch | real | real | citizen/internal | tests | **P1 broken** | decide contract/provider and align |
| Appointments | real | real | real | role/owner | strong | P1 runtime proof | Postgres/E2E |
| Queues | real | real | real | scope-sensitive | strong | P1 runtime proof | concurrency/E2E |
| Content | static/speculative | absent | tables only | Editor unclear | absent | P2 | product/API decision |
| Admin users | placeholder | absent | users/roles exist | critical | absent | P1/P2 | controlled provisioning design |
| Deployment | SPA separate | container | Postgres/MinIO | env secrets | CI partial | **P2** | integrated deploy pipeline |

## 21. Backend Readiness Scores

| Dimensão | Score | Fundamentação |
|---|---:|---|
| Backend implementation | **72/100** | muitos domínios reais/state machines; faltam content/users/licences/contact e runtime atual |
| Database maturity | **78/100** | 19 migrations, constraints/versioning/idempotency; PostgreSQL gate não executado e rollback ausente |
| Authentication | **70/100** | BCrypt/JWT/rotation/revocation; sem reset/verification/rate limit e defaults dev perigosos |
| RBAC | **55/100** | roles e method guards reais; autoridade fragmentada, fixtures/scopes e negative tests incompletos |
| API completeness | **62/100** | boa cobertura municipal core/F3/F5; vários ecrãs não têm API e sem contrato formal/OpenAPI |
| Frontend/backend integration | **48/100** | catálogo/F4/F5 reais; complaints/payments/requests/content/admin users têm gaps fortes |
| Automated testing | **60/100** | 76 frontend tests e suite Java significativa; backend não executado aqui, sem E2E/contract suite formal |
| Security | **58/100** | boas bases JWT/ownership/file quarantine; sem rate limit, tokens localStorage, RBAC/operational proof incompletos |
| Docker/dev reproducibility | **45/100** | Compose cobre 4 serviços; frontend ausente, conflito de porta, health/restart/fixtures incompletos |
| Deployment readiness | **42/100** | backend container/profile prod/actuator; CI/deploy/rollback/backup/smoke/fullstack ausentes |

**Backend readiness agregada:** 65/100 (implementação promissora, validação integrada insuficiente).  
**Database readiness agregada:** 68/100 para desenvolvimento; não aprovada para produção sem Postgres migration/concurrency/backup tests.

## 22. P0/P1/P2/P3 Blockers

### P0 — blocks safe execution

1. Estado local Baseline V2 não publicado e divergente do remoto; risco de perda/dupla autoridade.
2. Ambiente integrado não comprovado com Java 21 + Maven + Docker/PostgreSQL/MinIO/ClamAV.
3. V1–V19 e testes de concorrência não executados contra PostgreSQL real nesta auditoria.
4. Conflito de porta frontend/backend e CORS default divergente.

### P1 — blocks core functionality

1. CG-001: RBAC sem matriz autoritativa e sem fixtures de todas as roles.
2. Citizen request creation backend existe, frontend não.
3. Complaints request/response incompatíveis.
4. Payments endpoint/DTO incompatíveis e provider externo não comprovado.
5. Admin request client/path stale; user provisioning interno ausente.

### P2 — blocks production readiness

Rate limiting/reset/verification; token storage/XSS posture; fullstack CI/E2E; secrets management; backup/restore/rollback; explicit headers/CSP; runtime validation of storage/scanner/workers; observability/alerts; content governance.

### P3 — improvement

OpenAPI/contract generation; eliminate legacy Supabase/zips/duplicate lockfiles; frontend container; status-code semantics; documentation pruning; performance/load/accessibility automation.

## 23. Proposed Implementation Blocks

### B0 — Preserve and establish source authority

**Objective:** checksum/export/publish Baseline V2 to a new reviewed branch without changing master/F5.  
**Areas:** Git, manifests, reports, frontend recovered delta.  
**Gate:** clean reconstructed tree, hashes, frontend gates, remote verification.  
**Done:** one authoritative branch/HEAD documented.  
**Risk:** highest—data loss or publishing wrong delta.

### B1 — Reproducible integrated local environment

**Objective:** Java 21/Maven/Docker Compose startup with non-conflicting ports.  
**Areas:** runbook/config only after approval; no domain changes.  
**Dependencies:** B0.  
**Gate:** health, frontend, Postgres, MinIO, ClamAV healthy; clean Git.  
**Done:** one-command documented lifecycle and isolation from other workstation infrastructure.

### B2 — PostgreSQL and migration certification

**Objective:** fresh V1–V19, restart, upgrade simulation, constraints/concurrency.  
**Areas:** Flyway tests/Testcontainers, backup/restore plan.  
**Gate:** `mvn verify`, migration test, F5 concurrency test.  
**Done:** repeatable real-Postgres evidence; no H2-only confidence.

### B3 — Test identities and authentication hardening

**Objective:** safe dev/test fixtures for all six roles; remove unsupported demos; rate-limit design.  
**Dependencies:** B2.  
**Gate:** login/refresh/revoke/change-password/locked negative tests.  
**Done:** all personas reproducibly available only in dev/test.

### B4 — Authoritative RBAC/ownership matrix

**Objective:** reconcile DB permissions, Spring guards, frontend presentation and domain scopes.  
**Areas:** security/controller annotations/services/tests/docs.  
**Gate:** role×endpoint and owner/cross-owner negative integration suite.  
**Done:** CG-001 closed without frontend-parallel RBAC.

### B5 — Repair core contract mismatches

**Objective:** align complaints, payments, admin requests and error envelopes; remove fake lookup behavior.  
**Dependencies:** B4/product decisions.  
**Gate:** consumer/adapter tests + backend integration; no mocks presented as real.  
**Done:** every enabled action reaches a real compatible endpoint.

### B6 — Citizen request creation fullstack

**Objective:** integrate definitions→draft→validation→documents→idempotent submit.  
**Gate:** happy/error/conflict/version/ownership tests and responsive QA.  
**Done:** F3 backend capability is usable end-to-end.

### B7 — Staff request workbench

**Objective:** expose existing admin request workflows only after contract/RBAC audit.  
**Gate:** assignment/status/audit/forbidden tests.  
**Risk:** do not invent workflows missing in backend.

### B8 — Content and admin-user decision block

**Objective:** decide whether V6 content tables become a supported domain; design controlled internal provisioning.  
**Gate:** approved product/RBAC/API spec before code.  
**Done:** explicit implement/defer decisions.

### B9 — Integration and security hardening

**Objective:** headers, CORS, rate limits, upload adversarial tests, secret scanning, audit coverage.  
**Gate:** security regression suite and dependency/secret scans.

### B10 — Full E2E and resilience

**Objective:** browser flows for every real role, restart/persistence, concurrency and service failure.  
**Gate:** deterministic E2E against Compose/Postgres.

### B11 — Deployment readiness

**Objective:** CI fullstack, migrations-on-deploy policy, backups, rollback, smoke/health/alerts.  
**Gate:** staging deployment + restore/rollback rehearsal.  
**Done:** production readiness review passes.

## 24. Recommended Local Test Architecture

**RECOMMENDATION — NOT CURRENT STATE:** isolated Compose project with PostgreSQL 16, MinIO, ClamAV, backend Java 21 and frontend on 5173; deterministic seed/fixture runner activated only by `dev/test`; no dependency on `C:\RIGHTWARE\backend-infra`.

Validation target:

1. fresh volumes → Flyway V1–V19;
2. fixture personas for all roles and ownership pairs;
3. backend `mvn verify` including Testcontainers;
4. frontend lint/TS/unit/build;
5. contract smoke by endpoint family;
6. browser E2E for public/citizen/internal roles;
7. restart without reseed/data loss;
8. clean volume reset documented separately and explicitly destructive.

## 25. Open Decisions

1. Confirmar via GitHub autenticado se `rightware-corporations/boane-conecta` existe/é privado e se contém trabalho mais recente.
2. Escolher e publicar a autoridade entre remote F5 e local Baseline V2 reconstruída.
3. Aprovar matriz RBAC/resource ownership e processo de provisioning interno.
4. Decidir payment provider e semântica de initiation/callback.
5. Decidir se content tables V6 serão implementadas ou removidas do scope activo.
6. Decidir frontend token strategy (localStorage vs BFF/httpOnly cookie) com threat model.
7. Definir deployment target, backup/RPO/RTO, migrations e rollback.
8. Definir status-code/OpenAPI/versioning policy.

## 26. Exact Next Action

Executar **B0 — Preserve and establish source authority**. Não iniciar backend novo enquanto a Baseline V2 local não estiver preservada e comparável a uma branch remota. Depois executar B1 e B2 antes de qualquer domínio.

### NEXT CHAT STARTING POINT

- **Repo:** `rightware-corporations/boane-conecta-fullstack-app`
- **Published branch:** `feat/fullstack-f5-appointments-queue`
- **Published HEAD:** `378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0`
- **Audited local branch/HEAD:** `feat/fullstack-f5-appointments-queue` / `88e4d852f374169e41b778d21a4076322f5062fb` + dirty recovered Baseline V2
- **Backend:** substantial Java 21/Spring Boot implementation; runtime gates not executed in this environment
- **Database:** PostgreSQL/Flyway V1–V19; schema mature but real-Postgres migration/concurrency proof pending
- **Largest blocker:** two source authorities and unpublished local recovered work
- **First block:** B0 source preservation/publication; then B1 reproducible runtime and B2 Postgres certification
- **Validation commands:** `git fetch --all --prune`; `git status --short`; `git log --oneline --decorate -10`; frontend `npm run lint`, `npx tsc -p tsconfig.app.json --noEmit`, `npm run test`, `npm run build`; backend with Java 21/Docker `mvn --batch-mode --no-transfer-progress verify`; `docker compose config`; `docker compose up --build`.
- **Read first:** `backend/pom.xml`; `backend/src/main/resources/application.yml`; `application-prod.yml`; `backend/src/main/resources/db/migration/`; `core/security/SecurityConfig.java`; `AuthService.java`; request draft/submission packages; appointments/queue packages; `docker-compose.yml`; `.github/workflows/backend-quality.yml`; `frontend/src/lib/api.ts`; `frontend/src/App.tsx`; Block 10/11 and Baseline V2 reports.

### Copy-ready prompt

> Use o artefacto `BOANE_CONECTA_BACKEND_FULLSTACK_AUDIT_V1.md` como baseline técnico. Antes de escrever, revalide no GitHub real o repositório, branches, HEADs, PRs e o working tree, pois SHA/branch são transitórios. Comece apenas pelo B0 — preservação e autoridade do source — sem implementar features, sem tocar em master, sem force push e sem perder a Baseline V2 local. Só depois proponha/executa B1 e B2 com gates explícitos.
