# Architecture Overview

This document outlines the architectural design of the Boane Conecta full-stack application, focusing on the modular monolith approach for the backend and the separation of concerns between frontend and backend.

## Modular Monolith Explanation

The backend is designed as a **modular monolith**. This approach combines the benefits of a monolithic application (single deployment unit, simplified development, easier refactoring) with the organizational advantages of microservices (clear module boundaries, high cohesion, low coupling).

Each module within the backend (`auth`, `users`, `roles`, `citizens`, `departments`, `districts`, `municipalservices`, `requests`, `documents`, `complaints`, `payments`, `appointments`, `notifications`, `content`, `reports`, `health`) is treated as a distinct logical unit with its own:

*   **Entities:** Data models representing the module's domain.
*   **Repositories:** Interfaces for data access operations.
*   **DTOs (Data Transfer Objects):** Objects for transferring data between layers, ensuring entities are not directly exposed.
*   **Services:** Encapsulate business logic, validations, and orchestrate interactions with repositories.
*   **Controllers:** Handle incoming HTTP requests, validate DTOs, and delegate business logic to services.

This structure promotes:

*   **Maintainability:** Changes within one module are less likely to affect others.
*   **Scalability (logical):** Modules can theoretically be extracted into separate microservices in the future if needed, with minimal refactoring.
*   **Team Autonomy:** Different teams can work on different modules with clear interfaces.

## Frontend/Backend Separation

The application strictly adheres to a **clear separation of concerns** between the frontend and backend.

*   **Frontend (`/frontend`):** A React/Vite/TypeScript application responsible for the user interface and user experience. It communicates with the backend exclusively through RESTful API calls.
*   **Backend (`/backend`):** A Java Spring Boot application providing the core business logic, data storage, authentication, authorization, and API endpoints consumed by the frontend.

This separation allows for independent development, deployment, and scaling of both components.

## Backend Modules

The backend is organized into the following main modules, each with its own responsibilities:

*   **`core`:** Contains cross-cutting concerns such as configuration, security utilities (JWT), exception handling, auditing, pagination, API response standardization, file storage utilities, and validation.
*   **`auth`:** Handles user authentication (login, registration, refresh tokens) and authorization mechanisms.
*   **`users`:** Manages user accounts and related operations.
*   **`roles`:** Manages user roles and permissions.
*   **`citizens`:** Manages citizen profiles, linked to user accounts.
*   **`departments`:** Manages municipal departments.
*   **`districts`:** Manages geographical districts.
*   **`municipalservices`:** Manages the various services offered by the municipality.
*   **`requests`:** Handles citizen requests for municipal services.
*   **`documents`:** Manages document uploads, storage, and retrieval.
*   **`complaints`:** Manages citizen complaints.
*   **`payments`:** Handles payment processing and records.
*   **`appointments`:** Manages appointment scheduling and slots.
*   **`notifications`:** Manages system notifications to users.
*   **`content`:** Manages public content such as news, notices, projects, tenders, gallery items, and FAQs.
*   **`reports`:** Provides reporting functionalities.
*   **`health`:** Provides a simple health check endpoint.

## Security Architecture

The security architecture is built upon Spring Security and includes:

*   **JWT (JSON Web Tokens):** Used for stateless authentication. Access tokens are short-lived, and refresh tokens are used to obtain new access tokens.
*   **BCrypt:** Used for secure password hashing.
*   **Role-Based Access Control (RBAC):** Access to API endpoints is controlled based on assigned user roles (SUPER_ADMIN, ADMIN, MANAGER, EDITOR, EMPLOYEE, CITIZEN).
*   **Ownership Checks:** Critical operations for citizen-specific resources include ownership checks in the service layer to ensure users can only access or modify their own data.
*   **CORS (Cross-Origin Resource Sharing):** Configured to allow requests from the frontend application.
*   **File Upload Security:** Includes validation for file size, MIME type, and prevention of path traversal vulnerabilities.
*   **Audit Logs:** Records significant user actions and system events for security monitoring and compliance.

## Storage Strategy

File storage is implemented locally within the backend application. Key aspects include:

*   **Configurable Root Directory:** Files are saved under a configurable `STORAGE_ROOT` directory (default: `./storage/uploads`).
*   **Metadata in Database:** Only file metadata (title, type, size, path, etc.) is stored in the `documents` table in the PostgreSQL database.
*   **Safe Filenames:** Internal filenames are generated to prevent conflicts and ensure security.
*   **Original Filename Preservation:** The original filename is stored as metadata.
*   **Validation:** File size and MIME types are validated during upload.
*   **Secure Download:** Download endpoints enforce authorization and ownership checks.

## Deployment Architecture

For local development, the application uses Docker Compose to orchestrate the backend and a PostgreSQL database. The backend is containerized, making it portable and easy to set up.

For production, a similar containerized approach is recommended, potentially leveraging Kubernetes or other container orchestration platforms. Database backups and robust environment variable management are critical for production deployments. A reverse proxy (e.g., Nginx) is suggested for serving the frontend, handling SSL termination, and routing API requests to the backend.
