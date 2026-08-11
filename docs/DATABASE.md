# Database Design

This document details the database schema, Flyway migrations, and seed data for the Boane Conecta backend application. PostgreSQL is used as the primary database.

## Table List and Relationships

The database schema is designed with UUID primary keys for all tables. Relationships between tables are established using foreign keys.

### Authentication and Authorization

| Table Name         | Description                                     | Relationships                                    |
| :----------------- | :---------------------------------------------- | :----------------------------------------------- |
| `users`            | Stores user account information.                | `user_roles` (one-to-many)                       |
| `roles`            | Defines user roles (e.g., SUPER_ADMIN, CITIZEN).| `user_roles` (one-to-many), `role_permissions` (one-to-many) |
| `permissions`      | Defines system permissions.                     | `role_permissions` (one-to-many)                 |
| `user_roles`       | Junction table for users and roles.             | `users` (many-to-one), `roles` (many-to-one)     |
| `role_permissions` | Junction table for roles and permissions.       | `roles` (many-to-one), `permissions` (many-to-one) |
| `refresh_tokens`   | Stores refresh tokens for JWT authentication.   | `users` (many-to-one)                            |
| `audit_logs`       | Records system and user actions.                | `users` (many-to-one, optional)                  |

### Citizen and Institutional Structure

| Table Name         | Description                                     | Relationships                                    |
| :----------------- | :---------------------------------------------- | :----------------------------------------------- |
| `districts`        | Stores information about geographical districts.| `citizen_profiles` (one-to-many)                 |
| `departments`      | Stores information about municipal departments. | `municipal_services` (one-to-many), `appointment_slots` (one-to-many) |
| `citizen_profiles` | Stores additional citizen-specific information. | `users` (one-to-one), `districts` (many-to-one)  |

### Services, Requests, and Documents

| Table Name           | Description                                     | Relationships                                    |
| :------------------- | :---------------------------------------------- | :----------------------------------------------- |
| `municipal_services` | Defines the services offered by the municipality.| `departments` (many-to-one), `service_requirements` (one-to-many), `service_fees` (one-to-many), `citizen_requests` (one-to-many) |
| `service_requirements`| Lists requirements for each municipal service.  | `municipal_services` (many-to-one)               |
| `service_fees`       | Lists fees associated with each municipal service.| `municipal_services` (many-to-one)               |
| `documents`          | Stores metadata for uploaded files.             | `users` (many-to-one, optional), `request_documents` (one-to-many), `payment_receipts` (one-to-one), `news` (one-to-one), `tenders` (one-to-one), `gallery_items` (one-to-one) |
| `citizen_requests`   | Stores citizen requests for services.           | `users` (many-to-one), `municipal_services` (many-to-one), `request_status_history` (one-to-many), `request_documents` (one-to-many), `payments` (one-to-many) |
| `request_status_history`| Tracks status changes for citizen requests.     | `citizen_requests` (many-to-one), `users` (many-to-one, optional) |
| `request_documents`  | Junction table for requests and documents.      | `citizen_requests` (many-to-one), `documents` (many-to-one) |

### Complaints, Payments, and Appointments

| Table Name             | Description                                     | Relationships                                    |
| :--------------------- | :---------------------------------------------- | :----------------------------------------------- |
| `complaints`           | Stores citizen complaints.                      | `users` (many-to-one, optional), `complaint_status_history` (one-to-many) |
| `complaint_status_history`| Tracks status changes for complaints.           | `complaints` (many-to-one), `users` (many-to-one, optional) |
| `payments`             | Records payment transactions.                   | `users` (many-to-one), `citizen_requests` (many-to-one, optional), `payment_receipts` (one-to-one) |
| `payment_receipts`     | Stores payment receipt information.             | `payments` (one-to-one), `documents` (many-to-one, optional) |
| `appointment_slots`    | Defines available time slots for appointments.  | `departments` (many-to-one), `appointments` (one-to-many) |
| `appointments`         | Records scheduled appointments.                 | `users` (many-to-one), `appointment_slots` (many-to-one) |

