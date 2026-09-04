# BOANE CONECTA — IMPLEMENTATION BLOCK 06 REPORT

## 1. Baseline

- Date: 2026-08-31.
- Repository: `rightware-corporations/boane-conecta-fullstack-app`.
- Workspace: `/workspace/scratch/4da30144c903/usb-codebase/repo`.
- Branch: `feat/fullstack-f5-appointments-queue`.
- Sandbox HEAD preserved: `88e4d852f374169e41b778d21a4076322f5062fb`.
- Published remote reference remains: `378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0`.
- Known history divergence was not reconciled in this block.
- No commit, push, merge, rebase, reset, clean or destructive checkout was performed.

## 2. Preserved Blocks 01–05

All five preceding reports and their accumulated implementation changes remained present. Block 06 did not reformat, discard or replace earlier work. In particular, the Block 04 Services transport DTO/adapter and the Block 05 Services authorization decision remained authoritative inputs.

## 3. Files and architecture audited

- `frontend/src/App.tsx` route guard for `/admin/servicos`.
- `AdminLayout` compatibility adapter and its operational-shell opt-in.
- `InternalShell`, grouped navigation and accessibility behavior.
- `internal-navigation.ts` presentation metadata.
- Block 05 `ADMIN_SERVICES_READ_ROLES` authority mirror.
- `AdminServicos` page and existing behavioral tests.
- Services API, transport types, adapter and authorization tests.
- Blocks 01–05 reports and the listed canonical product, UX, governance and backend authorities.
- Relevant F3/F5 ADRs and documented Contract Gap findings.

## 4. Architecture before Block 06

`AdminLayout` already supported two explicit modes:

- default `legacy` presentation using `AdminSidebar`;
- `operations` presentation delegating to `InternalShell` and role-aware internal navigation.

Filas and Agenda had opted into the operational shell. Services still used the default legacy mode even though its API contract and authorization had become eligible in Blocks 04–05. Internal navigation contained only Área interna and Operações groups.

## 5. Services authorization authority

Block 06 reused the single existing `ADMIN_SERVICES_READ_ROLES` constant:

- `super_admin`;
- `admin`;
- `gestor`.

The route guard and navigation presentation now consume the same source. No second role array was introduced. Funcionario, Editor and Munícipe remain excluded. Spring Security remains the definitive enforcement authority.

## 6. InternalShell migration

`AdminServicos` now opts into the established adapter with `shell="operations"`. The shell title is `Serviços municipais`, and the subtitle continues to report the real number of records returned.

The following behavior was preserved unchanged:

- `GET /admin/services` endpoint usage;
- explicit transport DTO;
- transport-to-presentation adapter;
- view model;
- loading, empty, error and retry behavior;
- optional-field handling;
- requirements, fees and status rendering;
- pt-MZ and monetary formatting.

No feature logic was moved into the shell.

## 7. Internal navigation

The resulting information architecture is:

- Área interna
  - Início interno
- Operações
  - Filas
  - Agenda
- Conteúdo
  - Serviços

Services uses the real `/admin/servicos` path and is visible only to roles from `ADMIN_SERVICES_READ_ROLES`. No News, Projects, Users, Finance, Work Queue or other speculative destination was added.

The navigation module imports presentation-safe authorization metadata only. It does not import the Services API, DTOs or domain behavior, and the production build confirms there is no blocking dependency cycle.

## 8. Gestor read-only behavior

Gestor can:

- open the route;
- see the Services navigation item;
- view the real Services data and operational states;
- receive correct `aria-current="page"` navigation state.

Gestor receives no create, edit, publish, archive or delete control. The page contains no mutation controls, so none were invented during migration.

## 9. Admin and Super Admin behavior

Admin and Super Admin can open the route and see the Services destination. Their existing read presentation is preserved. Although backend authorities support defined writes, the current page has no proven implemented mutation workflow; therefore Block 06 did not add or imply management buttons.

## 10. Responsive behavior

The migrated page uses the existing responsive shell contract:

- fixed sidebar on desktop;
- accessible sheet navigation on compact viewports;
- responsive page gutters and maximum content width;
- service records rendered as semantic list rows rather than a compressed desktop table;
- stacked metadata on compact screens and aligned row structure at tablet widths;
- requirements and fees become two columns only at large widths;
- long text uses constrained readable measure and wrapping;
- no intentional horizontal scrolling.

