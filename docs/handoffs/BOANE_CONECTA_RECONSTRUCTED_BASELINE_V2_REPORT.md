# BOANE CONECTA — RECONSTRUCTED BASELINE V2 REPORT

## 1. Decision

**BOANE CONECTA — RECONSTRUCTED WORKTREE BASELINE V2**  
**STATUS: APPROVED FOR LOCAL VISUAL QA AND CONTROLLED PUBLICATION**

This declaration approves the reconstructed worktree as the new byte-integrity baseline for transfer and review. It does not authorize publication, commit, push, merge or any change to `master`.

Publication remains pending:

1. download and external preservation of the V2 archive;
2. local Windows visual QA;
3. explicit user authorization for the publication block.

## 2. Historical-loss summary

The historical Blocks 01–06 result originally achieved 33/33 matches against Manifest V1 and 76/76 frontend tests. A later sandbox snapshot restoration removed the unpublished Git objects and the original Block 07 archive.

Permanently abandoned commit identities:

- `bb46e4f`;
- `05c4e06`;
- `44babfa`;
- `6ad38a2`.

The old hashes remain historical evidence only. This block does not claim that reconstructed files reproduce the lost bytes.

## 3. Source repository state

- Repository: `rightware-corporations/boane-conecta-fullstack-app`.
- Source path: `/workspace/scratch/4da30144c903/usb-codebase/repo`.
- Branch: `feat/fullstack-f5-appointments-queue`.
- Source HEAD: `88e4d852f374169e41b778d21a4076322f5062fb`.
- Remote feature baseline: `378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0`.
- Staged files: none.
- Source working tree remains intentionally uncommitted.
- No reset, clean, rebase, merge, checkout-over, commit or push was performed.

## 4. Preservation export

Archive:

`/workspace/scratch/4da30144c903/BOANE_CONECTA_RECONSTRUCTED_BLOCKS_01_06_BASELINE_V2.zip`

| Property | Result |
| --- | --- |
| SHA-256 | `534d3a80d3b43e6274467cd29dad267a7e7d33ebf83e72200a4e94e0551b9bf6` |
| Size | 2,010,307 bytes |
| Entries | 828 |
| ZIP integrity | PASS |
| `.git` | Excluded |
| `node_modules`, `dist`, `target`, caches, coverage | Excluded |
| Local `.env`, secrets and credentials | Excluded |
| Versioned `.env.example` | Preserved |

The archive was created before semantic review and before adding the V2 Manifest/report, preserving the exact recovery candidate presented to Block 09. No semantic code repair was required afterward.

All 33 Manifest V2 paths were independently read from the ZIP and rehashed: **33 MATCH / 0 MISMATCH / 0 MISSING**.

## 5. Manifest V1 comparison

Historical Manifest V1:

- 33 paths;
- 22 current historical matches;
- 11 reconstructed paths;
- 0 missing paths;
- Manifest V1 SHA-256: `1d27eb0bfc15210aa91d787daac5c1b0b81bec8b49e9d089477e8fa58f8a3c2e`.

Manifest V1 remains immutable historical evidence. It is not the current transfer authority.

## 6. Historical matches

Twenty-two files remain byte-identical to Manifest V1. These include:

- reports 01–06;
- AdminLayout and its test;
- operational-state primitives;
- `useAuth.tsx`;
- formatters and tests;
- Admin Agenda and Filas;
- Dashboard and its test;
- `InternalShell.tsx`;
- five canonical backend/mobile authorities.

The complete list and hashes are recorded in Manifest V2.

## 7. Reconstructed paths

The eleven reconstructed files are explicitly accepted under V2:

1. `frontend/src/App.tsx`;
2. `frontend/src/features/admin-services/admin-services.api.test.ts`;
3. `frontend/src/features/admin-services/admin-services.api.ts`;
4. `frontend/src/features/admin-services/admin-services.authorization.test.ts`;
5. `frontend/src/features/admin-services/admin-services.authorization.ts`;
6. `frontend/src/features/admin-services/types.ts`;
7. `frontend/src/hooks/useUserRole.tsx`;
8. `frontend/src/pages/admin/AdminServicos.test.tsx`;
9. `frontend/src/pages/admin/AdminServicos.tsx`;
10. `frontend/src/shells/internal/InternalShell.test.tsx`;
11. `frontend/src/shells/internal/internal-navigation.ts`.

## 8. Semantic review per reconstructed file