### Content and Notifications

| Table Name         | Description                                     | Relationships                                    |
| :----------------- | :---------------------------------------------- | :----------------------------------------------- |
| `notifications`    | Stores user notifications.                      | `users` (many-to-one)                            |
| `news`             | Stores news articles.                           | `documents` (one-to-one, optional), `users` (many-to-one, optional) |
| `notices`          | Stores public notices.                          | None                                             |
| `projects`         | Stores information about municipal projects.    | None                                             |
| `tenders`          | Stores information about public tenders.        | `documents` (one-to-one, optional)               |
| `gallery_items`    | Stores items for the public gallery.            | `documents` (one-to-one, optional)               |
| `faqs`             | Stores frequently asked questions.              | None                                             |

## Flyway Migrations

Flyway is used for managing database schema evolution. The following migrations are implemented:

*   **`V1__init_extensions.sql`**: Enables necessary PostgreSQL extensions, specifically `uuid-ossp` for UUID generation.
*   **`V2__auth_users_roles.sql`**: Creates tables related to authentication and authorization: `users`, `roles`, `permissions`, `user_roles`, `role_permissions`, `refresh_tokens`, and `audit_logs`.
*   **`V3__institutional_structure.sql`**: Creates tables for the institutional structure: `districts`, `departments`, and `citizen_profiles`.
*   **`V4__services_requests_documents.sql`**: Creates tables for municipal services, citizen requests, and documents: `municipal_services`, `service_requirements`, `service_fees`, `documents`, `citizen_requests`, `request_status_history`, and `request_documents`.
*   **`V5__complaints_payments_appointments.sql`**: Creates tables for complaints, payments, and appointments: `complaints`, `complaint_status_history`, `payments`, `payment_receipts`, `appointment_slots`, and `appointments`.
*   **`V6__content_notifications.sql`**: Creates tables for public content and notifications: `notifications`, `news`, `notices`, `projects`, `tenders`, `gallery_items`, and `faqs`.
*   **`V7__seed_initial_data.sql`**: Inserts initial data for roles, departments, and districts.

## Seed Data

The `V7__seed_initial_data.sql` migration seeds the following initial data:

*   **Roles:** `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `EDITOR`, `EMPLOYEE`, `CITIZEN`.
*   **Departments:** `Administração Municipal`, `Finanças e Tributos`, `Urbanização e Construção`, `Serviços Sociais`, `Atendimento ao Munícipe`.
*   **Districts:** `Boane`, `Matola Rio`, `Campoane`, `Mahubo`.

An initial `SUPER_ADMIN` user (`admin@boane.gov.mz` with password `ChangeMe123!`) is created via an application bootstrap component to ensure proper BCrypt hashing of the password.

## Enums

The following Java enums are used to represent fixed sets of values in the database and application logic:

*   `UserStatus`: `ACTIVE`, `INACTIVE`, `SUSPENDED`, `PENDING`
*   `ContentStatus`: `DRAFT`, `PUBLISHED`, `ARCHIVED`
*   `RequestStatus`: `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `WAITING_PAYMENT`, `APPROVED`, `REJECTED`, `CANCELLED`, `COMPLETED`
*   `ComplaintStatus`: `OPEN`, `IN_REVIEW`, `RESPONDED`, `RESOLVED`, `CLOSED`
*   `PaymentStatus`: `PENDING`, `CONFIRMED`, `REJECTED`, `CANCELLED`, `REFUNDED`
*   `AppointmentStatus`: `SCHEDULED`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `NO_SHOW`
*   `DocumentStatus`: `ACTIVE`, `ARCHIVED`, `REJECTED`
*   `Visibility`: `PUBLIC`, `PRIVATE`, `INTERNAL`
*   `Priority`: `LOW`, `NORMAL`, `HIGH`, `URGENT`
*   `SlotStatus`: `AVAILABLE`, `FULL`, `CANCELLED`, `BLOCKED`