Structural validation is covered by code and build. Physical viewport inspection remains part of local visual QA.

## 11. Accessibility

Preserved and validated structurally:

- SkipLink targeting `#main-content`;
- one shell-owned H1;
- main landmark;
- route-heading focus on navigation;
- `aria-current` for Services;
- accessible compact navigation sheet;
- Radix Escape and focus-return behavior;
- visible textual status labels;
- operational loading/error/empty semantics;
- accessible retry action;
- minimum navigation target height and focus-visible component behavior;
- reduced-motion behavior inherited from the established foundation.

Keyboard, 200% zoom and physical focus-return inspection remain in local manual QA.

## 12. Tests

Focused tests now prove:

- AdminServicos opts into `InternalShell` through the compatibility adapter;
- Services appears for Super Admin, Admin and Gestor;
- Services is absent for Funcionario, Editor and Munícipe;
- `/admin/servicos` marks Services as current;
- navigation uses the existing aligned authorization source;
- Gestor receives no unsupported mutation controls;
- existing Services adapter, page, empty/error and authorization contracts remain green;
- existing AdminLayout, Filas, Agenda and Dashboard regression coverage remains green.

Focused selection: **28/28 tests passed**. Full frontend suite: **23 files, 76/76 tests passed**.

## 13. Gates

| Gate | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npx tsc -p tsconfig.app.json --noEmit` | PASS |
| `npm run test` | PASS — 76/76 |
| `npm run build` | PASS |
| `git --no-pager diff --check` | PASS; informational LF/CRLF warnings only |
| Backend diff | EMPTY |
| Migration diff | EMPTY |
| Package/lockfile diff | EMPTY |
| Environment diff | EMPTY |

## 14. Block 06 files changed

- Modified: `frontend/src/pages/admin/AdminServicos.tsx`.
- Modified: `frontend/src/pages/admin/AdminServicos.test.tsx`.
- Modified: `frontend/src/shells/internal/InternalShell.tsx`.
- Modified: `frontend/src/shells/internal/InternalShell.test.tsx`.
- Modified: `frontend/src/shells/internal/internal-navigation.ts`.
- Added: `docs/frontend/BOANE_CONECTA_IMPLEMENTATION_BLOCK_06_REPORT.md`.

Other working-tree entries belong to preserved Blocks 01–05.

## 15. Preserved boundaries and behavior

- Services authorization frozen at Super Admin/Admin/Gestor read access.
- Backend, API contracts and transport DTO untouched.
- Services adapter and data behavior untouched.
- News and Projects untouched.
- Public frontend and CitizenShell untouched.
- F5 appointments, QueueTicket, ServiceSession, check-in, queue capacity and idempotency untouched.
- Migrations, dependencies, lockfiles and environment untouched.
- No Block 07 or other route family was started.

## 16. Risks

- Internal navigation remains presentation metadata and must never become the security authority.
- Admin/Super Admin mutation flows remain unimplemented on this page; future work must not infer them from role names alone.
- The working tree now contains six accumulated uncommitted blocks, increasing preservation and publication risk.
- Local and remote histories remain divergent; direct rebase/merge in this dirty tree remains unsafe.
- Long-content and 200% zoom behavior still require physical browser validation.

## 17. Visual QA status

**LOCAL VISUAL QA PENDING.** No Playwright, Chromium or other dependency was installed, and no screenshots were fabricated.

Required local widths:

- 360, 390, 430;
- 768, 1024;
- 1280, 1440.

Inspect navigation/drawer, current-route state, long titles/departments/descriptions, many fees and requirements, empty/error states, keyboard, Escape/focus return, 200% zoom and horizontal overflow.

## 18. Exact next-block recommendation

Do not begin another feature route immediately. The safest next bounded block should be **Block 07 — accumulated worktree preservation and clean publication rehearsal**:

1. export an exact Blocks 01–06 working-tree archive excluding generated artifacts and secrets;
2. inventory tracked and untracked files with checksums;
3. construct a separate clean worktree from remote `378fc31a`;
4. rehearse applying the accumulated delta and five missing canonical authorities without moving this branch;
5. compare resulting trees and run all gates;
6. report a commit/push plan, but perform publication only after explicit authorization.

If product implementation is prioritized instead, no new route family should start until the user completes local visual QA for Services and approves the result.