| File | Purpose and expected behavior | Current evidence | Verdict |
| --- | --- | --- | --- |
| `App.tsx` | Protect `/admin/servicos` with aligned read roles | Actual route imports and uses the shared `ADMIN_SERVICES_READ_ROLES`; no local duplicate list | **APPROVED** |
| `admin-services.api.test.ts` | Prove endpoint, adapter, optional fields, nested records and errors | Five focused tests pass; verifies `/admin/services`, unsuccessful envelope and transport failure | **APPROVED** |
| `admin-services.api.ts` | Own the GET transport boundary and pure adapter | Uses existing API base path, explicit envelope, pure DTO→presentation mapping and Portuguese statuses | **APPROVED** |
| `admin-services.authorization.test.ts` | Prove exact read matrix | Seven tests pass for allowed, blocked, null and exact role set | **APPROVED** |
| `admin-services.authorization.ts` | Single frontend read-role mirror | Exports only `super_admin`, `admin`, `gestor` and a pure role predicate | **APPROVED** |
| `types.ts` | Separate transport DTOs from presentation models | Represents all backend fields, nested requirements/fees and status union; no `any` or legacy DTO | **APPROVED** |
| `useUserRole.tsx` | Expose read versus manage presentation capability | `canReadServices` is independent of `canManageServices`; existing permissions remain intact | **APPROVED** |
| `AdminServicos.test.tsx` | Prove operational UX and read-only behavior | Six tests pass for loading, real data, optional fields, empty, error/retry and no mutation controls | **APPROVED** |
| `AdminServicos.tsx` | Render real Services data inside InternalShell | Uses `shell="operations"`; real count/data; loading, empty, error/retry; requirements, fees and pt-MZ formatting; no fake controls | **APPROVED** |
| `InternalShell.test.tsx` | Prove navigation visibility/current state/drawer | Nine tests pass; Services visibility and exclusion matrix, current route and grouping are covered | **APPROVED** |
| `internal-navigation.ts` | Present approved internal IA without becoming RBAC authority | Imports shared Services role source; adds only real Services route under Conteúdo; no API/domain dependency | **APPROVED** |

No semantic repair was required. Consequently, the hashes archived before review remain the V2 code hashes.

## 9. Services contract validation

Backend evidence confirms:

- controller base path: `/api/v1/admin/services`;
- frontend API client base path already supplies `/api/v1`;
- frontend request path: `/admin/services`;
- list response: `ApiResponse<List<MunicipalServiceResponse>>`.

Transport fields represented:

- `id`, `departmentId`, `departmentName`;
- `title`, `slug`, `description`, `processingTime`, `status`;
- `requirements`, `fees`;
- `createdAt`, `updatedAt`.

Requirements preserve `id`, `serviceId`, `title`, `description`, `required`, `createdAt`, `updatedAt`. Fees preserve `id`, `serviceId`, `title`, `amount`, `currency`, `createdAt`, `updatedAt`. Status is constrained to `DRAFT`, `PUBLISHED`, `ARCHIVED`.

Validated architecture:

`transport DTO → pure adapter → presentation model → UI`

No `any`, legacy `name/category/price/duration` DTO, fake compatibility property or fabricated record was found.

## 10. Authorization validation

Confirmed role normalization in the existing authentication service:

- `SUPER_ADMIN → super_admin`;
- `ADMIN → admin`;
- `MANAGER → gestor`;
- `EMPLOYEE → funcionario`;
- `EDITOR → editor`;
- citizen fallback → `municipe`.

Administrative Services read access:

- allowed: Super Admin, Admin, Gestor;
- blocked: Funcionario, Editor, Munícipe and unauthenticated users.

Backend `@PreAuthorize` for list access authorizes `SUPER_ADMIN`, `ADMIN`, `MANAGER`. Route guard and internal navigation reuse the same frontend constant. Gestor receives no create, edit, publish, archive or delete control. Backend remains definitive authority.

## 11. InternalShell validation

Final information architecture:

- Área interna
  - Início interno
- Operações
  - Filas
  - Agenda
- Conteúdo
  - Serviços

Services uses `/admin/servicos`, appears only for Super Admin/Admin/Gestor and receives the correct `aria-current="page"` state. No News, Projects, Users, Work Queue, Staff Requests, Case Workspace, Finance or F6 destination was introduced.

The shell owns presentation and context only. It does not import the Services API, transport DTO or domain behavior.

## 12. Accessibility review

Structurally verified:

- SkipLink to `#main-content`;
- shell-owned single H1;
- main landmark;
- route-heading focus on navigation;
- `aria-current`;
- accessible compact navigation dialog;
- Radix Escape and focus-return foundations;
- textual status labels;
- accessible retry control;
- semantic lists, headings, `dl`, `dt` and `dd`;
- inherited focus-visible and reduced-motion foundations;
- no color-only Services state.

