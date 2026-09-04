# BOANE CONECTA — IMPLEMENTATION BLOCK 04 REPORT

## 1. Baseline

- Execution date: 2026-08-31.
- Repository: `rightware-corporations/boane-conecta-fullstack-app`.
- Workspace: `/workspace/scratch/4da30144c903/usb-codebase/repo`.
- Branch: `feat/fullstack-f5-appointments-queue`.
- Physical sandbox HEAD before and after this block: `88e4d852f374169e41b778d21a4076322f5062fb`.
- User-declared and remote-confirmed published branch baseline: `378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0`.
- Blocks 01, 02 and 03 remained present as accumulated working-tree changes.
- No commit, push, merge, rebase, reset, clean or branch movement was performed.

## 2. Git discrepancy analysis

A read-only remote inspection confirmed that `origin/feat/fullstack-f5-appointments-queue` points to `378fc31a`. The physical sandbox branch points to `88e4d852`; the histories have diverged and share merge-base `4ff50eb6`.

The remote tree also lacks five canonical documents present in the sandbox tree: the backend architecture atlas, backend engineering constitution, backend/mobile master handoff, project status handoff and React Native architecture specification. This discrepancy was not repaired because history reconciliation is outside Block 04 and must be resolved deliberately before publication. A fetch was used only to inspect the remote reference; it did not alter the checked-out branch or working tree.

## 3. Files audited

- `frontend/src/App.tsx` and the current `/admin/servicos` route declaration.
- Current authentication hooks, role mapping and route-guard behavior.
- `frontend/src/pages/admin/AdminServicos.tsx`.
- Frontend API client and success-envelope conventions.
- `AdminMunicipalServiceController` and service DTOs in the backend.
- Municipal service response, requirement, fee and status types.
- Blocks 01–03 accumulated changes and their reports.
- Canonical frontend, backend, product, governance and wireframe authorities named by the execution specification.

## 4. Current Services contract

The real read endpoint is `GET /api/v1/admin/services`. Its success payload contains `MunicipalServiceResponse` records with:

- `id`, `departmentId`, `departmentName`;
- `title`, `slug`, `description`, `processingTime`, `status`;
- `requirements`, `fees`;
- `createdAt`, `updatedAt`.

Requirement records expose `id`, `serviceId`, `title`, `description`, `required`, `createdAt` and `updatedAt`. Fee records expose `id`, `serviceId`, `title`, `amount`, `currency`, `createdAt` and `updatedAt`. Supported status values are `DRAFT`, `PUBLISHED` and `ARCHIVED`.

## 5. DTO mismatch found

The legacy page interpreted the endpoint as records with `name`, `category`, `price` and `duration`. Those fields are not the backend response contract. This caused valid server data to be rendered incorrectly or incompletely.

Block 04 removes that implicit assumption. Transport types now match the backend response explicitly, while presentation types remain separate.

## 6. Authorization matrix observed

| Operation | Frontend route fact | Backend method fact | Result |
| --- | --- | --- | --- |
| Read/list services | `/admin/servicos`: Super Admin, Admin, Funcionario | `SUPER_ADMIN`, `ADMIN`, `MANAGER` | Conflict; CG-001 remains open |
| Create/update | Existing page presentation does not establish definitive authority | `SUPER_ADMIN`, `ADMIN` | No authorization expansion |
| Archive/delete | Existing page presentation does not establish definitive authority | `SUPER_ADMIN` | No authorization expansion |

Presentation metadata is not treated as RBAC authority. Backend authorization remains definitive.

## 7. Read-versus-manage decision

No role or guard was changed. The frontend/backend disagreement between `Funcionario` and `MANAGER` cannot be resolved safely from the available authorities. Changing either side would invent policy under CG-001.

The page contract was therefore corrected for users whom the backend already authorizes. Manage capabilities were not expanded, and the task did not add fictitious controls to imply unsupported permissions.

## 8. Implementation

- Added exact transport DTOs for the admin municipal-services response.
- Added separate presentation models for service, requirement and fee rendering.
- Added a pure adapter from transport response to presentation model.
- Added a focused API function for `GET /admin/services` using the existing API client base path and success envelope.
- Updated `AdminServicos` to render real contract fields.
- Added real loading, empty and error states, including retry.
- Preserved the existing route path and default `AdminLayout` shell.
- Kept formatting in pt-MZ conventions, including monetary values.
- No backend, endpoint, DTO, migration, dependency or environment change was made.

