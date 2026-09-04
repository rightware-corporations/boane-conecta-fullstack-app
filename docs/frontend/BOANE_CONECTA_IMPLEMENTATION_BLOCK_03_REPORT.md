# BOANE CONECTA — IMPLEMENTATION BLOCK 03 REPORT

## Content Operations Shell Convergence

**Decision:** NO-GO FOR CONTENT ROUTE MIGRATION  
**Execution status:** AUDIT COMPLETE — NO ELIGIBLE CANDIDATE ROUTES — AUTOMATED GATES GREEN  
**Date:** 2026-08-31  
**Repository:** `/workspace/scratch/4da30144c903/usb-codebase/repo`  
**Branch:** `feat/fullstack-f5-appointments-queue`  
**Actual sandbox HEAD:** `88e4d852f374169e41b778d21a4076322f5062fb`  
**Declared published baseline:** `378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0`  
**Remote:** `origin https://github.com/rightware-corporations/boane-conecta-fullstack-app.git`

No commit, push, merge, fetch, rebase, reset, clean or history rewrite was performed.

---

## 1. Baseline

The Block 03 audit was performed before any implementation edit.

Confirmed:

- repository identity matches `rightware-corporations/boane-conecta-fullstack-app`;
- current branch is `feat/fullstack-f5-appointments-queue`;
- the accumulated Block 01 and Block 02 working-tree changes are present;
- both Block 01 and Block 02 reports are present;
- backend diff is empty;
- migration diff is empty;
- package and lockfile diffs are empty;
- environment diff is empty;
- no prior working-tree change was deleted or reformatted.

### Baseline discrepancy

The Block 03 authorization identifies `378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0` as the published baseline. The repository physically available in this sandbox has HEAD `88e4d852f374169e41b778d21a4076322f5062fb`, and the declared object `378fc31a…` is not present in its local Git object database.

The implementation rules require the physical code to remain authoritative. Therefore:

- no baseline was guessed;
- no network fetch was performed;
- no reset or branch movement was performed;
- all findings in this report refer to the actual sandbox HEAD plus the accumulated Blocks 01/02 working tree.

This discrepancy must be reconciled before any future commit or cross-machine synchronization.

---

## 2. Preservation of Blocks 01 and 02

The following accumulated work remains preserved:

- InternalShell foundation;
- opt-in AdminLayout compatibility adapter;
- Filas migration;
- Agenda migration;
- shared operational states;
- pt-MZ / Africa/Maputo formatters;
- role-aware `/admin` landing;
- presentation-only internal navigation;
- Block 01 and Block 02 tests;
- Block 01 and Block 02 reports.

No file from either block was modified by Block 03.

---

## 3. Authorities and ADRs

The combined canonical authorities were revalidated for this decision:

- `BOANE_CONECTA_PROJECT_STATUS_AND_CONTINUATION_HANDOFF_V1_1.md`;
- `BOANE_CONECTA_WORK_MASTER_HANDOFF_V1.md`;
- `BOANE_CONECTA_RESPONSIVE_WIREFRAME_ATLAS_V1.md`;
- `BOANE_CONECTA_DESIGN_UX_CONSTITUTION_V1.md`;
- `BOANE_CONECTA_OPERATING_GOVERNANCE_AND_STARTUP_SPEC_V1.md`;
- `BOANE_CONECTA_BACKEND_ENGINEERING_CONSTITUTION_V1.md`;
- `BOANE_CONECTA_BACKEND_ARCHITECTURE_INFRASTRUCTURE_OPERATIONS_ATLAS_V1.md`;
- `BOANE_CONECTA_F5_APPOINTMENTS_QUEUE_ENGINEERING_SPEC_V1.md`;
- Block 01 and Block 02 implementation reports;
- Wireframe PASS 09, PASS 12, PASS 13 and PASS 14;
- Contract Gap Register;
- Frontend Implementation Execution Plan;
- Master QA Checklist.

Relevant ADRs reviewed:

- `ADR_F5_001_DOMAIN_CORRECTION.md`;
- `ADR_F3_001_APPROVED_FOUNDATION_DECISIONS.md`.

Key governing conclusions:

- frontend navigation is a UX hint, never authorization;
- route role arrays are not a substitute for backend permissions;
- unsupported publishing or content contracts must not be invented;
- shell migration is incremental and requires route parity;
- permission ambiguity is a stop condition;
- DTO/API mismatch cannot be hidden through fabricated presentation data.