Physical keyboard behavior, focus return, 200% zoom and viewport rendering remain pending local visual QA.

## 13. Automated tests

| Test scope | Result |
| --- | --- |
| Test files | 23 passed |
| Tests | **76/76 passed** |
| Removed tests | None |
| Services API tests | 5 passed |
| Services authorization tests | 7 passed |
| AdminServicos tests | 6 passed |
| InternalShell tests | 9 passed |

React Router future-flag notices were informational and non-failing.

## 14. Full gates

| Gate | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npx tsc -p tsconfig.app.json --noEmit` | PASS |
| `npm run test` | PASS — 76/76 |
| `npm run build` | PASS — 2242 modules transformed |
| `git --no-pager diff --check` | PASS; informational LF/CRLF warnings only |

The npm proxy notice, React Router future notices and outdated Browserslist dataset notice were not acted on because dependency/toolchain updates are outside scope.

## 15. Protected-boundary integrity

| Boundary | Result |
| --- | --- |
| Backend diff | EMPTY |
| Migration diff | EMPTY |
| `frontend/package.json` diff | EMPTY |
| `frontend/package-lock.json` diff | EMPTY |
| Other lockfiles | EMPTY |
| Environment drift | NONE identified |
| Dependency updates | NONE |

No public frontend, CitizenShell, News, Projects, F5 appointment/queue/check-in/idempotency behavior or backend source was modified by Block 09.

## 16. Manifest V2

Path:

`docs/handoffs/BOANE_CONECTA_RECONSTRUCTED_BASELINE_V2_MANIFEST.txt`

- Entries: 33;
- `HISTORICAL_MATCH`: 22;
- `RECONSTRUCTED_V2`: 11;
- missing: 0;
- SHA-256: `ea1d6a584382492f225888acd845924795251c74f9912757a8dbac10af87dd18`;
- size: 4,871 bytes.

Manifest V2 is the byte-integrity authority for future transfers of this reconstructed baseline. Manifest V1 remains historical evidence.

## 17. Local visual-QA checklist

**Status: PENDING USER EXECUTION ON WINDOWS.** No screenshot or browser result was fabricated.

Test widths: 360, 390, 430, 768, 1024, 1280 and 1440 pixels.

Routes:

- `/admin`;
- `/admin/filas`;
- `/admin/agenda`;
- `/admin/servicos`.

For each width verify:

- InternalShell layout, content width and gutters;
- desktop navigation versus compact drawer;
- current-route indication;
- drawer open/close;
- no horizontal overflow;
- no clipped headings, labels or actions;
- long service title, department and description wrapping;
- many requirements and many fees;
- loading, empty and error/retry states;
- Gestor sees Services but no mutation control;
- Funcionario/Editor/Munícipe do not see Services destination;
- keyboard Tab and Shift+Tab order;
- Escape closes the drawer/menu;
- focus returns to the trigger;
- 200% zoom remains operable and readable;
- visible focus and textual status remain clear.

Record route, viewport, role, result and evidence for every failure. Do not mark visual QA PASS until all blocking defects are repaired and retested.

## 18. Publication eligibility

The reconstructed baseline is technically eligible for a future controlled publication rehearsal because semantic review and all automated gates pass.

It is **not yet authorized for push**. Publication requires successful local visual QA and a new explicit user instruction.

Future publication must use a separate clean worktree from:

`origin/feat/fullstack-f5-appointments-queue@378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0`

and target a new branch without force push or modification of `master`.

## 19. Remaining risks

- Visual behavior at the required widths and 200% zoom is not yet evidenced.
- The source checkout remains a dirty preservation tree and must not be reset or cleaned.
- The archive must be downloaded and copied to durable external storage before publication work.
- Histories at local `88e4d852` and remote `378fc31a` remain divergent; direct merge/rebase of the dirty source remains unsafe.
- Manifest V2/report were created after the preservation snapshot and must be downloaded as companion artefacts.
- Backend runtime gates were not part of this frontend preservation block; backend byte/diff integrity remains unchanged.

## 20. Exact next step

1. Download the V2 ZIP, Manifest V2 and this report.
2. Copy all three artefacts to the Windows backup drive.
3. Verify their SHA-256 values locally.
4. Run the visual-QA checklist and preserve evidence.
5. Report any defect for a bounded repair block.
6. If QA passes, explicitly authorize a clean publication block.

Do not begin a new feature route, Block 10 implementation or publication before those steps are complete.