## 9. Adapter design

The transport boundary lives under `features/admin-services` and owns server field names. The adapter converts those fields into a presentation model used by the page. It:

- maps `title` and `processingTime` directly instead of aliasing legacy fields;
- translates status values into explicit Portuguese labels;
- maps nested requirements and fees without inventing defaults;
- preserves optionality for absent descriptions, departments and processing times;
- keeps currency codes explicit and formats MZN through the shared formatter.

This separation prevents view code from becoming coupled to invented DTO shapes and keeps future contract changes localized.

## 10. Tests

Nine focused tests were added across two files:

- transport-to-view mapping for title and processing time;
- nested requirement and fee mapping;
- safe optional-field handling;
- correct API endpoint and transport-error propagation;
- rejection of unsuccessful API envelopes;
- page rendering of real fields;
- omission of unavailable optional content;
- real empty state;
- real error state.

The full frontend suite passes: **22 test files, 61 tests**.

## 11. Quality gates

| Gate | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npx tsc -p tsconfig.app.json --noEmit` | PASS |
| `npm run test` | PASS — 22 files, 61 tests |
| `npm run build` | PASS |
| `git --no-pager diff --check` | PASS; only informational LF/CRLF warnings |
| Backend diff | EMPTY |
| Migration diff | EMPTY |
| Package and lockfile diff | EMPTY |
| Environment diff | EMPTY |
| Route-guard diff | EMPTY |

## 12. Block 04 files changed

- Modified: `frontend/src/pages/admin/AdminServicos.tsx`.
- Added: `frontend/src/pages/admin/AdminServicos.test.tsx`.
- Added: `frontend/src/features/admin-services/types.ts`.
- Added: `frontend/src/features/admin-services/admin-services.api.ts`.
- Added: `frontend/src/features/admin-services/admin-services.api.test.ts`.
- Added: `docs/frontend/BOANE_CONECTA_IMPLEMENTATION_BLOCK_04_REPORT.md`.

Other modified and untracked files shown by Git belong to the preserved accumulated Blocks 01–03 working tree.

## 13. Preserved behavior and boundaries

- `/admin/servicos` path preserved.
- Existing API base-path behavior preserved.
- Existing authentication and authorization preserved.
- Existing `AdminLayout` preserved for this page.
- Public frontend, CitizenShell, Filas and Agenda were not changed by Block 04.
- News and Projects were not modified.
- Backend, migrations, dependencies, lockfiles and environment files were untouched.
- No F6 or other route family was started.

## 14. Unresolved CG-001

CG-001 remains the blocking governance issue. Frontend route access includes `Funcionario`, while backend read authorization names `MANAGER`; the available material does not prove that these roles are equivalent or that either side is erroneous.

Required product/security decision: publish an authoritative matrix for read, create, update, archive and delete operations on municipal services, including the mapping between frontend role names and backend authorities.

## 15. Risks

- A frontend-authorized `Funcionario` may reach the page and receive backend HTTP 403.
- A backend-authorized `MANAGER` may not receive an equivalent frontend route affordance, depending on current role mapping.
- Git histories must be reconciled carefully before committing or publishing the accumulated work.
- The remote branch currently lacks canonical documents present in the sandbox tree.
- Visual QA remains local/manual pending; no browser dependencies or screenshots were fabricated.

## 16. InternalShell eligibility

**NO-GO at this stage.** The Services data contract is now technically aligned and the page is functional for backend-authorized users, but `/admin/servicos` is not eligible for InternalShell migration while the frontend/backend role conflict remains unresolved.

The page intentionally remains on its legacy `AdminLayout`. This prevents shell convergence from accidentally presenting an authorization policy that has not been approved.

## 17. Recommended next bounded block

Before further Services shell migration, resolve CG-001 through an authoritative, reviewed role/capability matrix and reconcile the divergent Git baseline. After those two decisions, a narrowly scoped follow-up may:

1. align route guard and backend authorities without privilege expansion;
2. add role-specific authorization tests;
3. re-audit `/admin/servicos` for InternalShell eligibility;
4. perform local visual QA at 360, 390, 430, 768, 1024, 1280 and 1440 pixels.

Do not begin News, Projects, Staff Requests, F6 or another route family as part of that decision block.