---

## 4. Audited candidate routes

The physical route registry in `frontend/src/App.tsx` contains:

| Candidate | Real frontend path | Frontend route roles |
|---|---|---|
| News | `/admin/noticias` | `super_admin`, `admin`, `editor` |
| Services | `/admin/servicos` | `super_admin`, `admin`, `funcionario` |
| Projects | `/admin/projectos` | `super_admin`, `admin`, `gestor` |

No alternative content route family is currently wired in the router.

---

## 5. Eligibility matrix

| Route | Wired | Legacy shell | Frontend guard | Backend contract | UI contract | Classification | Decision |
|---|---:|---:|---|---|---|---|---|
| `/admin/noticias` | Yes | Yes | Confirmed | No controller/module | Placeholder explicitly says backend pending | PLACEHOLDER / NO CONTRACT | BLOCKED |
| `/admin/servicos` | Yes | Yes | Conflicts with backend | Real GET endpoint | DTO and role mismatch | PARTIAL CONTRACT / AUTH CONFLICT | BLOCKED |
| `/admin/projectos` | Yes | Yes | Confirmed only at frontend | No controller/module | Placeholder explicitly says backend pending | PLACEHOLDER / NO CONTRACT | BLOCKED |

Zero candidate routes satisfy all four mandatory conditions:

1. existing;
2. valid aligned authorization;
3. real functional behaviour;
4. no backend/API/DTO change required.

Consequently, zero routes were migrated to InternalShell.

---

## 6. Architecture before Block 03

The current internal architecture remains:

- `/admin`, `/admin/filas` and `/admin/agenda` opt into InternalShell;
- legacy content routes use the default legacy AdminLayout;
- InternalShell navigation contains only Início interno, Filas and Agenda;
- Editor receives a safe empty landing state;
- AdminSidebar still contains legacy broad menu metadata;
- `AdminShell` and `ExecutiveShell` remain unwired and preserved;
- frontend route guards and backend method security are not fully aligned.

This architecture is intentionally not expanded until route eligibility is real.

---

## 7. Candidate analysis — News

### Frontend

- Route exists at `/admin/noticias`.
- Route guard allows `super_admin`, `admin`, `editor`.
- `AdminNoticias.tsx` is a static unavailable-state placeholder.
- The page explicitly states that the Spring Boot news module is pending.

### Client service

`news.service.ts` contains speculative client methods for `/admin/news`, including create, update and delete operations.

### Backend

No corresponding Spring Boot news controller/domain was found.

### Decision

**BLOCKED — NO REAL BACKEND CONTRACT.**

The existence of a frontend service file is not proof of a real endpoint. Migrating the placeholder or exposing it to Editor as productive work would create a dead destination and violate the block's content-integrity rules.

---

## 8. Candidate analysis — Services

### Frontend route

- Route exists at `/admin/servicos`.
- Frontend RoleGuard allows `super_admin`, `admin`, `funcionario`.

### Frontend page

`AdminServicos.tsx` performs a real GET call to `/admin/services`, but uses a local legacy DTO:

- `name`;
- `description`;
- `category`;
- `price`;
- `duration`.

### Backend contract

The real backend endpoint is `/api/v1/admin/services` and returns `MunicipalServiceResponse`:

- `id`;
- `departmentId`;
- `departmentName`;
- `title`;
- `slug`;
- `description`;
- `processingTime`;
- `status`;
- `requirements`;
- `fees`;
- `createdAt`;
- `updatedAt`.

The current page therefore expects `name` where the backend sends `title`, and `duration` where the backend sends `processingTime`. Other legacy fields also do not map directly.

### Authorization conflict

Backend GET method security allows:

- `SUPER_ADMIN`;
- `ADMIN`;
- `MANAGER`.

Frontend route guard allows:

- `super_admin`;
- `admin`;
- `funcionario`.

Result:

- Funcionario can open the frontend route but the backend GET is expected to reject `EMPLOYEE`;
- Gestor/Manager can read the backend resource but is blocked by the frontend route;
- Admin and Super Admin align;
- Editor has neither frontend nor backend access.

### Decision

**BLOCKED — REAL AUTHORIZATION CONFLICT + DTO MISMATCH.**

