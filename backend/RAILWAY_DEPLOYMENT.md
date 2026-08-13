# Railway Backend Deployment

## Service

Deploy the `backend` directory as the Railway service root.

## Required variables

```env
SPRING_PROFILES_ACTIVE=prod
FRONTEND_URL=https://your-frontend-domain
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-bytes
ADMIN_BOOTSTRAP_PASSWORD=replace-with-a-strong-initial-admin-password
STORAGE_ROOT=/app/storage/uploads
JAVA_OPTS=-XX:MaxRAMPercentage=75
```

## PostgreSQL variables

Use Railway PostgreSQL variables when available:

```env
PGHOST=...
PGPORT=5432
PGDATABASE=...
PGUSER=...
PGPASSWORD=...
```

Alternatively set JDBC variables manually:

```env
JDBC_DATABASE_URL=jdbc:postgresql://host:5432/database
JDBC_DATABASE_USERNAME=postgres
JDBC_DATABASE_PASSWORD=...
```

## Healthcheck

```http
GET /api/v1/health
```

## Build validation

```bash
mvn clean test
mvn package -DskipTests
```

## Production notes

File uploads are stored under `STORAGE_ROOT`. Railway filesystem storage is suitable for validation and demos. For permanent long-term document storage, attach persistent storage or migrate file objects to a controlled storage service approved by RIGHTWARE and the municipality.
