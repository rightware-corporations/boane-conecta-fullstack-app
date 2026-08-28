# Frontend F4 — Citizen Portal

## Scope

F4 migrates the authenticated citizen area to the canonical citizen shell and implements Home, Requests, Documents, Notifications and Account. F5 appointments/queue and F7 finance remain outside this phase.

## Delivered contracts

- `/api/v1/citizen/dashboard`: action-oriented citizen home composition.
- `/api/v1/citizen/requests` and `/{id}`: owned request list and citizen-safe detail timeline.
- `/api/v1/citizen/documents` and `/{id}/download`: owned document list, upload and authenticated download.
- `/api/v1/citizen/notifications`: safe notification projection, single-read and read-all commands.
- `/api/v1/citizen/me`: safe profile read/update; email, verification and authorization remain server-owned.

## Interaction and responsive behavior

Desktop uses a persistent citizen navigation and a contextual page header. Mobile uses the five-item canonical bottom navigation: Home, Requests, Services, Alerts and Account. Content is action-first, avoids decorative metrics and retains explicit loading, empty and error states.

## Security boundaries

All citizen endpoints require `ROLE_CITIZEN` and derive ownership from the authenticated principal. The UI never sends a citizen identifier. Request details expose only the citizen-safe timeline. Document downloads use the authenticated API client.

## Quality gates

Required before publication: ESLint, TypeScript no-emit, Vitest, production build, backend Maven tests on Java 21, and `git diff --check`.
