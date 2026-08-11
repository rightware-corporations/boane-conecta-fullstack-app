# Boane Conecta Fullstack

This repository contains the full-stack application for Boane Conecta, an institutional municipal/citizen services platform. It comprises a React/Vite/TypeScript frontend and a new Java Spring Boot backend.

## Repository Structure

```
boane-conecta-fullstack/
├── frontend/             # Existing React frontend application
├── backend/              # New Java Spring Boot backend application
├── docker-compose.yml    # Docker Compose for local development
├── .env.example          # Example environment variables
├── .gitignore            # Git ignore file
└── docs/                 # Project documentation
    ├── ARCHITECTURE.md
    ├── API_CONTRACT.md
    ├── DATABASE.md
    ├── SECURITY.md
    └── DEPLOYMENT.md
```

## Stack

### Frontend

*   **Framework:** React
*   **Build Tool:** Vite
*   **Language:** TypeScript

### Backend

*   **Language:** Java 21
*   **Framework:** Spring Boot 3.x
*   **Build Tool:** Maven
*   **Database:** PostgreSQL
*   **Persistence:** Spring Data JPA / Hibernate
*   **Database Migration:** Flyway
*   **Security:** Spring Security, JWT access tokens, refresh tokens, BCrypt password hashing, role-based access control
*   **Validation:** Bean Validation / Jakarta Validation

## How to Run Frontend Only

Navigate to the `frontend` directory and follow its `README.md` instructions. Typically:

```bash
cd frontend
npm install
npm run dev
```

## How to Run the Backend

Requirements: Java 21, Maven 3.9+, and PostgreSQL 16.

```bash
cd backend
mvn test
mvn spring-boot:run
```

The backend defaults to `http://localhost:8080`. Configure PostgreSQL and security with `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `JWT_SECRET`, `JWT_ACCESS_EXPIRATION`, `JWT_REFRESH_EXPIRATION`, `FRONTEND_URL`, and `ADMIN_BOOTSTRAP_PASSWORD`.

Quick verification:

```bash
curl http://localhost:8080/api/v1/health

curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@boane.gov.mz","password":"ChangeMe123!"}'
```

See `docs/API_CONTRACT.md` for registration, refresh, logout, current-user, password-change, curl, and Postman examples.

## Environment Variables

Copy `.env.example` to `.env` and fill in the values. These variables are used by `docker-compose.yml` and the backend application.

```bash
cp .env.example .env
```

## Default Admin Credentials

For initial setup and testing, a `SUPER_ADMIN` user is created with the following credentials:

*   **Email:** `admin@boane.gov.mz`
*   **Password:** `ChangeMe123!`

**Important:** Change this password immediately in a production environment.

For a new production database, set `ADMIN_BOOTSTRAP_PASSWORD` before the first startup. The default password is intended only for local development.

## API Overview

The backend exposes a REST API under the `/api/v1` prefix. Refer to `docs/API_CONTRACT.md` for a detailed list of endpoints, request/response formats, and authentication requirements.

Implemented backend modules currently include authentication/security, departments, districts, municipal services, service requirements, and service fees. Public catalog reads are available under `/api/v1/public/**`; administration routes use role-based access under `/api/v1/admin/**`. Requirements and fees support nested list/create/update/delete operations under their municipal service. Catalog entities use soft deletion (`INACTIVE`/`ARCHIVED`), while requirements and fees are hard-deleted.

## Troubleshooting

*   **Database connection issues:** Ensure your PostgreSQL container is running and accessible. Check the `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD` in your `.env` file.
*   **Backend startup failures:** Review the backend logs for error messages. Common issues include incorrect database configuration or missing dependencies.
*   **Frontend build errors:** Ensure all frontend dependencies are installed (`npm install`) and check for any syntax errors in the frontend code.

## Next Steps for Frontend Integration

The frontend currently contains Supabase integration. The next step is to modify the frontend to consume the new backend REST API. This involves:

1.  **Updating API calls:** Replace Supabase client calls with HTTP requests to the new Spring Boot backend endpoints.
2.  **Authentication flow:** Integrate the frontend with the JWT-based authentication and refresh token mechanism provided by the backend.
3.  **Data models:** Adjust frontend data models (interfaces/types) to match the backend DTOs.
4.  **Error handling:** Implement consistent error handling based on the backend's API response standard.

Refer to `docs/API_CONTRACT.md` for detailed backend API specifications.
