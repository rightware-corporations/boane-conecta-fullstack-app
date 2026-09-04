# BOANE CONECTA — B0 Source Authority Publication Report

## 1. Verdict scope

B0 reconstructs and publishes the approved Baseline V2 from the live F5 remote base. It introduces no feature, backend source, migration, dependency, environment or redesign change.

## 2. Remote verification

- Origin: `https://github.com/rightware-corporations/boane-conecta-fullstack-app.git`.
- Default branch: `master`.
- `origin/master`: `4ff50eb6359328589eea6be2cf3e4b72b1a70364`.
- Required F5 base: `378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0`.
- Live F5 result before worktree creation: exact match.
- Target branch collision before B0: none locally or remotely.

## 3. Preservation evidence

| Artifact | Expected SHA-256 | Result |
|---|---|---|
| Baseline V2 ZIP | `534d3a80d3b43e6274467cd29dad267a7e7d33ebf83e72200a4e94e0551b9bf6` | PASS |
| Manifest V2 | `ea1d6a584382492f225888acd845924795251c74f9912757a8dbac10af87dd18` | PASS |
| Baseline V2 report | `8bbf4745ac2fcc4444b81b7aa7fc5fc08f45089aa49c025a7f07009dcf61f4f9` | PASS |

ZIP entries: 828. Manifest classification: 22 `HISTORICAL_MATCH`, 11 `RECONSTRUCTED_V2`, 0 missing.

## 4. Manifest verification

The 33 paths were checked in the recovery source before publication and again after overlay in the clean worktree.

- MATCH: 33
- MISMATCH: 0
- MISSING: 0

Manifest V2, not Manifest V1, is the byte authority.

## 5. Clean publication worktree

- Path: `/workspace/scratch/4da30144c903/boane-b0-publication`.
- Created from: `origin/feat/fullstack-f5-appointments-queue`.
- Starting HEAD: `378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0`.
- Branch: `feat/fullstack-f5-internal-shell-convergence`.
- The dirty source worktree was not reset, cleaned, checked out over, rebased, merged or committed.

## 6. Overlay inventory

The overlay included exactly the 33 Manifest V2 paths, then approved continuation evidence: the reconstruction report, full product audit, Block 11 runtime report, local integrated runbook, fixture catalogue, Backend Fullstack Audit V1, Manifest V2 and its report. B0 adds this authority record and publication report.

No generated `dist`, `node_modules`, `target`, coverage, cache, local `.env`, secret or IDE metadata was staged.

## 7. Backend and dependency preservation

Diff against `378fc31a`:

- `backend/`: EMPTY.
- `backend/src/main/resources/db/migration/`: EMPTY.
- `backend/pom.xml`: EMPTY.
- `frontend/package.json`: EMPTY.
- `frontend/package-lock.json`: EMPTY.
- environment files: EMPTY.
- dependency upgrades: none.

## 8. Automated gates

| Gate | Result |
|---|---|
| `npm ci` | PASS — 498 packages installed from lockfile |
| `npm run lint` | PASS |
| `npx tsc -p tsconfig.app.json --noEmit` | PASS |
| `npm run test` | PASS — 23 files, 76/76 tests |
| `npm run build` | PASS — 2242 modules transformed |
| Shell-focused tests | PASS — 22/22 |
| Services-focused tests | PASS — 18/18 |
| Manifest V2 | PASS — 33/33 |

React Router future flags, npm proxy/deprecation and Browserslist age messages were informational. No dependency was changed.

## 9. Diff-check exception

Frontend source changes pass whitespace checking. A repository-wide `git diff --check 378fc31a..HEAD` reports pre-existing trailing spaces/newline-at-EOF in approved Markdown evidence, including Blocks 01–03 and audit/runbook files.

These bytes are part of the approved, hash-authoritative preservation set. Normalizing them would violate Manifest V2 and preservation requirements. They were therefore preserved deliberately. This is a documented archival-text exception, not application code drift.

## 10. Logical commits before authority/report commit

| Commit | Message |
|---|---|
| `f67fa39` | `docs(project): add canonical backend and mobile authorities` |
| `e6cf78f` | `feat(frontend): establish internal operations shell` |
| `8bb74d1` | `fix(frontend): align admin services contract authorization and shell` |
| `2d2edbf` | `docs(frontend): record internal shell implementation and recovery` |
| `7215248` | `docs(project): record reconstructed publication baseline` |

The final governance commit containing this report is intentionally additional. Exact full SHAs are available in Git history; lost historical publication SHAs were not reproduced.

## 11. Source authority decision

After successful normal push and remote tree verification:

- F5 remains the historical/base authority at `378fc31a`.
- `feat/fullstack-f5-internal-shell-convergence` becomes the canonical continuation authority.
- `master` remains untouched.
- the original dirty recovery worktree remains preserved.

## 12. Remaining risks

- Backend runtime remains unexecuted in this sandbox, as recorded by Block 11.
- PostgreSQL/Testcontainers certification belongs to B1/B2, not B0.
- Visual QA evidence remains a human/local responsibility where previously recorded.
- Documentation whitespace is intentionally preserved for byte integrity.
- GitHub PR state remains outside B0; no PR or merge is authorized.

## 13. B1 readiness

**READY only after remote branch/HEAD/tree verification succeeds.** B1 must begin by fetching and revalidating the published continuation branch. B1 may establish the reproducible runtime but must not silently expand feature scope.
