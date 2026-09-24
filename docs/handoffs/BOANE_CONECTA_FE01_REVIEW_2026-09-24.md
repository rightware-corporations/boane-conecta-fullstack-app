# BOANE CONECTA — FE-01 Access & Truthfulness, review record

**Branch:** `feat/fe01-access-truthfulness-stabilization`
**Base:** `main@3b47e1b3609fc8b78ac73c9867d79f3c07255d91`
**Existing FE-01 HEAD before this work:** `9c2f778eae39bd72ff7c6d073a64f1deb805439d` (five commits, 0 behind main).
**Scope:** FE-01 only. No main merge, database change, or W02 work.

## Verified source and existing commits

The five pre-existing commits restricted nine citizen routes, redirected staff to `/admin`, removed unsupported demo credentials and the simulated public request lookup, and added initial role tests. The remote refs were checked on 24/09: `main@3b47e1b`, FE-01 branch `9c2f778`. The original checkout in `production.zip` was left intact; this work used an isolated worktree.

## FE-01 completion checklist

- [x] Frontend `/municipe/**` guards permit `municipe` only; routed denial tests for every internal role.
- [x] Staff and citizen defaults target their respective existing landing routes.
- [x] Remove demo credentials and fabricated public request results (five prior commits).
- [x] Safe post-login return to a known protected route matching the authenticated role; unknown or malformed targets fall back to role landing.
- [x] Remove login timing delay and use the role returned by the authenticated response.
- [x] Review `ProtectedRoute`, `PublicOnlyRoute`, `RoleGuard`, provider, service and token helpers; add routed tests for anonymous, citizen, internal roles and bootstrap loading.
- [x] Map all six backend `RoleName` values explicitly; reject unknown roles rather than treating them as citizens.
- [x] Reload/bootstrap refresh of expired access token, one controlled refresh on a protected 401, rotated token storage, and invalidation on failed refresh; no unbounded retries.
- [x] On logout or invalidation, clear authenticated UI and cached queries; guard against stale profile responses restoring a cleared session.
- [x] Frontend lint, TypeScript, full tests and build executed on this branch.
- [ ] Real citizen and staff login, reload, expiry, logout, and negative 401/403 checks against running QA with disposable identities. **NOT RUN:** no QA backend, Docker or approved accounts accessible in this execution environment.
- [ ] Confirm full backend role/ownership matrix in runtime. Frontend guards are presentation controls; backend remains authoritative. **NOT RUN** in this work.
- [ ] Browser keyboard, viewport and 200% zoom evidence. **NOT RUN** in this environment.
- [ ] PR/remote publication and CI run on this HEAD. Record actual result after push.

## RBAC presentation matrix

| Role | Citizen private | `/admin` | Return destination |
| --- | --- | --- | --- |
| Anonymous | Login | Login | Authenticated role's validated route or safe landing |
| CITIZEN (`municipe`) | Allowed | Denied | Existing citizen route only |
| SUPER_ADMIN, ADMIN | Denied | Allowed | Existing permitted internal route |
| MANAGER (`gestor`) | Denied | Allowed | Existing permitted internal route |
| EMPLOYEE (`funcionario`) | Denied | Allowed | Existing permitted internal route |
| EDITOR | Denied | Allowed | Existing permitted internal route |
| Unknown backend role | No authenticated session | No authenticated session | None |

The backend requires its own authorization and owner checks. The frontend role matrix must not be used as an authorization source.

## Gates and limits

Logs from the final run are delivered with the transfer package. `npm ci`, lint, TypeScript, Vitest and build must be attributed to the commit and timestamp in the final transfer report. Unit and routed tests use synthetic local session data; they do not demonstrate a real Spring Boot login or session revocation. The token implementation retains the inherited localStorage design, which merits a separate threat-model review; this work did not change persistence architecture.

**Acceptance state:** BLOCKED for FE-01 final acceptance until real QA auth flows, backend negatives and browser checks are evidenced. The code is prepared for review without starting W02.
