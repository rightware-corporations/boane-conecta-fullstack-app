# Security Architecture

The backend uses Spring Security with stateless JWT access tokens, persisted refresh tokens, BCrypt password hashing, and database-backed roles.

## Authentication Components

- `SecurityConfig` defines the HTTP security rules, stateless sessions, CORS, CSRF strategy, and filter order.
- `JwtService` creates and validates signed access tokens.
- `JwtAuthenticationFilter` reads `Authorization: Bearer <token>` and restores the authenticated user from the database.
- `CustomUserDetailsService` loads users by email and maps roles to `ROLE_*` authorities.
- `RefreshTokenService` creates, rotates, validates, and revokes refresh tokens.
- `AuthService` owns registration, login, refresh, logout, current-user, and password-change workflows.

JWT access tokens contain:

- `userId`
- `email`
- `roles`
- issued-at and expiration timestamps

The signing key comes from `JWT_SECRET`. Production deployments must provide a random secret of at least 256 bits.

## Access And Refresh Flow

1. The client sends email and password to `POST /api/v1/auth/login`.
2. Spring Security verifies the BCrypt password and account status.
3. The backend returns a short-lived access token and a longer-lived refresh token.
4. The client sends the access token in the `Authorization` header.
5. When the access token expires, the client sends the refresh token to `POST /api/v1/auth/refresh`.
6. A successful refresh revokes the old refresh token and returns a rotated replacement.
7. Logout revokes the supplied refresh token. Changing a password revokes all active refresh tokens for that user.

Only a SHA-256 hash of each refresh token is stored in `refresh_tokens`; raw refresh tokens exist only in the API response and client storage.

## Account Status

- `ACTIVE`: authentication allowed.
- `INACTIVE`: authentication blocked.
- `SUSPENDED`: authentication blocked as a locked account.
- `PENDING`: authentication blocked until activated.

The JWT filter also checks the current database account status, so suspending a user blocks subsequent protected requests even when an access token has not yet expired.

## Route Rules

Public:

- `GET /api/v1/health`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/public/**`
- CORS preflight requests

Protected:

- `/api/v1/citizen/**` requires `CITIZEN`.
- `/api/v1/admin/**` requires one of `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `EDITOR`, or `EMPLOYEE`.
- All remaining routes require authentication.

CSRF is disabled because the API is stateless and authenticates with bearer tokens, not server sessions. CORS allows the origin configured by `FRONTEND_URL`.

## Bootstrap Administrator

At startup, `AdminBootstrap` idempotently ensures all `RoleName` values exist and creates or repairs the default administrator:

- Email: `admin@boane.gov.mz`
- Name: `System Administrator`
- Role: `SUPER_ADMIN`
- Development password: `ChangeMe123!`

Set `ADMIN_BOOTSTRAP_PASSWORD` before the first production startup and change the password immediately after provisioning. Startup logs a warning while the development password remains configured.

## Password Policy

Registration and password changes require 8 to 128 characters with at least one uppercase letter, lowercase letter, number, and special character. Passwords are stored only as BCrypt hashes.

## Error Responses

Controller validation, authentication failures, access denial, conflicts, missing resources, and unexpected failures use the standard `ApiResponse` structure. Security-filter failures are rendered as JSON by dedicated authentication and access-denied handlers.

## Future OAuth

The user and role model can accept identities from a future OAuth provider without changing authorization rules. No OAuth provider or external authentication service is implemented in this phase.

## Known Security Follow-Ups

- Add rate limiting for login, registration, and refresh endpoints.
- Record authentication events in the existing `audit_logs` table.
- Replace the bootstrap password after first deployment and manage secrets through the deployment platform.
- Add key rotation/versioning if multiple signing keys become necessary.
