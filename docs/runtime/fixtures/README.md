# Runtime fixture catalogue

No real runtime JSON fixture was captured during Block 11.

The audited sandbox could not start the backend because Maven, Maven Wrapper, Docker/Podman and PostgreSQL were unavailable, and the installed JDK was 17 while the project requires JDK 21.

Fixtures must be captured only from a disposable local integration database after successful Flyway V1–V19 startup. Values must then be sanitized without changing contract structure. Never place tokens, passwords, secret keys, production identifiers or real personal data in this directory.

Expected future catalogue:

- `auth-login-success.example.json`
- `auth-me-admin.example.json`
- `public-services.example.json`
- `admin-services.example.json`
- `citizen-dashboard.example.json`
- `citizen-requests.example.json`
- `admin-appointments.example.json`
- `queue-snapshot.example.json`
- sanitized 400, 401, 403 and 404 error examples