The prompt explicitly requires a route-specific stop when authorization conflicts are found. Fixing this safely requires an authoritative CG-001 decision and an approved DTO adapter/feature contract, both outside Block 03.

---

## 9. Candidate analysis — Projects

### Frontend

- Route exists at `/admin/projectos`.
- Route guard allows `super_admin`, `admin`, `gestor`.
- `AdminProjectos.tsx` is a static unavailable-state placeholder.
- The page explicitly states that no real Spring Boot project module is exposed.

### Client service

`projects.service.ts` declares speculative admin methods for `/admin/projects`.

### Backend

No corresponding projects controller/domain was found.

### Decision

**BLOCKED — NO REAL BACKEND CONTRACT.**

No Project link was added to InternalShell or the role-aware landing.

---

## 10. Implementation result

No application code was changed.

This is the required safe implementation outcome because every candidate failed at least one hard eligibility condition. The only Block 03 file created is this report.

Specifically, Block 03 did not:

- migrate any content page;
- add any content navigation item;
- alter `/admin` landing actions;
- change route guards;
- change permission mappings;
- adapt DTOs;
- create API endpoints;
- create fake content;
- make a placeholder appear productive.

---

## 11. Role-aware IA result

### Editor

Editor remains on the conservative empty state created in Block 02.

This is not an artificial limitation. It reflects the current product truth:

- News is authorized at the frontend but has no backend module;
- Services is not authorized for Editor;
- Projects is not authorized for Editor and has no backend module.

### Admin / Super Admin

No content destinations were promoted because:

- News and Projects are placeholders;
- Services has an unresolved DTO/authorization contract.

### Funcionario

No Content link was added. Although the frontend route currently includes Funcionario for Services, backend method security does not allow EMPLOYEE for the list endpoint.

### Gestor

No Content link was added. Backend permits MANAGER to list Services, while the frontend route blocks Gestor; Projects remains a placeholder.

The IA remains subordinate to actual authorization and contracts.

---

## 12. Responsive behaviour

No content page presentation was changed, so no new responsive claim is made.

The previously implemented InternalShell responsive contract remains intact for:

- `/admin`;
- `/admin/filas`;
- `/admin/agenda`.

No public or CitizenShell file was altered.

---

## 13. Accessibility

No new content UI was introduced. Existing Block 01/02 accessibility contracts remain preserved:

- SkipLink;
- main landmark;
- route h1;
- accessible drawer;
- focus management;
- aria-current;
- keyboard-compatible controls;
- reduced-motion foundation.

It would be misleading to claim migrated content-page accessibility because no content route was eligible for migration.

---

## 14. Tests

No Block 03 behavioural test was added because no route or behaviour was migrated.

The complete existing suite was rerun:

- **20 test files passed**;
- **52 tests passed**;
- **0 tests failed**.

Existing tests continue to verify:

- InternalShell navigation;
- mobile drawer contract;
- `/admin` role-aware landing;
- Editor safe empty state;
- Filas and Agenda foundations;
- absence of legacy fake dashboard metrics.

---

## 15. Gates

| Gate | Result |
|---|---|
| `npm run lint` | PASS |
| `npx tsc -p tsconfig.app.json --noEmit` | PASS |
| `npm run test` | PASS — 20 files / 52 tests |
| `npm run build` | PASS — 2240 modules transformed |
| `git --no-pager diff --check` | PASS after report creation |
| backend diff | EMPTY |
| migration diff | EMPTY |
| package.json diff | EMPTY |
| package-lock.json diff | EMPTY |
| other lockfile diff | EMPTY |
| env diff | EMPTY |

The existing non-failing npm proxy warning, React Router future warnings and Browserslist age notice were observed. No dependency update was authorized or performed.

---

## 16. Files changed by Block 03

- `docs/frontend/BOANE_CONECTA_IMPLEMENTATION_BLOCK_03_REPORT.md` — new audit/decision report.

No frontend or backend source file was changed by Block 03.

---

## 17. Preserved behaviour

- all current route paths remain unchanged;
- all current RoleGuard arrays remain unchanged;
- backend method security remains unchanged;
- AdminNoticias remains an honest unavailable state;
- AdminServicos retains its existing legacy behaviour pending contract repair;
- AdminProjectos remains an honest unavailable state;
- Editor remains safely empty at `/admin`;
- Filas and Agenda remain unchanged;
- public frontend remains unchanged;
- CitizenShell remains unchanged;
- F5 domain/state machines remain unchanged.

