# BOANE CONECTA — Source Authority After B0

**Decision:** canonical continuation source prepared locally; remote authority remains pending because publication authentication failed.

## Canonical repository

`rightware-corporations/boane-conecta-fullstack-app`

## Published foundation authority

- Branch: `feat/fullstack-f5-appointments-queue`
- Verified remote SHA before B0: `378fc31a7539fd086e1268e4c3a0c1c07c7f0cb0`
- Role: immutable publication base and historical authority for F5.

## Intended canonical continuation authority

- Branch: `feat/fullstack-f5-internal-shell-convergence`
- Role after successful future publication: authoritative source for the reconstructed Baseline V2, Blocks 01–11 records, and all approved continuation after B0.
- Local prepared branch only: it is not remote authority until a normal authenticated push and remote tree verification succeed.

## Baseline V2

- Incorporated: yes.
- Manifest: `docs/handoffs/BOANE_CONECTA_RECONSTRUCTED_BASELINE_V2_MANIFEST.txt`.
- Manifest SHA-256: `ea1d6a584382492f225888acd845924795251c74f9912757a8dbac10af87dd18`.
- Approved paths: 33.
- Verification before publication: 33 MATCH, 0 MISMATCH, 0 MISSING.
- Preservation ZIP SHA-256: `534d3a80d3b43e6274467cd29dad267a7e7d33ebf83e72200a4e94e0551b9bf6`.

## Authority boundaries

- `master`: untouched by B0; not the continuation authority.
- Remote F5 branch: untouched by B0; base authority only.
- Dirty recovery worktree at local `88e4d852`: preserved; no longer the continuation publication authority after remote verification.
- Old lost unpublished SHAs `bb46e4f`, `05c4e06`, `44babfa`, `6ad38a2`: historical references only and not required.
- Backend source, migrations and dependencies: unchanged by B0.

Publication attempt from this environment failed before transfer because HTTPS GitHub credentials were unavailable. Until a successful normal push is verified, remote F5 remains the only published development authority. Future work must revalidate the remote before writing. No implementation may infer current HEAD from this document alone.
