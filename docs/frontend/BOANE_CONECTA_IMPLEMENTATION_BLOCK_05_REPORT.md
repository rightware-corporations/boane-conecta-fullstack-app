# BOANE CONECTA — IMPLEMENTATION BLOCK 05 REPORT

## 1. Baseline

- Date: 2026-08-31.
- Repository: `rightware-corporations/boane-conecta-fullstack-app`.
- Workspace: `/workspace/scratch/4da30144c903/usb-codebase/repo`.
- Branch: `feat/fullstack-f5-appointments-queue`.
- Sandbox HEAD preserved: `88e4d852f374169e41b778d21a4076322f5062fb`.
- Published remote branch inspected at: `378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0`.
- Common merge-base: `4ff50eb6`.
- Accumulated Blocks 01–04 were present before Block 05 and remained preserved.
- No commit, push, merge, rebase, reset, clean or checkout over the working tree was performed.

## 2. Git history topology

The local sandbox and published branch have diverged from the same merge-base:

| Ref | Unique commits from merge-base | Tree meaning |
| --- | ---: | --- |
| Sandbox `88e4d852` | 68 | F0–F5 implementation plus five normalized canonical authorities |
| Remote `378fc31a` | 286 | Equivalent application tree represented by a different, more granular history |

The commit identities are not interchangeable. The divergence is historical rather than an application-code divergence: the two commit trees differ only by five canonical documentation files.

## 3. Sandbox versus remote reconciliation findings

`git diff 88e4d852..378fc31a` reports deletion on the remote side of exactly:

1. `docs/backend/BOANE_CONECTA_BACKEND_ARCHITECTURE_INFRASTRUCTURE_OPERATIONS_ATLAS_V1.md`;
2. `docs/backend/BOANE_CONECTA_BACKEND_ENGINEERING_CONSTITUTION_V1.md`;
3. `docs/handoffs/BOANE_CONECTA_BACKEND_MOBILE_MASTER_IMPLEMENTATION_HANDOFF_V1.md`;
4. `docs/handoffs/BOANE_CONECTA_PROJECT_STATUS_AND_CONTINUATION_HANDOFF_V1_1.md`;
5. `docs/mobile/BOANE_CONECTA_CITIZEN_MOBILE_REACT_NATIVE_ARCHITECTURE_SPEC_V1.md`.

The F5 appointment, queue and migration paths have identical trees at both refs. Therefore F5 hardening exists in both baselines. The remote does not contain the five normalized authorities, while the sandbox does.

## 4. Preservation and future publication plan

The divergence should not be reconciled inside the accumulated dirty working tree. The safe publication procedure is:

1. preserve a complete transferable export and an exact inventory of tracked/untracked Block 01–05 files;
2. create a separate clean worktree or clone from remote `378fc31a`, without moving this sandbox branch;
3. overlay only the reviewed accumulated working-tree delta and the five missing authorities;
4. verify that the resulting application tree matches the intended sandbox result;
5. rerun frontend and backend gates in that clean publication worktree;
6. create logical commits there and push without force.

Cherry-picking the entire local 68-commit chain onto the 286-commit remote chain is not recommended because the application trees are already equivalent and would create duplication/conflict risk. No reconciliation operation was executed in Block 05.

## 5. Role-mapping evidence

The mapping is explicit in `frontend/src/services/auth.service.ts`, not inferred from translated names:

| Backend role | Frontend role | Evidence status |
| --- | --- | --- |
| `SUPER_ADMIN` | `super_admin` | Explicit normalization |
| `ADMIN` | `admin` | Explicit normalization |
| `MANAGER` | `gestor` | Explicit normalization |
| `EMPLOYEE` | `funcionario` | Explicit normalization |
| `EDITOR` | `editor` | Explicit normalization |
| fallback/citizen | `municipe` | Explicit fallback behavior |

