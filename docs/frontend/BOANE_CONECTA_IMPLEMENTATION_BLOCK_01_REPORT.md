# BOANE CONECTA — IMPLEMENTATION BLOCK 01 REPORT

## Foundations + Internal Shell Convergence

**Scope:** Controlled adapter phase — `/admin/filas` + `/admin/agenda` only  
**Date:** 2026-08-31  
**Branch:** `feat/fullstack-f5-appointments-queue`  
**Base/HEAD before implementation:** `88e4d852f374169e41b778d21a4076322f5062fb`  
**Status:** Implemented locally; not committed, pushed or merged

# 1. Baseline

- Working tree was clean before implementation.
- Branch and expected HEAD matched the approved prompt.
- npm was retained as the verified execution path because `package-lock.json` exists and all baseline commands pass with npm.
- Existing Bun lockfiles were not modified.
- Baseline gates:
  - ESLint: PASS
  - TypeScript: PASS
  - Vitest: PASS — 16 files / 43 tests
  - Vite production build: PASS

# 2. Files Audited

Mandatory authorities were rechecked, with the audit treated as implementation reality:

- Wireframe Master Index and Foundations
- PASS 09 — Staff Operations Foundation
- PASS 12 — System Administration
- PASS 13 — Role Landing / Internal IA
- PASS 14 — Global Consolidation
- Contract Gap Register
- Frontend Implementation Execution Plan
- Master QA Checklist
- `BOANE_CONECTA_PRE_IMPLEMENTATION_AUDIT_REPORT.md`

Implementation files audited:

- `frontend/src/components/admin/AdminLayout.tsx`
- `frontend/src/components/admin/AdminSidebar.tsx`
- `frontend/src/shells/admin/AdminShell.tsx`
- `frontend/src/shells/executive/ExecutiveShell.tsx`
- `frontend/src/components/auth/AppLayoutByRole.tsx`
- route guards and auth/session hooks
- Queue and appointment APIs/types
- `/admin/filas` and `/admin/agenda`

# 3. Shell Architecture Before

| Classification | Finding |
|---|---|
| CURRENTLY WIRED | `AdminLayout` + `AdminSidebar` |
| UNWIRED | `AdminShell`, `ExecutiveShell` |
| DUPLICATED | headers, navigation, user identity/logout, responsive sidebar and auth checks |
| REUSABLE | SkipLink, SystemAlertRegion, Radix Sheet/Dropdown, semantic tokens, current auth context |
| MIGRATION RISK | changing `AdminLayout` globally would alter placeholder/blocked routes and unresolved RBAC presentation |

# 4. Implementation Plan Executed

1. Kept `AdminLayout` as the compatibility boundary.
2. Added an explicit `shell="operations"` opt-in mode.
3. Built `InternalShell` from existing primitives and semantic tokens.
4. Added presentation-only metadata for the two supported operations routes.
5. Migrated Filas first, preserving all queue commands and polling.
6. Migrated Agenda second, preserving appointment/check-in APIs.
7. Added shared states, pt-MZ formatting and focused tests.
8. Ran all gates and reviewed the complete diff.

# 5. InternalShell Foundation

The new shell provides:

- SkipLink;
- SystemAlertRegion;
- semantic `main`;
- fixed operational sidebar at desktop;
- accessible Radix drawer below desktop;
- operational page header;
- role label and user context;
- presentation navigation groups;
- accessible user dropdown;
- logout behavior from the existing auth context;
- route-change heading focus;
- 1440px operational content ceiling;
- responsive gutters and density.

`AdminShell` and `ExecutiveShell` were not deleted or repurposed. `ExecutiveShell` was not promoted into a fifth canonical shell.

# 6. Route Metadata / Navigation

`internal-navigation.ts` defines only:

- `/admin/filas`
- `/admin/agenda`

Metadata includes route, label, group, icon, presentation roles and order. It is explicitly documented as presentation metadata, not authorization. It mirrors the already confirmed route guards for `super_admin`, `admin`, `funcionario` and `gestor`, without inventing new access.

Editors and citizens receive no operations-navigation items from this metadata.

# 7. Shared State Primitives

Added a restrained operational state family:

- `OperationalLoading`
- `OperationalEmpty`
- `OperationalError`
- `OperationalPartialError`
- `OperationalForbidden`
- `OperationalConflict`
- `ActionRequired`

The implementation shares one private frame while retaining semantic exported components. It avoids both duplicated near-identical states and one public mega-component with ambiguous semantics.

# 8. Formatting Foundations

Added centralized functions for:

- date;
- time;
- date + time;
- operational age;
- MZN currency.

Formatting uses `pt-MZ` and explicitly fixes the operational timezone to `Africa/Maputo`, preventing server/browser timezone drift. Only Filas and Agenda were migrated in this block.

# 9. `/admin/filas` Migration

Preserved:

- snapshot query and polling;
- queue and desk selection;
- desk ownership enforcement;
- open/close desk;
- call next with existing idempotency behavior;
- recall;
- start service;
- complete;
- no-show;
- transfer;
- current APIs and DTOs;
- backend-confirmed mutation behavior.

Improved:

- opted into `InternalShell`;
- shared loading/error/empty states;
- responsive header hierarchy;
- compact operational summary strip;
- denser waiting rows;
- centralized Maputo time and operational age;
- retained localized queue/desk state labels;
- no optimistic success or WebSocket assumption.

# 10. `/admin/agenda` Migration

Preserved:

- scoped appointment list endpoint;
- polling behavior;
- assisted check-in endpoint and idempotency behavior;
- backend-confirmed mutation before refresh;
- all appointment domain contracts.

Improved:

