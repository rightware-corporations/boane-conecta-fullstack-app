# BOANE CONECTA — Source audit and continuation, 23 September 2026

## Verified baseline

Canonical repository: `rightware-corporations/boane-conecta-fullstack-app`.
Continuation commit: `e3cbf3d2da1fedad6c9ccd2006d3e686e2f3eb6e`.
Tree: `58a991c951e41ac6a2ac46fc23c2801a48e249ee`.
Git tree: 636 tracked paths. Flyway migrations: V1–V19. Docker Compose declares PostgreSQL, MinIO, ClamAV, and backend. The backend contains object-storage/scanner integration and Spring Actuator / Prometheus dependencies. These are source observations; integrated runtime remains unverified.

The separate QA-V2 ZIP contains the same 627 comparable project paths as the production ZIP after CRLF/LF normalization. Production additionally carries nine handoff/runtime documents. The original production worktree showed 431 modified files solely due to line endings; no functional delta was identified. Do not stage those changes.

## Divergent engineering branch

`engineer/gh-audit-and-stabilization@e9b902cc4b6eb62775b3e1905dbdb7c63d4afffc` has one exclusive commit. Its Lombok pin (`1.18.38`), explicit dependency version, compiler release 21, and Lombok annotation processor version are already present in the continuation commit. The commit also changes formatting. Preserve the branch in the Git bundle; do not merge it wholesale solely to duplicate its fix. Backend compilation has not been proven here because the available environment has Java 17 and no Maven.

## Gates and limits

See the delivery report for current command outputs. Backend build, database migrations, storage/scanner integration, and health checks must be tested on Java 21 with Maven and disposable PostgreSQL/MinIO/ClamAV before any production claim. The historical frontend result of 76 passing tests does not replace current test execution.

The earlier third-party handoff asserted 357 tracked paths, only migrations V1–V8, and no MinIO/ClamAV. Those assertions contradict this Git tree and must not be repeated.

## Continuation

Academic scope remains subject to supervisor validation. Implementation sequence: WF-01 → CR-01 → FE-01 → FE-03 → FE-04. Confirm actual contracts and authorization before extending the citizen request journey. Preserve divergent refs and verify remote state before changing default branches or deleting any remote branch.