---

## 18. Contract gaps

### Content backend gap

There is no real News or Projects backend module corresponding to the currently wired frontend placeholders.

### Services DTO gap

The admin Services page and generic frontend Service type use a legacy field model that does not match `MunicipalServiceResponse`.

### Services authorization gap

Frontend and backend disagree on Funcionario/Employee versus Gestor/Manager access.

### Publishing model gap

No approved news/project publication states, review flow, preview flow or asset contract is exposed by the backend.

### Baseline synchronization gap

The declared published baseline is absent from the sandbox repository. Future Git preservation must first establish which Git history is canonical without discarding the accumulated working tree.

---

## 19. CG-001 findings

CG-001 remains open and now has a concrete reproducible conflict:

| Resource | Frontend roles | Backend GET roles | Conflict |
|---|---|---|---|
| Admin Services | Super Admin, Admin, Funcionario | SUPER_ADMIN, ADMIN, MANAGER | Funcionario/Employee and Gestor/Manager mismatch |

Additional facts:

- `useAuth.tsx` assigns `admin.services.manage` to Admin and Funcionario;
- `useUserRole.tsx` derives `canManageServices` from that client mapping;
- backend GET permits Manager but mutations are more restricted;
- the frontend route currently does not distinguish read from manage;
- navigation metadata must not encode a new resolution.

Required future authority:

```text
ROLE
+ CAPABILITY
+ RESOURCE
+ SCOPE
+ CONTEXT
```

with explicit read/create/update/archive distinctions for municipal services.

---

## 20. Risks

- A Funcionario can deep-link to `/admin/servicos` and then receive a backend authorization failure.
- A Gestor may possess backend read authority but cannot open the frontend route.
- Admin Services may render missing titles/durations because of DTO field mismatch.
- Client service files for News and Projects can be mistaken for proof that endpoints exist.
- Migrating placeholders to InternalShell would make unavailable modules appear production-ready.
- Continuing from the wrong Git baseline could complicate later preservation or commit attribution.

---

## 21. QA evidence and status

### Automated QA

- lint PASS;
- TypeScript PASS;
- 52/52 tests PASS;
- production build PASS;
- boundary diffs empty.

### Visual QA

No Block 03 visual QA is applicable because no content route was migrated or visually modified.

The available cloud browser cannot access localhost. In accordance with the prompt:

- Playwright was not installed;
- Chromium was not installed;
- no dependencies were added;
- no screenshots were fabricated.

The user's completed local QA for Blocks 01/02 remains acknowledged and preserved as prior evidence.

---

## 22. Recommended next bounded block

Do not begin Block 04 automatically.

Before content shell convergence can proceed, authorize a narrowly scoped prerequisite block to:

1. reconcile the canonical Git baseline without losing Blocks 01/02/03;
2. decide the authoritative Services read/manage roles under CG-001;
3. align the frontend Services route guard with backend method security;
4. introduce an explicit adapter/type for `MunicipalServiceResponse` without changing the backend DTO;
5. add contract tests for Services list rendering and forbidden roles;
6. separately decide whether News or Projects backend implementation is in scope.

Only after these prerequisites are approved should `/admin/servicos` be reconsidered for InternalShell migration. News and Projects must remain blocked until real backend modules exist.

---

## 23. Boundary confirmation

- **Application code changed:** NO.
- **Backend touched:** NO.
- **Migrations touched:** NO.
- **Dependencies touched:** NO.
- **Lockfiles touched:** NO.
- **Environment touched:** NO.
- **Route guards changed:** NO.
- **Authorization expanded:** NO.
- **DTOs changed:** NO.
- **Content links added:** NO.
- **Fake content added:** NO.
- **Public frontend changed:** NO.
- **CitizenShell changed:** NO.
- **Filas/Agenda changed:** NO.
- **Staff Requests started:** NO.
- **F6 started:** NO.
- **Block 04 started:** NO.
- **Commit/push/merge performed:** NO.

## Final assessment

**BLOCK 03 — AUDIT COMPLETE / MIGRATION NO-GO / AUTOMATED GATES GREEN**

The correct outcome is to preserve the existing safe shell architecture and stop. No current content candidate can be migrated without either exposing a placeholder, ignoring an authorization conflict, or adapting an incompatible contract. Those actions are explicitly prohibited by the canonical authorities and Block 03 boundaries.