- opted into the same `InternalShell`;
- chronological list as the responsive base;
- shared loading/error/empty states;
- localized human-readable status labels;
- explicit date/time columns with Maputo timezone;
- compact 64px operational rows;
- mobile full-width check-in action and desktop inline action;
- no compressed month/week calendar.

# 11. Responsive Validation

Implemented contract:

| Width family | Behavior |
|---|---|
| 1280–1440 | Fixed 240px sidebar, full operational workspace |
| 1024 | Fixed sidebar remains viable; compact content gutters |
| 768 | Drawer navigation, single-column operational flow |
| 360/390/430 | Drawer, essential task interface, wrapping headers/actions and chronological rows |

Automated component validation confirms the drawer opens as an accessible dialog. Static review found no forced desktop table or fixed content width in either migrated route.

Screenshot evidence at 360/390/430/768/1024/1280/1440 was not captured because this environment did not provide an authenticated browser/backend fixture. Visual viewport QA remains required before release; no claim of visual completion is made.

# 12. Accessibility Improvements

- Internal routes now receive a SkipLink.
- `main-content` is a stable landmark/target.
- Route changes focus the page `h1` without scrolling.
- Current navigation uses `aria-current="page"`.
- Mobile navigation is an accessible Sheet/Dialog with title and description.
- User actions are keyboard-operable through Radix DropdownMenu.
- Icon-only menu control has an accessible label.
- Loading state uses `role="status"` and hidden text.
- States contain text and icons, not color alone.
- Existing focus-visible and reduced-motion foundations are preserved.

This is an improvement toward WCAG 2.2 AA, not a certification.

# 13. Tests Added/Updated

Added:

- `InternalShell.test.tsx`
  - current-route active state;
  - SkipLink/main contract;
  - responsive drawer behavior;
  - no operations metadata for unsupported roles.
- `AdminLayout.test.tsx`
  - compatibility adapter activates InternalShell only on opt-in.
- `formatters.test.ts`
  - Maputo time;
  - safe temporal fallback;
  - operational age;
  - currency fallback.

Final suite: **19 test files / 50 tests passing**.

# 14. Gates Executed

| Gate | Result |
|---|---|
| `npm run lint` | PASS |
| `npx tsc -p tsconfig.app.json --noEmit` | PASS |
| `npm run test` | PASS — 50/50 |
| `npm run build` | PASS |
| `git diff --check` | PASS |
| Backend diff | EMPTY |
| Package/lockfile diff | EMPTY |
| Migration diff | EMPTY |

Known non-blocking warnings remain: React Router v7 future flags, stale Browserslist dataset and local npm proxy warning. No update was performed.

# 15. Files Changed

Modified:

- `frontend/src/components/admin/AdminLayout.tsx`
- `frontend/src/pages/admin/AdminFilas.tsx`
- `frontend/src/pages/admin/AdminAgenda.tsx`

Added:

- `frontend/src/shells/internal/InternalShell.tsx`
- `frontend/src/shells/internal/internal-navigation.ts`
- `frontend/src/shells/internal/InternalShell.test.tsx`
- `frontend/src/design-system/components/operational-state.tsx`
- `frontend/src/lib/formatters.ts`
- `frontend/src/lib/formatters.test.ts`
- `frontend/src/components/admin/AdminLayout.test.tsx`
- `docs/frontend/BOANE_CONECTA_IMPLEMENTATION_BLOCK_01_REPORT.md`

# 16. Preserved Behavior

- No backend code changed.
- No queue or appointment state machine changed.
- No endpoint or DTO changed.
- No permission or role guard changed.
- No polling interval changed.
- No mutation became optimistic.
- No mock/fake data was introduced.
- No route was removed.
- Legacy shell files remain.
- Other internal routes remain on legacy `AdminLayout`.
- No dependency, lockfile, migration or environment file changed.

# 17. Remaining Gaps

- CG-001 authoritative full RBAC matrix remains open.
- Internal navigation contains only the two approved operations routes.
- `/admin` role-aware landing is not migrated.
- Staff requests/workbench remain blocked.
- Queue/Agenda visual screenshot matrix remains outstanding.
- Shared state primitives are introduced but not repository-wide migrated.
- Full route announcement/assistive-technology QA remains required.
- 200% zoom, real keyboard traversal and contrast require browser QA.

# 18. Risks / Regressions

No functional regression was detected by lint, types, tests or build.

Residual risks:

- CSS responsive behavior still needs real viewport screenshots.
- `AdminLayout` now bundles both legacy and InternalShell dependencies; route splitting limits impact, but future migration should avoid uncontrolled bundle growth.
- Navigation metadata duplicates confirmed presentation roles from route guards; it must remain presentation-only until CG-001 is resolved.
- Current role strings are frontend mappings of backend roles and should not become a second permission system.

# 19. Recommended Next Block

Do not start Staff Requests yet.

Recommended next action is **Block 01 QA Closure**:

1. run authenticated browser QA for Filas and Agenda;
2. capture 360/390/430/768/1024/1280/1440 screenshots;
3. verify drawer, long labels, action wrapping and queue mutations against a safe test backend;
4. perform keyboard and screen-reader smoke checks;
5. repair only defects attributable to Block 01;
6. review and approve before selecting Block 02.

# 20. Final Assessment

**BLOCK 01 IMPLEMENTATION: PASS WITH VISUAL QA PENDING**

The controlled adapter architecture is established and validated by static and automated gates. Filas and Agenda now share the InternalShell foundation without altering backend behavior or expanding authorization. The repository remains uncommitted and unpushed as required.

Stop condition respected: no Staff Requests, payments, licences, content publishing, user administration or public lookup work was started.