The backend `RoleName` enum independently defines `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `EDITOR`, `EMPLOYEE` and `CITIZEN`. Authentication responses return these enum names as role strings.

## 6. Services operation matrix

| Operation | Capability concept | Backend-authorized roles | Resource/scope/context |
| --- | --- | --- | --- |
| Read/list | `admin.services.read` | Super Admin, Admin, Manager | Municipal service catalogue; administrative context |
| Read detail | No independent admin-detail route | N/A | Full records arrive through list; nested requirement/fee reads share list roles |
| Create | `admin.services.manage` | Super Admin, Admin | Municipal service catalogue; administrative context |
| Update | `admin.services.manage` | Super Admin, Admin | Includes DTO status changes supported by update contract |
| Publish/status change | `admin.services.manage` | Super Admin, Admin | No independent publish endpoint; governed by update |
| Archive | privileged service archive | Super Admin | HTTP `DELETE` performs soft archive |
| Permanent delete | Not supported | None | No permanent service-delete contract |
| Manage requirements/fees | `admin.services.manage` | Super Admin, Admin | Nested service resources |
| Read requirements/fees | `admin.services.read` | Super Admin, Admin, Manager | Nested service resources |

No global or unrelated-resource scope was introduced. Backend method security remains definitive.

## 7. Frontend/backend comparison before alignment

Before Block 05:

- frontend route: `super_admin`, `admin`, `funcionario`;
- backend list: `SUPER_ADMIN`, `ADMIN`, `MANAGER`;
- frontend `funcionario` incorrectly held `admin.services.manage`;
- frontend `gestor` lacked Services read permission despite mapping directly from `MANAGER`;
- read and manage semantics were conflated.

## 8. CG-001 Services decision

The Services-specific part of CG-001 is resolved by existing executable and documented authority:

- `gestor == MANAGER` and is permitted to read/list Services;
- `funcionario == EMPLOYEE` and is not permitted administrative Services access;
- Admin and Super Admin may read;
- Admin and Super Admin own ordinary writes;
- only Super Admin may archive a service;
- Editor and Munícipe have no administrative Services access.

This is a reduction of unintended privilege, not an authorization expansion. CG-001 remains open for unrelated domains and the future capability architecture.

## 9. Implementation performed

- Added `ADMIN_SERVICES_READ_ROLES` as the route presentation mirror of backend read authority.
- Added `canReadAdminServices` for explicit, testable role evaluation.
- Changed `/admin/servicos` from `super_admin/admin/funcionario` to `super_admin/admin/gestor`.
- Added `admin.services.read` to Admin and Gestor.
- Removed `admin.services.manage` from Funcionario.
- Preserved `admin.services.manage` for Admin and wildcard authority for Super Admin.
- Added `canReadServices` to `useUserRole` without rewriting the RBAC architecture.
- Did not alter backend security, service logic, endpoints or DTOs.

Navigation metadata was not used as authorization and was not expanded in this block.

## 10. Tests

Focused authorization tests cover:

- Super Admin allowed;
- Admin allowed;
- Gestor allowed through the confirmed `MANAGER` mapping;
- Funcionario blocked;
- Editor blocked;
- Munícipe blocked;
- unauthenticated/null role blocked;
- exact route-role set matches the backend read contract.

Existing Admin Services adapter and page-contract tests remain green. The route constant is consumed directly by the actual `RoleGuard`, avoiding a second untested role list.

## 11. Gates

| Gate | Result |
| --- | --- |
| Focused Services authorization/API/page tests | PASS — 16 tests |
| `npm run lint` | PASS |
| `npx tsc -p tsconfig.app.json --noEmit` | PASS |
| `npm run test` | PASS — 23 files, 68 tests |
| `npm run build` | PASS |
| `git --no-pager diff --check` | PASS; informational LF/CRLF warnings only |
| Backend diff | EMPTY |
| Migration diff | EMPTY |
| Package/lockfile diff | EMPTY |
| Environment diff | EMPTY |

## 12. Block 05 files changed

- Modified: `frontend/src/App.tsx`.
- Modified: `frontend/src/hooks/useAuth.tsx`.
- Modified: `frontend/src/hooks/useUserRole.tsx`.
- Added: `frontend/src/features/admin-services/admin-services.authorization.ts`.
- Added: `frontend/src/features/admin-services/admin-services.authorization.test.ts`.
- Added: `docs/frontend/BOANE_CONECTA_IMPLEMENTATION_BLOCK_05_REPORT.md`.

All other working-tree changes belong to preserved Blocks 01–04.

## 13. Preserved behavior and boundaries

- Services DTO adapter and real loading/empty/error behavior preserved.
- Backend remains the final authorization authority.
- Admin Services write behavior was not expanded or rewritten.
- News and Projects were untouched.
- No InternalShell migration occurred.
- F5 state machines, queue capacity, check-in, idempotency and migrations were untouched.
- Dependencies, lockfiles, environment and public/citizen surfaces were untouched.

## 14. Risks

- `permissionsByRole` remains a frontend presentation convenience and is not an authoritative capability service.
- The backend has no independent administrative service-detail endpoint; future detail UX must not invent one.
- Other routes still require domain-specific CG-001 analysis.
- Divergent Git histories create publication risk if someone merges or rebases the dirty sandbox directly.
- Backend/runtime integration and local visual QA remain separate human/environment validation activities.

## 15. `/admin/servicos` InternalShell eligibility

**GO FOR FUTURE CONTROLLED MIGRATION.** The route now has:

- explicit and aligned frontend/backend read authorization;
- confirmed role normalization;
- a real API and stable explicit transport DTO;
- presentation adapter and real operational states;
- focused authorization, API and page tests;
- no remaining Services-specific CG-001 blocker.

This verdict authorizes a future bounded migration only. Block 05 did not perform that migration.

## 16. CG-001 outside Services

CG-001 remains open for the system-wide authoritative capability matrix, resource scopes, department/team restrictions, separation of duties and other route families. Existing frontend role arrays and convenience permissions must not be generalized from this Services decision.

News and Projects remain blocked by missing real backend modules and were not reassessed as implementable features.

## 17. Exact recommendation for Block 06

Block 06 should be a controlled `/admin/servicos` InternalShell migration only:

1. preserve the aligned route constant as the frontend guard source;
2. add a Services navigation destination only for Super Admin, Admin and Gestor;
3. keep navigation presentation-only and backend enforcement definitive;
4. preserve the Block 04 DTO adapter, endpoint, operational states and business behavior;
5. render Gestor as read-only unless backend-projected actions prove otherwise;
6. ensure Admin/Super Admin controls never imply unsupported operations;
7. add current-route, role visibility, keyboard, responsive and regression tests;
8. run complete gates and local/manual viewport QA;
9. do not touch News, Projects, backend, migrations, dependencies or other route families.

Git publication/reconciliation should remain a separate preservation task, ideally before the accumulated change set grows further.
